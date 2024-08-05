import { Card, Col, Divider, Flex, Row, Select, Typography } from "antd";
import { useSelector } from "react-redux";
import boxPlotChart from "../charts/boxPlotChart";
import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../context/themeContext";
import changeChartColor from "../charts/changeChartColor";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  BoxPlotController,
  BoxAndWiskers,
} from "@sgratzl/chartjs-chart-boxplot";
import Annotation from "chartjs-plugin-annotation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BoxPlotController,
  BoxAndWiskers,
  Title,
  Tooltip,
  Legend,
  Annotation,
);

export default function Statistics() {
  const df = useSelector((state) => state.data.parsedDataFrame);
  const { isDarkTheme } = useContext(ThemeContext);

  const [statChartData, setStatChartData] = useState(boxPlotChart);
  const [periodParam, setPeriodParam] = useState("WeekDay");

  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    setStatChartData(() => {
      const chartData = JSON.parse(JSON.stringify(boxPlotChart));
      let labels = null;
      if (periodParam == "WeekDay") {
        labels = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
      } else {
        labels = Array.from({ length: 24 }).map((_, m) => m);
      }

      chartData.data.labels = labels;

      const data = [];

      if (periodParam == "WeekDay") {
        for (let i = 0; i < 7; i++) {
          let subdf = df.loc({ rows: df["dayOfWeek"].eq(i) });
          data.push(subdf.column("state_demand").values);
        }
      } else {
        for (let i of labels) {
          let subdf = df.loc({ rows: df["hour"].eq(i) });
          data.push(subdf.column("state_demand").values);
        }
      }

      chartData.data.datasets.push({
        label: "Demand range in MW",
        data: data,
      });

      return chartData;
    });
  }, [periodParam]);

  useEffect(() => {
    chartRef.current = new ChartJS(canvasRef.current, {
      type: "boxplot",
      data: statChartData.data,
      options: statChartData.options,
    });

    changeChartColor(isDarkTheme);

    return () => {
      chartRef.current.destroy();
    };
  }, [statChartData]);

  useEffect(() => {
    changeChartColor(isDarkTheme);
  }, []);
  return (
    <>
      <Divider />
      <Flex justify="center">
        <Typography.Title>Statistics</Typography.Title>
      </Flex>
      <Divider />
      <Row>
        <Col span={15} lg={{ span: 15 }} xs={{ span: 24 }} sm={{ span: 24 }}>
          <Flex justify="center">
            <Card style={{ width: "90%", height: "60vh" }}>
              <div className="stat-chart-div">
                <canvas ref={canvasRef} style={{ width: "100%" }} />
              </div>
            </Card>
          </Flex>
        </Col>
        <Col span={1} lg={{ span: 1 }} xs={{ span: 0 }} sm={{ span: 0 }}>
          <Flex justify="center">
            <Divider type="vertical" style={{ height: "50vh", margin: "0" }} />
          </Flex>
        </Col>
        <Col span={8} lg={{ span: 8 }} xs={{ span: 24 }} sm={{ span: 24 }}>
          <Card
            title={
              <>
                <Flex justify="center">
                  <Typography.Title level={3}>Controls</Typography.Title>
                </Flex>
              </>
            }
          >
            <Flex justify="center">
              <Row>
                <Col span={15}>
                  <Flex align="center" style={{ height: "100%" }}>
                    <Typography.Text strong>Data period</Typography.Text>
                  </Flex>
                </Col>
                <Col span={1}>
                  <Flex align="center" style={{ height: "100%" }}>
                    :
                  </Flex>
                </Col>
                <Col span={8}>
                  <Flex align="center" style={{ height: "100%" }}>
                    <Select
                      defaultValue={"WeekDay"}
                      options={["WeekDay", "Hour"].map((i) => {
                        return {
                          value: i,
                          label: i,
                        };
                      })}
                      onChange={(e) => {
                        setPeriodParam(e);
                      }}
                    ></Select>
                  </Flex>
                </Col>
              </Row>
            </Flex>
          </Card>
        </Col>
      </Row>
    </>
  );
}
