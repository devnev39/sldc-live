import { Card, Col, Divider, Flex, Row, Switch, Typography } from "antd";
import d from "../tmp/data.json";
import { Line } from "react-chartjs-2";
import dayjs from "dayjs";

import "./styles.css";

export default function Analysis() {
  const data = [];
  for (let i of d) {
    if (i.state_demand < 30000 && i.state_demand > 5000) {
      data.push(i);
    }
  }

  const chartData = {
    labels: data.map((i) =>
      dayjs(i.created_at * 1000).format("DD/MM/YYYY HH:mm:ss"),
    ),
    datasets: [
      {
        label: "State Demand",
        data: data.map((i) => i.state_demand),
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "State demand graph",
        font: {
          size: "20px",
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Time",
          font: {
            size: "16px",
            weight: "500",
          },
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "MW",
          font: {
            size: "16px",
            weight: "500",
          },
        },
      },
    },
  };
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
            />
          </Flex>
          <Card style={{ marginTop: "5vh" }}>
            <div className="chartjs-width" style={{ width: "100%" }}>
              <Line data={chartData} options={options} />
            </div>
          </Card>
        </Col>
        <Col span={2}>
          <Flex justify="center">
            <Divider type="vertical" style={{ height: "50vh" }} />
          </Flex>
        </Col>
        <Col span={7}>
          <Flex justify="center">
            <Typography.Title level={3}>Model Properties</Typography.Title>
          </Flex>
        </Col>
      </Row>
    </>
  );
}
