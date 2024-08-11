import { Alert, Card, Col, Divider, Flex } from "antd";
import { Line } from "react-chartjs-2";

/**
 * graphRow: Object with chart1 & chart2 object containing following:
 * chart1 : {
 *  data: {},
 *  options: {},
 *  warning: bool,
 *  warningMessage: str
 * }
 */
function ChartRow({ graphRow }) {
  const { chart1, chart2 } = graphRow;
  return (
    <>
      <Col span={11} xs={{ span: 24 }} md={{ span: 11 }}>
        <Flex justify="center">
          <Card>
            <div className="chartjs-width">
              <Line data={chart1.data} options={chart1.options} />
            </div>
          </Card>
        </Flex>
        {chart1.warning ? (
          <Flex justify="center" style={{ marginTop: "1rem" }}>
            <Alert
              message={chart1.warningMessage}
              type="warning"
              showIcon
              closable
            />
          </Flex>
        ) : null}
      </Col>
      <Divider className="small-screen-divider" />
      <Col span={1} xs={{ span: 0 }} md={{ span: 1 }}>
        <Flex justify="center">
          <Divider type="vertical" style={{ height: "50vh" }} />
        </Flex>
      </Col>
      <Col span={11} xs={{ span: 24 }} md={{ span: 11 }}>
        <Flex justify="center">
          <Card>
            <div className="chartjs-width">
              <Line data={chart2.data} options={chart2.options} />
            </div>
          </Card>
        </Flex>
        {chart2.warning ? (
          <Flex justify="center" style={{ marginTop: "1rem" }}>
            <Alert
              message={chart2.warningMessage}
              type="warning"
              showIcon
              closable
            />
          </Flex>
        ) : null}
      </Col>
    </>
  );
}

export default ChartRow;
