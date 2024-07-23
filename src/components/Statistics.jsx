import { Card, Col, Divider, Flex, Row, Typography } from "antd";
import { Line } from "react-chartjs-2";

export default function Statistics() {
  const statTableChartData = {
    data: {
      labels: [],
      datasets: [
        {
          label: "",
          data: [],
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        x: {
          display: true,
          title: {
            text: "Time",
            display: true,
          },
        },
        y: {
          display: true,
          title: {
            text: "MW",
            display: true,
          },
        },
      },
    },
  };
  return (
    <>
      <Divider />
      <Flex justify="center">
        <Typography.Title>Statistics</Typography.Title>
      </Flex>
      <Divider />

      <Row>
        <Col span={15}>
          <Flex justify="center">
            <Card style={{ width: "90%" }}>
              <Flex justify="center">
                <Line
                  data={statTableChartData.data}
                  options={statTableChartData.options}
                />
              </Flex>
            </Card>
          </Flex>
        </Col>
        <Col span={1}>
          <Flex justify="center">
            <Divider type="vertical" style={{ height: "50vh" }} />
          </Flex>
        </Col>
        <Col span={8}></Col>
      </Row>
    </>
  );
}
