import { Col, Flex, Row, Typography } from "antd";

export default function Analysis() {
  return (
    <>
      <Row style={{ height: "70vh" }}>
        <Col span={24}>
          <Flex justify="center" align="center" style={{ height: "100%" }}>
            <Typography.Title>
              Analysis and Forecast for{" "}
              <Typography.Title mark>state demand</Typography.Title> will be
              available soon!
            </Typography.Title>
          </Flex>
        </Col>
      </Row>
    </>
  );
}
