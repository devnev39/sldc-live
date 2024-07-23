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
import d from "../tmp/data.json";
import { Line } from "react-chartjs-2";
import dayjs from "dayjs";

export default function Predictions() {
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

  const selectedModelHistoryChartData = {
    charData: {
      lables: [],
      datasets: [
        {
          label: "",
          data: [],
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Model loss history",
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
            text: "Model Tag Name",
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
            text: "Loss",
            font: {
              size: "16px",
              weight: "500",
            },
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
                defaultValue={"Linear Regression"}
                options={[
                  { value: "normal.v1", label: "normal.v1" },
                  { value: "normal", label: "normal" },
                ]}
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
                <Line
                  data={selectedModelHistoryChartData.charData}
                  options={selectedModelHistoryChartData.options}
                />
              </Flex>
            </Card>
          </div>
        </Col>
      </Row>
    </>
  );
}
