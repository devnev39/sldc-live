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
import { Line } from "react-chartjs-2";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/themeContext";
import changeChartColor from "../charts/changeChartColor";
import { useSelector } from "react-redux";

export default function Predictions() {
  const { isDarkTheme } = useContext(ThemeContext);

  useEffect(() => {
    changeChartColor(isDarkTheme);
  }, []);

  const [today, setToday] = useState(true);
  const [subDf, setSubDf] = useState(null);

  const [chartData, setChartData] = useState({
    labels: subDf ? subDf.index.map((i) => i.toString()) : [],
    datasets: [
      {
        data: subDf ? subDf["state_demand"].values : [],
        label: "State Demand",
      },
    ],
  });

  const df = useSelector((state) => state.data.parsedDataFrame);

  useEffect(() => {
    // let yl = dayjs().add(-1, "day").add(-dayjs().hour(), "hours").add(-dayjs().minute(), "minutes").toString();
    // yl = dayjs(yl).unix();

    let tdl = dayjs()
      .add(-dayjs().hour(), "hours")
      .add(-dayjs().minute(), "minutes")
      .toString();
    tdl = dayjs(tdl).unix();

    let tdh = dayjs()
      .add(24 - dayjs().hour(), "hours")
      .add(60 - dayjs().minute(), "minutes")
      .toString();
    tdh = dayjs(tdh).unix();

    let tomH = dayjs()
      .add(1, "day")
      .add(24 - dayjs().hour(), "hours")
      .add(60 - dayjs().minute(), "minutes")
      .toString();
    tomH = dayjs(tomH).unix();

    let sdf = null;
    if (today) {
      sdf = df.loc({
        rows: df["created_at"].gt(tdl).and(df["created_at"].lt(tdh)),
      });
      setSubDf(sdf);
    } else {
      sdf = df.loc({
        rows: df["created_at"].gt(tdh).and(df["created_at"].lt(tomH)),
      });
      setSubDf(sdf);
    }
    sdf.print();
  }, [today, df]);

  useEffect(() => {
    // subDf.print();
    setChartData({
      labels: subDf ? subDf.index.map((i) => i.toString()) : [],
      datasets: [
        {
          data: subDf ? subDf["state_demand"].values : [],
          label: "State Demand",
        },
      ],
    });
  }, [subDf]);

  useEffect(() => {
    console.log(chartData);
  }, [chartData]);

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
              defaultChecked
              onChange={(checked) => setToday(checked)}
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
