import { Card, Col, Divider, Flex, Row, Statistic, Typography } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { Line } from "react-chartjs-2";
import "./styles.css";
import { green, red } from "@ant-design/colors";
import { useContext, useEffect } from "react";
import { ThemeContext } from "../context/themeContext";
import changeChartColor from "../charts/changeChartColor";

const Stats = () => {
  const charts = useSelector((state) => state.data.charts);
  const { isDarkTheme } = useContext(ThemeContext);

  useEffect(() => {
    changeChartColor(isDarkTheme);
  }, []);

  return (
    <>
      <Row style={{ marginTop: "1rem" }} className="stats-page-size">
        <Col span={10} xs={{ span: 24 }} md={{ span: 10 }}>
          <Flex justify="space-evenly">
            <Card>
              <Statistic
                title={
                  <Typography.Text type="warning" underline>
                    Last Running Time
                  </Typography.Text>
                }
                value={charts.serverUsageChart.data.datasets[0].data.slice(-1)}
                valueStyle={{
                  color: `${
                    charts.serverUsageChart.data.datasets[0].data.slice(-1) <
                    charts.serverUsageChart.data.datasets[0].data.slice(-2)
                      ? green.primary
                      : red.primary
                  }`,
                }}
                prefix={
                  charts.serverUsageChart.data.datasets[0].data.slice(-1) <
                  charts.serverUsageChart.data.datasets[0].data.slice(-2) ? (
                    <ArrowDownOutlined />
                  ) : (
                    <ArrowUpOutlined />
                  )
                }
                precision={2}
                suffix="Sec"
              />
            </Card>
            <Card>
              <Statistic
                title={
                  <Typography.Text type="warning" underline>
                    Memory Used
                  </Typography.Text>
                }
                value={charts.serverUsageChart.data.datasets[1].data.slice(-1)}
                valueStyle={{
                  color: `${charts.serverUsageChart.data.datasets[1].data.slice(-1) < charts.frequencyChart.data.datasets[0].data.slice(-2) ? green.primary : red.primary}`,
                }}
                prefix={
                  charts.serverUsageChart.data.datasets[1].data.slice(-1) <
                  charts.serverUsageChart.data.datasets[1].data.slice(-2) ? (
                    <ArrowDownOutlined />
                  ) : (
                    <ArrowUpOutlined />
                  )
                }
                precision={2}
                suffix="GiB"
              />
            </Card>
          </Flex>
        </Col>
        <Col xs={{ span: 0 }} md={{ span: 2 }}>
          <Flex justify="center">
            <Divider type="vertical" style={{ height: "25vh" }} />
          </Flex>
        </Col>
        <Divider className="small-screen-divider" />
        <Col span={10} xs={{ span: 24 }} md={{ span: 10 }}>
          <Flex justify="center">
            <Card>
              <div className="chartjs-width">
                <Line
                  data={charts.serverUsageChart.data}
                  options={charts.serverUsageChart.options}
                />
              </div>
            </Card>
          </Flex>
        </Col>
      </Row>
    </>
  );
};

export default Stats;
