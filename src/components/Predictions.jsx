import {
  Alert,
  Card,
  Col,
  Descriptions,
  Divider,
  Flex,
  List,
  Row,
  Select,
  Switch,
  Typography,
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import initialPredictionChartData from "../charts/predictionChart";
import { ThemeContext } from "../context/themeContext";
import changeChartColor from "../charts/changeChartColor";
import { useSelector } from "react-redux";
import { firstInference, runIterativeInference } from "../inference/inference";
import * as ort from "onnxruntime-web/webgpu";
import { useContext, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useSubDf } from "../hooks/useSubDf";
import modelHistoryChart from "../charts/modelHistoryChart";

ort.env.debug = true;
ort.env.wasm.numThreads = 1;

dayjs.extend(customParseFormat);

const getModelViewDescriptor = (model) => {
  const data = [
    `Epochs: ${model.epochs}`,
    `Window size: ${model.window_size}`,
    `Tensorflow version: ${model.version_info.tf}`,
    `Onnx version: ${model.version_info.onnx}`,
  ];
  return [
    {
      key: "1",
      label: "Model name",
      children: model.name,
      span: 3,
    },
    {
      key: "2",
      label: "Model tag name",
      children: <p className="model-tag">{model.tag_name}</p>,
      span: 3,
    },
    {
      key: "3",
      label: "Average loss",
      children: model.avg_loss,
      span: 3,
    },
    {
      key: "4",
      label: "Mean squared error",
      children: model.mse,
      span: 3,
    },
    {
      key: "5",
      label: "Validation loss",
      children: model.val_mse,
      span: 3,
    },
    {
      key: "8",
      label: "Training datapoints",
      children: (
        <p className="model-training-data">
          {model.train_data_size} ~ {Math.round(model.train_data_size / 24)}{" "}
          days
        </p>
      ),
      span: 3,
    },
    {
      key: "6",
      label: "Trained at",
      children: dayjs(model.created_at.seconds * 1000).format(
        "DD-MM-YYYY HH:mm:ss",
      ),
      span: 3,
    },
    {
      key: "7",
      label: "Other parameters",
      span: 3,
      children: (
        <>
          <List
            bordered
            dataSource={data}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </>
      ),
    },
  ];
};

export default function Predictions() {
  const { isDarkTheme } = useContext(ThemeContext);

  const models = useSelector((state) => state.data.models);
  const df = useSelector((state) => state.data.parsedDataFrame);

  const [modelIndex, setModelIndex] = useState(0);
  const [modelSession, setModelSession] = useState(null);

  const [chartData, setChartData] = useState(initialPredictionChartData);
  const [modelChartData, setModelChartData] = useState(modelHistoryChart);

  const [today, setToday] = useState(true);

  useEffect(() => {
    changeChartColor(isDarkTheme);
  }, [chartData, modelChartData]);
  const { subDf, setSubDf } = useSubDf(df);
  // set subDf to today's data initially
  // predict on the first model loaded for today 00:00 to tomorrow 23:00
  //
  // on model change predict and save the predictions in parsedDataFrame in redux

  const loadModel = async () => {
    const link = models[modelIndex].link;
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
      executionProviders: ["webgpu", "wasm"],
    };

    const session = await ort.InferenceSession.create(buffer, opt);
    setModelSession(session);
  };

  const runInference = async () => {
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
      subdf = await firstInference(models[modelIndex], subDf, modelSession);
      subdf = await runIterativeInference(
        subdf,
        models[modelIndex],
        modelSession,
      );
    } else {
      subdf = await runIterativeInference(
        subdf,
        models[modelIndex],
        modelSession,
        false,
      );
    }
    setSubDf(subdf);
  };

  useEffect(() => {
    if (!subDf) return;
    runInference();
  }, [subDf, modelSession]);

  useEffect(() => {
    loadModel();
  }, [models, modelIndex]);

  useEffect(() => {
    if (!subDf) return;

    setChartData(() => {
      const copy = JSON.parse(JSON.stringify(initialPredictionChartData));

      // Get subdf copy according to today parameter
      let subdf = null;

      const tdl = dayjs()
        .add(-dayjs().hour(), "hour")
        .add(-dayjs().minute(), "minute")
        .unix();
      const tdh = dayjs()
        .add(1, "day")
        .add(-dayjs().hour(), "hour")
        .add(-dayjs().minute(), "minute")
        .unix();

      if (today) {
        subdf = subDf.loc({
          rows: subDf["created_at"].gt(tdl).and(subDf["created_at"].lt(tdh)),
        });
      } else {
        subdf = subDf.loc({ rows: subDf["created_at"].gt(tdh) });
      }

      // set the chart values
      //
      copy.data.labels = subdf
        .column("created_at")
        .values.map((i) => dayjs(i * 1000).format("HH:mm"));

      if (today && dayjs().hour() < subdf.shape[0]) {
        const ts = subdf.iat(dayjs().hour(), 0);
        copy.options.plugins.annotation = {
          annotations: {
            line1: {
              type: "line",
              xMin: dayjs(ts * 1000).format("HH:mm"),
              xMax: dayjs(ts * 1000).format("HH:mm"),
              label: {
                display: true,
                content: "Pure predictions beyond this",
                position: "start",
              },
            },
          },
        };
      }

      copy.options.plugins.tooltip = {
        callbacks: {
          footer: (items) => {
            let footer = "";
            for (let i = 1; i < items.length; i++) {
              footer += `${items[i].dataset.label} Error: ${Math.round(Math.abs(items[0].raw - items[i].raw))}\n`;
            }
            return footer;
          },
        },
      };
      const today_start = dayjs()
        .add(-dayjs().hour(), "hour")
        .add(-dayjs().minute(), "minute")
        .unix();
      copy.data.datasets[0] = {
        data: today
          ? df
              .loc({ rows: df["created_at"].gt(today_start) })
              .column("state_demand").values
          : [],
        label: "Original State Demand",
        type: "line",
        fill: false,
        borderColor: "rgb(54, 162, 235, 0.5)",
        tension: 0.5,
      };

      for (let model of models) {
        if (subdf.columns.filter((c) => c == model.tag_name).length) {
          copy.data.datasets.push({
            data: subdf.column(model.tag_name).values,
            label: model.tag_name + " (predictions)",
            type: "line",
            fill: "-1",
            elements: {
              point: {
                pointStyle: "triangle",
                radius: 5,
              },
              line: {
                borderWidth: 2,
              },
            },
          });
        }
      }
      return copy;
    });
  }, [subDf, today]);

  useEffect(() => {
    setModelChartData(() => {
      const data = JSON.parse(JSON.stringify(modelHistoryChart));
      data.data.labels = models.map((i) => i.tag_name);

      const properties = ["mse", "val_mse"];

      for (let i of properties) {
        data.data.datasets.push({
          label: i,
          data: models.map((m) => m[i]),
          type: "bar",
        });
      }
      return data;
    });
  }, [models]);
  return (
    <>
      <Flex justify="center" align="center">
        <Typography.Title className="prediction-heading">
          Predictions
        </Typography.Title>
      </Flex>
      <Divider style={{ marginBottom: "0", marginTop: "0" }} />
      <Row>
        <Col span={13} lg={{ span: 13 }} sm={{ span: 24 }} xs={{ span: 24 }}>
          <Flex justify="center" align="center" style={{ marginTop: "5vh" }}>
            <Switch
              className="switch-button"
              checkedChildren={<>{"Tomorrow's predictions"}</>}
              unCheckedChildren={<>{"Today's original and predictions"}</>}
              onChange={(checked) => setToday(!checked)}
            />
          </Flex>
          <Card style={{ marginTop: "5vh" }}>
            <div className="chartjs-width" style={{ width: "100%" }}>
              <Line data={chartData.data} options={chartData.options} />
            </div>
            <Alert
              description="The trained models' forecast is displayed in the above graphs. A model with fewer colour area is more accurate and has less inaccuracy."
              message="About above graph"
              type="info"
              showIcon
            />
          </Card>
          <Card style={{ marginTop: "2vh" }}>
            <div className="chartjs-width" style={{ width: "100%" }}>
              <Line
                data={modelChartData.data}
                options={modelChartData.options}
              />
            </div>
          </Card>
        </Col>
        <Col span={1} xs={{ span: 0 }} sm={{ span: 0 }} lg={{ span: 1 }}>
          <Flex justify="center">
            <Divider type="vertical" style={{ height: "100vh" }} />
          </Flex>
        </Col>
        <Col span={9} xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 9 }}>
          <Card
            style={{ marginTop: "2rem" }}
            title={
              <Flex justify="center">
                <Typography.Title level={3}>Model Properties</Typography.Title>
              </Flex>
            }
          >
            <Row>
              <Col span={13}>
                <Typography.Text strong style={{ fontSize: "1.2rem" }}>
                  Select inference model
                </Typography.Text>
              </Col>
              <Col span={1}>
                <Typography.Text strong style={{ fontSize: "1.2rem" }}>
                  :
                </Typography.Text>
              </Col>
              <Col span={10}>
                <Select
                  className="model-select"
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
            <div style={{ marginTop: "1rem" }}>
              <Descriptions
                columns={2}
                bordered
                items={getModelViewDescriptor(models[modelIndex])}
              />
              {/* </Card> */}
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
}
