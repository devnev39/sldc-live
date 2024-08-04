import * as ort from "onnxruntime-web/webgpu";
import dayjs from "dayjs";
/**
 * Runs a single inference on provided data
 * data: An array of numbers
 * shape: The shape of provided data
 * modelSession: The current model session
 * The length of the data should be product of shape array
 */
export const runSingleInference = async (data, shape, modelSession) => {
  const tensor = new ort.Tensor("float64", data, shape);
  const feed = { x: tensor };
  const out = await modelSession.run(feed);
  return out;
};

/**
 * Remove columns from dataframe which are not in columnsToKeep
 * dataF: DataFrame
 * columnsToKeep: List of columns to keep
 * returns -> New dataframe with changes
 */
export const removeColumns = (dataF, columnsToKeep) => {
  const cols = [];
  for (let col of dataF.columns) {
    if (columnsToKeep.indexOf(col) == -1) cols.push(col);
  }
  return dataF.drop({ columns: cols });
};

/**
 * Scales the dataframe inplace
 * returns -> void
 */
export const scaleDf = (dataF, model) => {
  for (let column of Object.keys(model.train_mean)) {
    const series = dataF.column(column);
    series.apply(
      (e) => {
        return (e - model.train_mean[column]) / model.train_std[column];
      },
      { inplace: true },
    );
    dataF.drop({ columns: [column] });
    dataF.addColumn(column, series);
  }
};

/**
 * dataF: Dataframe to be converted into windowed data
 * model: Model based on the which the windowing going to happen
 * returns: array of [samples, data]
 * samples: Number represening total number of samples (window) in data
 * data: The actual float64 data array in flatten state
 */
export const windowAndGetData = (dataF, model) => {
  let size = dataF.shape[0];
  let tempArr = [];
  let samples = 0;

  for (let i = 0; i < size; i++) {
    const end = i + model.window_size;
    if (end > size) continue;
    samples += 1;
    const part = dataF.iloc({ rows: [`${i}:${end}`] });
    tempArr = tempArr.concat(part.values.flat());
  }
  const data = new Float64Array(tempArr);
  return [samples, data];
};

/**
 * model: Selected model object
 * subDf: Sub dataframe object (danfojs object)
 * modelSession: Modelsession built from onnx
 * Runs first inference for first inference on first model
 * After that this method doesn't need to be invoked.
 *
 * NOTE: This method is meant to run one time only after one render
 * Afterwards this method should not run
 *
 * returns: subdf with prediction column
 */
export const firstInference = async (model, subDf, modelSession) => {
  // Make inference on today's data
  // Make a copy of subDf
  // Run inference on the data and return a subdf with added prediction

  // tempDf will have the scaled values and removed columns
  //
  // 1. Remove columns and save to tempDf
  // 2. Scale with selected model props
  // 3. Prepare the data with model dims
  // 4. Forward pass the whole data once and get the predictions
  // 5. Attatch the resulting series to the subDf copy
  // 6. Add last row to the subdf
  // Return the subdf
  //
  let subdf = subDf.copy();

  let tempDf = removeColumns(subdf, model.columns);
  // tempDf.print();
  scaleDf(tempDf, model);
  // tempDf.print();
  // Reshape data with (samples, window_size, features)

  const [samples, data] = windowAndGetData(tempDf, model);
  const shape = [samples, model.window_size, model.columns.length];

  // console.log(shape);
  // console.log(data);

  const out = await runSingleInference(data, shape, modelSession);
  let preds = out.dense_1.cpuData.map((i) => {
    return i * model.train_std.state_demand + model.train_mean.state_demand;
  });

  preds = Array.from({ length: model.window_size }, () => NaN).concat(
    Array.from(preds),
  );
  // console.log(preds);
  console.log(subdf.shape);
  const value = preds.pop();

  // created_at, frequency, state_demand, state_gen, hour, dayOfWeek, month, --
  subdf = subdf.addColumn(model.tag_name, preds);

  const lastDay = subdf.column("created_at").iat(subdf.shape[0] - 1);

  subdf = subdf.append(
    [
      [
        dayjs(lastDay * 1000)
          .add(1, "hour")
          .unix(),
        null,
        value,
        null,
        dayjs(lastDay * 1000)
          .add(1, "hour")
          .hour(),
        dayjs(lastDay * 1000)
          .add(1, "hour")
          .day(),
        dayjs(lastDay * 1000)
          .add(1, "hour")
          .month(),
        value,
      ],
    ],
    [
      dayjs(lastDay * 1000)
        .add(1, "hour")
        .format("DD-MM-YYYY HH:mm:ss"),
    ],
  );

  return subdf;
};

/**
 * Runs iterative inference on the subdf
 * subdf: Dataframe to be provided
 * model: Selected model object
 * isFirstInference: Pass false if not first inference else True by default
 * returns: subdf with set number of predictions
 *
 */
export const runIterativeInference = async (
  subdf,
  model,
  modelSession,
  isFirstInference = true,
) => {
  let valuesToPredict =
    isFirstInference == false ? 48 : 48 + model.window_size - subdf.shape[0];

  // Initially make a scaled tempDf
  //
  let tempDf = null;
  if (isFirstInference) {
    tempDf = subdf.iloc({
      rows: [`${subdf.shape[0] - model.window_size}:`],
    });
  } else {
    tempDf = subdf.iloc({
      rows: [`:${model.window_size}`],
    });
  }

  tempDf = removeColumns(tempDf, model.columns);
  scaleDf(tempDf, model);

  let preds = [];
  while (valuesToPredict) {
    // tempDf.print();
    const [samples, data] = windowAndGetData(tempDf, model);
    const shape = [samples, model.window_size, model.columns.length];

    const out = await runSingleInference(data, shape, modelSession);

    const value = out.dense_1.cpuData[0];
    const scaledValue =
      value * model.train_std.state_demand + model.train_mean.state_demand;

    let lastDay = subdf.column("created_at").iat(subdf.shape[0] - 1);

    if (!isFirstInference)
      lastDay = dayjs(tempDf.index[tempDf.shape[0] - 1], "DD-MM-YYYY HH:mm:ss")
        .add(-5.5, "hour")
        .unix();

    tempDf = tempDf.append(
      [
        [
          value,
          (dayjs(lastDay * 1000)
            .add(1, "hour")
            .hour() -
            model.train_mean.hour) /
            model.train_std.hour,
          (dayjs(lastDay * 1000)
            .add(1, "hour")
            .day() -
            model.train_mean.dayOfWeek) /
            model.train_std.dayOfWeek,
          (dayjs(lastDay * 1000)
            .add(1, "hour")
            .month() -
            model.train_mean.month) /
            model.train_std.month,
        ],
      ],
      [
        dayjs(lastDay * 1000)
          .add(1, "hour")
          .format("DD-MM-YYYY HH:mm:ss"),
      ],
    );
    tempDf = tempDf.iloc({ rows: ["1:"] });

    if (isFirstInference) {
      subdf = subdf.append(
        [
          [
            dayjs(lastDay * 1000)
              .add(1, "hour")
              .unix(),
            NaN,
            scaledValue,
            NaN,
            dayjs(lastDay * 1000)
              .add(1, "hour")
              .hour(),
            dayjs(lastDay * 1000)
              .add(1, "hour")
              .day(),
            dayjs(lastDay * 1000)
              .add(1, "hour")
              .month(),
            scaledValue,
          ],
        ],
        [
          dayjs(lastDay * 1000)
            .add(1, "hour")
            .format("DD-MM-YYYY HH:mm:ss"),
        ],
      );
    } else {
      preds.push(scaledValue);
    }
    valuesToPredict -= 1;
  }
  if (!isFirstInference) {
    preds = Array.from({ length: model.window_size }, () => NaN).concat(preds);
    subdf = subdf.addColumn(model.tag_name, preds);
  }
  return subdf;
};
