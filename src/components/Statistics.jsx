import { Card, Col, DatePicker, Divider, Flex, Row, Typography } from "antd";
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
            <Card style={{ width: "90%", height: "50vh" }}>
              <Flex justify="center">
                <Line
                  data={statTableChartData.data}
                  options={statTableChartData.options}
                />
                Chart Type
              </Flex>
            </Card>
          </Flex>
        </Col>
        <Col span={1}>
          <Flex justify="center">
            <Divider type="vertical" style={{ height: "50vh", margin: "0" }} />
          </Flex>
        </Col>
        <Col span={8}>
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
                <Col span={8}>
                  <Flex align="center" style={{ height: "100%" }}>
                    <Typography.Text strong>Data Range</Typography.Text>
                  </Flex>
                </Col>
                <Col span={1}>
                  <Flex align="center" style={{ height: "100%" }}>
                    :
                  </Flex>
                </Col>
                <Col span={15}>
                  <Flex align="center" style={{ height: "100%" }}>
                    <DatePicker.RangePicker />
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
