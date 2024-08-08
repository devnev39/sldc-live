import { Alert, Card, Col, Divider, Flex, Row, Table, Typography } from "antd";
import { useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/themeContext";
import changeChartColor from "../charts/changeChartColor";
import { Steps } from "intro.js-react";
import "intro.js/introjs.css";
import { NavbarContext } from "../context/navbarContext";
import CardTemplate from "../components/CardTemplate";
import ChartRow from "../components/ChartRow";
import useCardPropSets from "../hooks/useCardPropSets";
import useGetChartRows from "../hooks/useGetChartRows";

const steps = [
  {
    element: ".home-heading",
    intro:
      "This page gives information about generation and demand. It gives a detailed breakdown on the generation for Maharashtra State.",
  },
];

const Home = () => {
  const tables = useSelector((state) => state.data.tables);

  const { isDarkTheme } = useContext(ThemeContext);

  const [renderCount, setRenderCount] = useState(0);
  const { showIntro } = useContext(NavbarContext);

  const [enabled, setEnabled] = useState(false);

  const [cardPropsSet1, cardPropsSet2] = useCardPropSets();

  const [graphRow1, graphRow2, graphRow3] = useGetChartRows();

  useEffect(() => {
    if (renderCount == 0) {
      setRenderCount(1);
      return;
    }
    setEnabled(true);
  }, [showIntro]);

  const onIntroExit = () => {
    setEnabled(false);
  };

  useEffect(() => {
    changeChartColor(isDarkTheme);
  }, [graphRow1]);

  return (
    <>
      <Steps
        enabled={enabled}
        steps={steps}
        initialStep={0}
        onExit={() => onIntroExit()}
      />
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
      {cardPropsSet1.length ? (
        cardPropsSet1.filter((e) => e.title == "Frequency")[0].avg < 48 ? (
          <Row style={{ marginBottom: "1rem" }}>
            <Col>
              <Alert
                message="ATTENTION ! The source SCADA image is skewed due to some reasons resulting in bad values! The issue will be solved by 15th May!"
                type="error"
                showIcon
                closable
              />
            </Col>
          </Row>
        ) : null
      ) : null}
      <Row>
        {/*  Two scetions one for main params and one for sub params */}
        <Col span={11} xs={{ span: 24 }} md={{ span: 11 }}>
          {/* Main Param Section */}
          <Flex justify="space-evenly">
            {cardPropsSet1.map((e, i) => (
              <Card key={i}>
                <CardTemplate
                  title={e.title}
                  value={e.value}
                  increased={e.increased}
                  suffix={e.suffix}
                  precision={e.precision}
                />
                <Typography.Text>
                  Avg :<Typography.Text mark>{e.avg}</Typography.Text>
                </Typography.Text>
              </Card>
            ))}
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
            {cardPropsSet2.map((e, i) => (
              <Card key={i}>
                <CardTemplate
                  title={e.title}
                  value={e.value}
                  increased={e.increased}
                  suffix={e.suffix}
                />
                <Typography.Text>
                  Avg :<Typography.Text mark>{e.avg}</Typography.Text>
                </Typography.Text>
              </Card>
            ))}
          </Flex>
        </Col>
      </Row>
      <Divider />
      <Row>{graphRow1 ? <ChartRow graphRow={graphRow1} /> : null}</Row>
      <Divider />
      <Row>{graphRow2 ? <ChartRow graphRow={graphRow2} /> : null}</Row>
      <Divider />
      <Row>{graphRow3 ? <ChartRow graphRow={graphRow3} /> : null}</Row>
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
