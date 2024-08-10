import {
  Alert,
  Card,
  Col,
  Descriptions,
  Divider,
  Flex,
  Row,
  Segmented,
  Select,
  Typography,
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { ThemeContext } from "../context/themeContext";
import changeChartColor from "../charts/changeChartColor";
import { useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useSubDf } from "../hooks/useSubDf";
import { getModelViewDescriptor } from "../utils/ModelViewDescriptor";
import useModelSession from "./useModelSession";
import useRunInference from "../hooks/useRunInference";
import useChartDataSetter from "../hooks/useChartDataSetter";
import useModelChartDataSetter from "../hooks/useModelChartDataSetter";

dayjs.extend(customParseFormat);

export default function Predictions() {
  const { isDarkTheme } = useContext(ThemeContext);

  const models = useSelector((state) => state.data.models);
  const df = useSelector((state) => state.data.parsedDataFrame);

  const [modelIndex, setModelIndex] = useState(0);

  const modelSession = useModelSession(models, modelIndex);

  const [period, setPeriod] = useState(0);

  const { subDf: subDfDefault, setSubDf: setSubDfDefault } = useSubDf(df);

  const { subDf } = useRunInference(
    modelSession,
    subDfDefault,
    setSubDfDefault,
    models,
    modelIndex,
  );

  const chartData = useChartDataSetter(subDf, period, models, df);

  const modelChartData = useModelChartDataSetter(models);

  useEffect(() => {
    changeChartColor(isDarkTheme);
  }, [chartData, modelChartData]);
  // set subDf to today's data initially
  // predict on the first model loaded for today 00:00 to tomorrow 23:00
  // on model change predict and save the predictions in parsedDataFrame in redux

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
            <Segmented
              className="period-segment"
              size="large"
              value={period}
              onChange={(value) => setPeriod(value)}
              options={[
                {
                  label: (
                    <div
                      style={{ margin: "0 1rem 0 1rem", fontWeight: "bold" }}
                    >
                      <div>{dayjs().add(-1, "day").format("DD-MM-YYYY")}</div>
                      <div>Yesterday</div>
                    </div>
                  ),
                  value: -1,
                },
                {
                  label: (
                    <div
                      style={{ margin: "0 1rem 0 1rem", fontWeight: "bold" }}
                    >
                      <div>{dayjs().format("DD-MM-YYYY")}</div>
                      <div>Today</div>
                    </div>
                  ),
                  value: 0,
                },
                {
                  label: (
                    <div
                      style={{ margin: "0 1rem 0 1rem", fontWeight: "bold" }}
                    >
                      <div>{dayjs().add(1, "day").format("DD-MM-YYYY")}</div>
                      <div>Tomorrow</div>
                    </div>
                  ),
                  value: 1,
                },
              ]}
            />
          </Flex>
          <Card style={{ marginTop: "3vh" }}>
            <div className="chartjs-width" style={{ width: "100%" }}>
              <Line data={chartData.data} options={chartData.options} />
            </div>
            <Divider />
            <Alert
              description={
                <div style={{ fontWeight: "500" }}>
                  Based only on 7 hours of data on{" "}
                  {dayjs().add(-2, "day").format("MMMM D YYYY")}, the day before
                  yesterday, the model is projecting the above results.
                </div>
              }
              message={
                <div style={{ fontWeight: "bold" }}>About above graph</div>
              }
              type="info"
              showIcon
            />
            <Alert
              style={{ marginTop: "1vh" }}
              description="The trained models' forecast is displayed in the above graphs. A model with fewer colour area is more accurate and has less inaccuracy."
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
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
}
