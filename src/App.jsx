import { useEffect, useState } from "react";
// import data from "./testdata.test.json";
import { clearData, filterData, parseData } from "./features/data";
import {
  Badge,
  Button,
  Checkbox,
  ConfigProvider,
  DatePicker,
  Divider,
  Flex,
  Layout,
  Menu,
  Modal,
  Typography,
  theme,
} from "antd";
import transmission from "./assets/transmission.svg?react";
import Icon from "@ant-design/icons/lib/components/Icon";
import Title from "antd/es/typography/Title";
import Home from "./pages/Home";
import Stats from "./pages/Stats";
import About from "./pages/About";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import api from "./query/query";
import { Content, Footer, Header } from "antd/es/layout/layout";
import {
  CloudDownloadOutlined,
  GithubOutlined,
  LinkedinOutlined,
  MoonOutlined,
  StarFilled,
  SunOutlined,
} from "@ant-design/icons";
import { DarkThemeContext } from "./context/themeContext";
import { inject } from "@vercel/analytics";
import { Chart } from "chart.js";
import { each } from "chart.js/helpers";
import {
  availableDownloads,
  defaultDownloads,
} from "./commons/downloadOptions";
import {
  filteredDataToWorkbook,
  preprocessDocs,
  s2ab,
} from "./preprocessor/preprocess";

inject();

dayjs.extend(customParseFormat);

const dateFormat = "YYYY-MM-DD";

const APPMODE = "";

const items = [
  {
    label: "SLDC LIVE",
    key: "home",
  },
  {
    label: "Server stats",
    key: "stats",
  },
  {
    label: "Predictions",
    key: "preds",
  },
  {
    label: "About",
    key: "about",
  },
];

const chartJsDarkColor = "#FFFFFFD9";
const chartJsDarkBorderColor = "#FFFFFF40";

const chartJsLightColor = "#666";
const chartJsLightBorderColor = "#00000040";

function App() {
  // Fetch the data and set to store

  const dispatch = useDispatch();

  const [date, setDate] = useState(dayjs(dayjs(), dateFormat));
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const [dateRange, setDateRange] = useState([
    dayjs(dayjs().subtract(2, "days")),
    dayjs(dayjs()),
  ]);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [checkedList, setCheckedList] = useState(defaultDownloads);

  const checkAll = availableDownloads.length === checkedList.length;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < availableDownloads.length;

  const onChange = (list) => {
    console.log(list);
    setCheckedList(list);
  };

  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? availableDownloads : []);
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const [spin, setSpin] = useState(true);

  // TODO: Fetch the local data for testing

  const changeColorTheme = (event) => {
    if (event.matches) {
      setIsDarkTheme(true);
      Chart.defaults.color = chartJsDarkColor;
    } else {
      setIsDarkTheme(false);
      Chart.defaults.color = chartJsLightColor;
    }
    each(Chart.instances, (i) => {
      for (let scale in i.config.options.scales) {
        i.config.options.scales[scale].grid.color = event.matches
          ? chartJsDarkBorderColor
          : chartJsLightBorderColor;
        i.config.options.scales[scale].grid.color = event.matches
          ? chartJsDarkBorderColor
          : chartJsLightBorderColor;

        i.config.options.scales[scale].grid.borderColor = event.matches
          ? chartJsDarkColor
          : chartJsLightColor;
        i.config.options.scales[scale].grid.borderColor = event.matches
          ? chartJsDarkColor
          : chartJsLightColor;

        // Update axes label font color
        i.config.options.scales[scale].ticks.color = event.matches
          ? chartJsDarkColor
          : chartJsLightColor;
        i.config.options.scales[scale].ticks.color = event.matches
          ? chartJsDarkColor
          : chartJsLightColor;

        i.config.options.scales[scale].title.color = event.matches
          ? chartJsDarkColor
          : chartJsLightColor;
      }
      i.update();
    });
  };

  const downloadData = async () => {
    // Download docs
    // Screen with selected fields
    // Preprocess the data
    // Arrange in sheets

    // Download the data
    try {
      setLoading(true);
      const data = [];
      for (
        let day = dateRange[0];
        day <= dateRange[1];
        day = day.add(1, "days")
      ) {
        const docs = await api.getDateData(day.format("YYYY-MM-DD"));
        data.push(docs);
        // console.log(day.format("YYYY-MM-DD"));
      }

      if (!data.length) throw new Error("Data not found");

      // Screen with selected fields
      // Preprocess the data
      for (let i = 0; i < data.length; i++) {
        const docs = preprocessDocs(data[i], checkedList);
        data[i] = docs;
      }

      console.log(data);

      // Arrage in sheets
      const workbookBinaryString = filteredDataToWorkbook(data, checkedList);

      const blob = new Blob([s2ab(workbookBinaryString)], {
        type: "application/octet-stream",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `SLDC_${dayjs(dateRange[0]).format("MMM_DD_YYYY")}_${dayjs(dateRange[0]).format("MMM_DD_YYYY")}.xlsx`;
      link.click();
      URL.revokeObjectURL(link.href);
      setLoading(false);
    } catch (e) {
      console.log(e);
      window.alert(e);
      setLoading(false);
    }
  };
  useEffect(() => {
    // This useEffect is used for :
    // Check for dark mode
    // Check for prefers-color-scheme
    // Spin animation code
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      changeColorTheme({ matches: true });
    } else {
      changeColorTheme({ matches: false });
    }
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", changeColorTheme);

    const i = setInterval(() => {
      setSpin(true);
      setTimeout(() => setSpin(false), 3000);
    }, 5000);
    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", changeColorTheme);
      clearInterval(i);
    };
  }, []);

  useEffect(() => {
    // This useffect is used for :
    // Fetch the data
    // Parse the data
    // Filter the data
    if (APPMODE !== "DEBUG") {
      api.getDateData(date.format("YYYY-MM-DD")).then((docs) => {
        dispatch(clearData());
        dispatch(parseData(docs));
        dispatch(filterData());
      });
    }
    return () => {
      dispatch(clearData());
    };
  }, [date, dispatch]);

  const [current, setCurrent] = useState("home");

  const onClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
      >
        <DarkThemeContext.Provider value={isDarkTheme}>
          <Layout>
            <Header className="header-height-min">
              <Flex justify="space-evenly">
                <Flex justify="center" align="center">
                  <Icon
                    component={transmission}
                    style={{ fontSize: "2.5rem", color: "white" }}
                  />
                  <Title style={{ color: "#FFFFFFD9" }} level={4}>
                    SLDC Live (Kalwa)
                  </Title>
                </Flex>
                <Flex
                  style={{
                    width: "50vw",
                    justifyContent: "center",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "30vw",
                      marginRight: "0",
                      paddingRight: "0",
                    }}
                  >
                    <Menu
                      onClick={onClick}
                      selectedKeys={[current]}
                      mode="horizontal"
                      items={items}
                      theme="dark"
                    />
                  </div>

                  <div>
                    <DatePicker
                      defaultValue={dayjs(date, dateFormat)}
                      onChange={(e) => {
                        setDate(dayjs(e, dateFormat));
                      }}
                      minDate={dayjs(dayjs().subtract(15, "days"), dateFormat)}
                      maxDate={dayjs(dayjs(), dateFormat)}
                    />
                  </div>
                  <Button
                    onClick={() => changeColorTheme({ matches: !isDarkTheme })}
                    style={{ marginLeft: "1rem" }}
                    icon={isDarkTheme ? <SunOutlined /> : <MoonOutlined />}
                  ></Button>
                  <Badge
                    dot
                    color="success"
                    count={<StarFilled spin={spin} style={{ color: "#f50" }} />}
                  >
                    <Button
                      style={{ marginLeft: "1rem" }}
                      icon={<CloudDownloadOutlined />}
                      onClick={showModal}
                    ></Button>
                  </Badge>
                </Flex>
              </Flex>
            </Header>
            <Content>
              {current == "home" ? <Home /> : null}
              {current == "stats" ? <Stats /> : null}
              {current == "about" ? <About /> : null}
            </Content>
            <Divider />
            <Footer>
              <Flex justify="center">
                <div>
                  <div>
                    <Typography.Text style={{ fontSize: "16px" }}>
                      Developed and maintained by @devnev39
                    </Typography.Text>
                  </div>
                  <div>
                    <Flex justify="center">
                      <Button type="text" href="https://github.com/devnev39">
                        <GithubOutlined style={{ fontSize: "2rem" }} />
                      </Button>
                      <Divider style={{ height: "2vw" }} type="vertical" />
                      <Button
                        type="text"
                        href="https://www.linkedin.com/in/bhuvanesh-bonde-58793615b"
                      >
                        <LinkedinOutlined style={{ fontSize: "2rem" }} />
                      </Button>
                    </Flex>
                  </div>
                </div>
              </Flex>
            </Footer>
          </Layout>
          <Modal
            open={open}
            title={<Title level={3}>Download data</Title>}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
              <Button key={"back"} onClick={handleCancel}>
                Close
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={loading}
                onClick={downloadData}
                disabled={!dateRange}
              >
                Download
              </Button>,
            ]}
          >
            {/* <Flex> */}
            <div>
              <Checkbox
                indeterminate={indeterminate}
                onChange={onCheckAllChange}
                checked={checkAll}
              >
                Check all
              </Checkbox>
              <Divider />
              <Checkbox.Group
                options={availableDownloads}
                value={checkedList}
                onChange={onChange}
              />
            </div>
            {/* </Flex> */}
            <Flex
              justify="center"
              align="center"
              gap={15}
              style={{ marginTop: "2rem" }}
            >
              <Typography.Text strong underline>
                Select FROM and TO date :
              </Typography.Text>
              <DatePicker.RangePicker
                onChange={(date) => {
                  setDateRange(date);
                }}
                defaultValue={[
                  (dateRange && dateRange[0]) || dayjs(dayjs()),
                  (dateRange && dateRange[1]) || dayjs(dayjs()),
                ]}
                maxDate={dayjs(dayjs(), dateFormat)}
                minDate={dayjs(dayjs().subtract(14, "days"), dateFormat)}
              />
            </Flex>
          </Modal>
        </DarkThemeContext.Provider>
      </ConfigProvider>
    </>
  );
}

export default App;
