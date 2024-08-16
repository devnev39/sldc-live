import { Card, Col, Divider, Flex, Row, Select, Typography } from "antd";
import { useSelector } from "react-redux";
import { useContext, useEffect, useRef, useState } from "react";
import { Chart as ChartJS } from "chart.js";
import { boxPlotChart, changeChartColor } from "../../charts/index.js";
import { ThemeContext } from "../../context/index.js";

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
        <Typography.Title className="stat-heading">Statistics</Typography.Title>
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
            style={{ marginTop: "1rem" }}
            title={
              <>
                <Flex justify="center">
                  <Typography.Title level={3}>Controls</Typography.Title>
                </Flex>
              </>
            }
          >
            <Flex justify="center">
              <div>
                <Row>
                  <Col span={12}>
                    <Flex align="center" style={{ height: "100%" }}>
                      <Typography.Text strong>Data period</Typography.Text>
                    </Flex>
                  </Col>
                  <Col span={1}>
                    <Flex align="center" style={{ height: "100%" }}>
                      :
                    </Flex>
                  </Col>
                  <Col span={11}>
                    <Flex
                      align="center"
                      justify="end"
                      style={{ height: "100%" }}
                    >
                      <Select
                        className="period-select"
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
                <Row style={{ marginTop: "1rem" }}>
                  <Col span={12}>
                    <Flex align="center" style={{ height: "100%" }}>
                      <Typography.Text strong>
                        Total data recorded
                      </Typography.Text>
                    </Flex>
                  </Col>
                  <Col span={1}>
                    <Flex align="center" style={{ height: "100%" }}>
                      :
                    </Flex>
                  </Col>
                  <Col span={11}>
                    <Flex align="center" style={{ height: "100%" }}>
                      <Typography.Text>
                        {df.shape[0]} ~ {Math.round(df.shape[0] / 24)} days
                      </Typography.Text>
                    </Flex>
                  </Col>
                </Row>
              </div>
            </Flex>
          </Card>
        </Col>
      </Row>
    </>
  );
}
