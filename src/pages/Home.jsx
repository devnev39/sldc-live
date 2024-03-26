import { Alert, Card, Col, Divider, Flex, Row, Table, Typography } from "antd";
import Statistic from "antd/es/statistic/Statistic";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import "./styles.css";
import { green, red } from "@ant-design/colors";

const Home = () => {
  const charts = useSelector((state) => state.data.charts);
  const tables = useSelector((state) => state.data.tables);

  const getValue = (data) => {
    let len = data.length;
    let value = data[len - 1];
    while (isNaN(value) && len > 1) {
      value = data[--len];
    }
    return value;
  };

  const getMovement = (data) => {
    let len = data.length;
    let val1 = data[len - 1];
    if (len == 1) return 0;
    let val2 = data[len - 2];

    while (isNaN(val1) && len > 1) {
      val1 = data[--len];
    }
    while (isNaN(val2) && len > 1) {
      val2 = data[--len];
    }

    if (val1 == val2) return 0;
    else if (val1 > val2) return 1;
    else return -1;
  };

  return (
    <>
      <Row style={{ marginBottom: "1rem" }}>
        <Col>
          <Alert
            message="Data updates occur at rounded hourly intervals. Be aware that some timestamps might be absent due to unreliable data in the source image."
            type="warning"
            showIcon
            closable
          />
        </Col>
      </Row>
      <Row>
        {/*  Two scetions one for main params and one for sub params */}
        <Col span={11} xs={{ span: 24 }} md={{ span: 11 }}>
          {/* Main Param Section */}
          <Flex justify="space-evenly">
            <Card>
              <Statistic
                title={
                  <Typography.Text underline className="font-600">
                    Frequency
                  </Typography.Text>
                }
                value={charts.frequencyChart.data.datasets[0].data.slice(-1)}
                valueStyle={{
                  color: `${charts.frequencyChart.data.datasets[0].data.slice(-1) < charts.frequencyChart.data.datasets[0].data.slice(-2) ? red.primary : green.primary}`,
                }}
                prefix={
                  charts.frequencyChart.data.datasets[0].data.slice(-1) <
                  charts.frequencyChart.data.datasets[0].data.slice(-2) ? (
                    <ArrowDownOutlined />
                  ) : (
                    <ArrowUpOutlined />
                  )
                }
                precision={2}
                suffix="Hz"
              />
            </Card>
            <Card>
              <Statistic
                title={
                  <Typography.Text className="font-600" underline>
                    State Demand
                  </Typography.Text>
                }
                value={getValue(charts.stateGenChart.data.datasets[1].data)}
                valueStyle={{
                  color: `${getMovement(charts.stateGenChart.data.datasets[1].data) == -1 ? red.primary : green.primary}`,
                }}
                prefix={
                  getMovement(charts.stateGenChart.data.datasets[1].data) ==
                  -1 ? (
                    <ArrowDownOutlined />
                  ) : (
                    <ArrowUpOutlined />
                  )
                }
                suffix="MW"
              />
            </Card>
            <Card>
              <Statistic
                title={
                  <Typography.Text className="font-600" underline>
                    State Generated
                  </Typography.Text>
                }
                value={getValue(charts.stateGenChart.data.datasets[0].data)}
                valueStyle={{
                  color: `${getMovement(charts.stateGenChart.data.datasets[0].data) == -1 ? red.primary : green.primary}`,
                }}
                prefix={
                  getMovement(charts.stateGenChart.data.datasets[0].data) ==
                  -1 ? (
                    <ArrowDownOutlined />
                  ) : (
                    <ArrowUpOutlined />
                  )
                }
                suffix="MW"
              />
            </Card>
          </Flex>
        </Col>
        <Divider className="small-screen-divider" />
        <Col span={1} xs={{ span: 0 }} md={{ span: 1 }}>
          <Flex justify="center">
            <Divider type="vertical" style={{ height: "20vh" }} />
          </Flex>
        </Col>
        <Col span={12} xs={{ span: 24 }} md={{ span: 12 }}>
          {/* Sub Param Section */}
          <Flex justify="space-evenly">
            <Card>
              <Statistic
                title={
                  <Typography.Text className="font-600" underline>
                    COAL+GAS
                  </Typography.Text>
                }
                value={getValue(
                  charts.generationDistChart.data.datasets[0].data,
                )}
                valueStyle={{
                  color: `${getMovement(charts.generationDistChart.data.datasets[0].data) == -1 ? red.primary : green.primary}`,
                }}
                prefix={
                  getMovement(
                    charts.generationDistChart.data.datasets[0].data,
                  ) == -1 ? (
                    <ArrowDownOutlined />
                  ) : (
                    <ArrowUpOutlined />
                  )
                }
                precision={2}
                suffix="MW"
              />
            </Card>
            <Card>
              <Statistic
                title={
                  <Typography.Text className="font-600" underline>
                    HYDRO
                  </Typography.Text>
                }
                value={getValue(
                  charts.generationDistChart.data.datasets[1].data,
                )}
                valueStyle={{
                  color: `${getMovement(charts.generationDistChart.data.datasets[1].data) == -1 ? red.primary : green.primary}`,
                }}
                prefix={
                  getMovement(
                    charts.generationDistChart.data.datasets[1].data,
                  ) == -1 ? (
                    <ArrowDownOutlined />
                  ) : (
                    <ArrowUpOutlined />
                  )
                }
                suffix="MW"
              />
            </Card>
            <Card>
              <Statistic
                title={
                  <Typography.Text className="font-600" underline>
                    OTHER PROVIDERS TOTAL
                  </Typography.Text>
                }
                value={getValue(
                  charts.generationDistChart.data.datasets[2].data,
                )}
                valueStyle={{
                  color: `${getMovement(charts.generationDistChart.data.datasets[2].data) == -1 ? red.primary : green.primary}`,
                }}
                prefix={
                  getMovement(
                    charts.generationDistChart.data.datasets[2].data,
                  ) == -1 ? (
                    <ArrowDownOutlined />
                  ) : (
                    <ArrowUpOutlined />
                  )
                }
                suffix="MW"
              />
            </Card>
          </Flex>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={11} xs={{ span: 24 }} md={{ span: 11 }}>
          <Flex justify="center">
            <Card>
              <div className="chartjs-width">
                <Line
                  data={charts.frequencyChart.data}
                  options={charts.frequencyChart.options}
                />
              </div>
            </Card>
          </Flex>
          <Flex justify="center" style={{ marginTop: "1rem" }}>
            <Alert
              message="Frequency data is rounded to 49 sometimes due to no detection of decimal !"
              type="warning"
              showIcon
              closable
            />
          </Flex>
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
                <Line
                  data={charts.generationDistChart.data}
                  options={charts.generationDistChart.options}
                />
              </div>
            </Card>
          </Flex>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col xs={{ span: 24 }} md={{ span: 11 }}>
          <Flex justify="center">
            <Card>
              <div className="chartjs-width">
                <Line
                  data={charts.stateGenChart.data}
                  options={charts.stateGenChart.options}
                />
              </div>
            </Card>
          </Flex>
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
                <Line
                  data={charts.coalGenerationChart.data}
                  options={charts.coalGenerationChart.options}
                />
              </div>
            </Card>
          </Flex>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col xs={{ span: 24 }} md={{ span: 11 }}>
          <Flex justify="center">
            <Card>
              <div className="chartjs-width">
                <Line
                  data={charts.mumbaiExchangeChart.data}
                  options={charts.mumbaiExchangeChart.options}
                />
              </div>
            </Card>
          </Flex>
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
                <Line
                  data={charts.privateGenerationChart.data}
                  options={charts.privateGenerationChart.options}
                />
              </div>
            </Card>
          </Flex>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col xs={{ span: 24 }} md={{ span: 11 }}>
          <Flex justify="center">
            <Card>
              <div className="chartjs-width" style={{ height: "60vh" }}>
                <Table
                  columns={tables.centralSectorTable.columns}
                  dataSource={tables.centralSectorTable.data}
                  bordered
                  title={() => (
                    <Typography.Text style={{ fontSize: "24px" }}>
                      Central Sector
                    </Typography.Text>
                  )}
                />
              </div>
            </Card>
          </Flex>
          <Flex justify="center" style={{ marginTop: "1rem" }}>
            <Alert
              message="These values aren't filtered !"
              type="warning"
              showIcon
              closable
            />
          </Flex>
        </Col>
        <Col span={1} xs={{ span: 0 }} md={{ span: 1 }}>
          <Flex justify="center">
            <Divider type="vertical" style={{ height: "50vh" }} />
          </Flex>
        </Col>
      </Row>
    </>
  );
};

export default Home;
