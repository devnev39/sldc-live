import { useEffect, useState } from "react";
// import data from "./testdata.test.json";
import { clearData, filterData, parseData } from "./features/data";
import {
  Button,
  ConfigProvider,
  DatePicker,
  Divider,
  Flex,
  Layout,
  Menu,
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
  GithubOutlined,
  LinkedinOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { DarkThemeContext } from "./context/themeContext";
import { inject } from "@vercel/analytics";
import { Chart } from "chart.js";
import { each } from "chart.js/helpers";

inject();

dayjs.extend(customParseFormat);

const dateFormat = "YYYY-MM-DD";

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
      }
      i.update();
    });
  };

  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setIsDarkTheme(true);
      Chart.defaults.color = chartJsDarkColor;
    } else {
      setIsDarkTheme(false);
      Chart.defaults.color = chartJsLightColor;
    }
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", changeColorTheme);

    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", changeColorTheme);
    };
  }, []);

  useEffect(() => {
    api.getDateData(date.format("YYYY-MM-DD")).then((docs) => {
      dispatch(clearData());
      dispatch(parseData(docs));
      dispatch(filterData());
    });
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
                    width: "35vw",
                    justifyContent: "center",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "25vw" }}>
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
        </DarkThemeContext.Provider>
      </ConfigProvider>
    </>
  );
}

export default App;
