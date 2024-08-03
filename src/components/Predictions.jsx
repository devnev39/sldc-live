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
import { ThemeContext } from "../context/themeContext";
import changeChartColor from "../charts/changeChartColor";
import { useSelector } from "react-redux";
import { firstInference, runIterativeInference } from "../inference/inference";
import * as ort from "onnxruntime-web/webgpu";
import { useContext, useEffect, useState } from "react";

ort.env.debug = true;
ort.env.wasm.numThreads = 1;

dayjs.extend(customParseFormat);

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
    subdf.head(10).print();
    subdf.tail(10).print();

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
