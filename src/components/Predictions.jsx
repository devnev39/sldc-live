import {
  Card,
  Col,
  Divider,
  Flex,
  Row,
  Select,
  Switch,
  Typography,
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/themeContext";
import changeChartColor from "../charts/changeChartColor";
import { useSelector } from "react-redux";
import * as ort from "onnxruntime-web/webgpu";

ort.env.debug = true;
ort.env.wasm.numThreads = 1;

dayjs.extend(customParseFormat);

// dayjs.tz.setDefault("Asia/Kolkata");

export default function Predictions() {
  const { isDarkTheme } = useContext(ThemeContext);

  const models = useSelector((state) => state.data.models);
  const df = useSelector((state) => state.data.parsedDataFrame);

  const [modelIndex, setModelIndex] = useState(0);
  const [modelSession, setModelSession] = useState(null);

  const [today, setToday] = useState(true);
  console.log(today);

  useEffect(() => {
    changeChartColor(isDarkTheme);
  }, []);

  const [subDf, setSubDf] = useState(null);

  // set subDf to today's data initially
  // predict on the first model loaded for today 00:00 to tomorrow 23:00
  //
  // on model change predict and save the predictions in parsedDataFrame in redux

  useEffect(() => {
    if (df == null) return;
    // Implement window size
    let tdl = dayjs()
      .add(-dayjs().hour() - 13, "hours")
      .add(-dayjs().minute() - 30, "minutes")
      .toString();
    tdl = dayjs(tdl).unix();
    const subdf = df.loc({ rows: df["created_at"].gt(tdl) });
    console.log(subdf.shape);
    subdf.print();
    setSubDf(subdf);
  }, []);

  const loadModel = async () => {
    const link = models[modelIndex].link;
    console.log(link);
    const cache = await caches.open("onnx");
    let resp = await cache.match(link);
    if (resp == undefined) {
      await cache.add(link);
      resp = await cache.match(link);
      console.log("Model cached!");
    } else {
      console.log("Model loaded from cache!");
    }
    const buffer = await resp.arrayBuffer();
    const opt = {
      executionProviders: ["webgpu"],
    };

    const session = await ort.InferenceSession.create(buffer, opt);
    setModelSession(session);
  };

  /**
   * Runs a single inference on provided data
   * data: An array of numbers
   * shape: The shape of provided data
   * The length of the data should be product of shape array
   */
  const runSingleInference = async (data, shape) => {
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
  const removeColumns = (dataF, columnsToKeep) => {
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
  const scaleDf = (dataF, model) => {
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
  const windowAndGetData = (dataF, model) => {
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
   * Runs first inference for first inference on first model
   * After that this method doesn't need to be invoked.
   *
   * NOTE: This method is meant to run one time only after one render
   * Afterwards this method should not run
   *
   * returns: subdf with prediction column
   */
  const firstInference = async () => {
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
    const model = models[modelIndex];
    let subdf = subDf.copy();

    let tempDf = removeColumns(subdf, model.columns);
    tempDf.print();
    scaleDf(tempDf, model);
    tempDf.print();
    // Reshape data with (samples, window_size, features)

    const [samples, data] = windowAndGetData(tempDf, model);
    const shape = [samples, model.window_size, model.columns.length];

    console.log(shape);
    console.log(data);

    const out = await runSingleInference(data, shape);
    let preds = out.dense_1.cpuData.map((i) => {
      return i * model.train_std.state_demand + model.train_mean.state_demand;
    });

    preds = Array.from({ length: model.window_size }, () => NaN).concat(
      Array.from(preds),
    );
    console.log(preds);
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
   * returns: subdf with set number of predictions
   *
   */
  const runIterativeInference = async (subdf, isFirstInference = true) => {
    const model = models[modelIndex];

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

      const out = await runSingleInference(data, shape);

      const value = out.dense_1.cpuData[0];
      const scaledValue =
        value * model.train_std.state_demand + model.train_mean.state_demand;

      let lastDay = subdf.column("created_at").iat(subdf.shape[0] - 1);

      if (!isFirstInference)
        lastDay = dayjs(
          tempDf.index[tempDf.shape[0] - 1],
          "DD-MM-YYYY HH:mm:ss",
        )
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
      preds = Array.from({ length: model.window_size }, () => NaN).concat(
        preds,
      );
      subdf = subdf.addColumn(model.tag_name, preds);
    }
    return subdf;
  };

  const runInference = async () => {
    console.log(subDf.columns);
    console.log(models[modelIndex]);
    console.log("Running inference -> ");
    if (
      subDf.columns.filter((i) => i == models[modelIndex].tag_name).length != 0
    )
      return;
    if (!modelSession) return;

    let isFirstInference = true;

    for (let model of models) {
      if (subDf.columns.filter((i) => i == model.tag_name).length) {
        isFirstInference = false;
        break;
      }
    }

    let subdf = subDf.copy();

    if (isFirstInference) {
      subdf = await firstInference();
      subdf = await runIterativeInference(subdf);
    } else {
      subdf = await runIterativeInference(subdf, false);
    }
    subdf.head(10).print();
    subdf.tail(10).print();

    console.log(subdf.shape);
    setSubDf(subdf);
  };

  useEffect(() => {
    if (!subDf) return;
    runInference();
  }, [subDf, modelSession]);

  useEffect(() => {
    loadModel();
  }, [models, modelIndex]);
  return (
    <>
      <Flex justify="center" align="center">
        <Typography.Title>Predictions</Typography.Title>
      </Flex>
      <Divider style={{ marginBottom: "0", marginTop: "0" }} />
      <Row>
        <Col span={15}>
          <Flex justify="center" align="center" style={{ marginTop: "5vh" }}>
            <Switch
              checkedChildren={<>Tomorrow</>}
              unCheckedChildren={<>Today</>}
              defaultChecked
              onChange={(checked) => setToday(checked)}
            />
          </Flex>
          <Card style={{ marginTop: "5vh" }}>
            <div className="chartjs-width" style={{ width: "100%" }}>
              {/* <Line data={chartData} options={options} /> */}
            </div>
          </Card>
        </Col>
        <Col span={1}>
          <Flex justify="center">
            <Divider type="vertical" style={{ height: "50vh" }} />
          </Flex>
        </Col>
        <Col span={8}>
          <Flex justify="center">
            <Typography.Title level={3}>Model Properties</Typography.Title>
          </Flex>
          <Row>
            <Col span={10}>
              <Typography.Text strong style={{ fontSize: "1.2rem" }}>
                Select Model
              </Typography.Text>
            </Col>
            <Col span={1}>
              <Typography.Text strong style={{ fontSize: "1.2rem" }}>
                :
              </Typography.Text>
            </Col>
            <Col span={13}>
              <Select
                defaultValue={models.length ? models[0].tag_name : ""}
                options={models.map((m, i) => {
                  return {
                    value: i,
                    label: m.tag_name,
                  };
                })}
                onChange={(e) => {
                  setModelIndex(e);
                }}
              ></Select>
            </Col>
          </Row>
          <div style={{ marginTop: "2rem" }}>
            <Card title="Selected Model"></Card>
            {/* Show model data */}
          </div>
          <div style={{ marginTop: "2rem" }}>
            {/* Show model history and other models
                - 2 graphs */}
            <Card>
              <Flex justify="center">
                {/* <Line */}
                {/*   data={selectedModelHistoryChartData.charData} */}
                {/*   options={selectedModelHistoryChartData.options} */}
                {/* /> */}
              </Flex>
            </Card>
          </div>
        </Col>
      </Row>
    </>
  );
}
