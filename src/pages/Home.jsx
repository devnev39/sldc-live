import { Alert, Card, Col, Divider, Flex, Row, Table, Typography } from "antd";
import { useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import { Steps } from "intro.js-react";
import { ThemeContext } from "../context/index.js";
import { changeChartColor } from "../charts/index.js";
import { NavbarContext } from "../context/navbarContext";
import { CardTemplate, ChartRow } from "../components/Home/index.js";
import { useCardPropSets, useGetChartRows } from "../hooks/Home/index.js";

const steps = [
  {
    element: ".start-intro",
    intro: "Press this button to know contents of any page!",
  },
  {
    element: ".home-heading",
    intro:
      "This page gives information about generation and demand. It gives a detailed breakdown on the generation for Maharashtra State.",
  },
];
const Home = () => {
  const tables = useSelector((state) => state.data.tables);

  const status = useSelector((state) => state.data.status);

  const { isDarkTheme } = useContext(ThemeContext);

  const { showIntro, setShowIntro } = useContext(NavbarContext);

  const [enabled, setEnabled] = useState(false);

  const [cardPropsSet1, cardPropsSet2] = useCardPropSets();

  const [graphRow1, graphRow2, graphRow3] = useGetChartRows();

  useEffect(() => {
    setEnabled(showIntro);
  }, [showIntro]);

  const onIntroExit = () => {
    setShowIntro(false);
    setEnabled(false);

    let introStatus = localStorage.getItem("intro");
    if (introStatus) {
      introStatus = JSON.parse(introStatus);
      if (!introStatus.home) setShowIntro(true);
      introStatus.home = true;
      localStorage.setItem("intro", JSON.stringify(introStatus));
    } else {
      setShowIntro(true);
      introStatus = {
        analysis: false,
        home: true,
        navbar: false,
      };
      localStorage.setItem("intro", JSON.stringify(introStatus));
    }
  };

  useEffect(() => {
    changeChartColor(isDarkTheme);
  }, [graphRow1]);

  return (
    <>
      <Steps
        enabled={enabled}
        steps={steps}
        onExit={() => onIntroExit()}
        initialStep={0}
        options={{
          showProgress: true,
          skipLabel: "skip",
          hideNext: false,
        }}
      />
      {status.scada_stalled ? (
        <>
          <Flex justify="center" style={{ width: "100vw" }}>
            <Alert
              style={{ width: "50vw" }}
              message={
                <div style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                  SCADA update stalled !
                </div>
              }
              description={
                <div style={{ fontWeight: "600", fontSize: "1rem" }}>
                  {`The scada image update has been stalled for some reasons. The stall is for unknown time. The data is not REALTIME now, resulting in same data duplication. Last true update was at ${dayjs(status.stalled_at.seconds * 1000).format("DD/MM/YYYY HH:mm:ss")}. Sorry for the inconvinience!`}
                </div>
              }
              type="warning"
              showIcon
            />
          </Flex>
        </>
      ) : null}
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
                message="ATTENTION ! The source SCADA image is skewed due to some reasons resulting in bad values! The issue will be solved by today or couple of days!"
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
