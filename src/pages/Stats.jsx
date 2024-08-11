import { Card, Col, Divider, Flex, Row, Statistic, Typography } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { Line } from "react-chartjs-2";
import { green, red } from "@ant-design/colors";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/themeContext";
import changeChartColor from "../charts/changeChartColor";
import { Steps } from "intro.js-react";
import { NavbarContext } from "../context/navbarContext";

const steps = [
  {
    element: ".home-heading",
    intro:
      "This page gives information about the running time of the GCP cloud run instance for running the OCR!",
  },
];

const Stats = () => {
  const charts = useSelector((state) => state.data.charts);
  const { isDarkTheme } = useContext(ThemeContext);

  const [renderCount, setRenderCount] = useState(0);
  const { showIntro } = useContext(NavbarContext);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (renderCount == 0) {
      setRenderCount(1);
      return;
    }
    setEnabled(true);
  }, [showIntro]);

  useEffect(() => {
    changeChartColor(isDarkTheme);
  }, []);

  const onExit = () => {
    setEnabled(false);
  };

  return (
    <>
      <Steps
        enabled={enabled}
        steps={steps}
        onExit={() => onExit()}
        initialStep={0}
      />
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
