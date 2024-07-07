import { useContext, useEffect } from "react";
// import data from "./testdata.test.json";
import { clearData, filterData, parseData } from "./features/data";
import {
  Button,
  ConfigProvider,
  Divider,
  Flex,
  Layout,
  Typography,
  theme,
} from "antd";
import Home from "./pages/Home";
import Stats from "./pages/Stats";
import About from "./pages/About";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import api from "./query/query";
import { Content, Footer } from "antd/es/layout/layout";
import { GithubOutlined, LinkedinOutlined } from "@ant-design/icons";
import { ThemeContext } from "./context/themeContext";
import { inject } from "@vercel/analytics";
import { Navbar } from "./components/Navbar";
import { DownloadModal } from "./components/DownloadModal";
import { NavbarContext } from "./context/navbarContext";

inject();

dayjs.extend(customParseFormat);

function App() {
  const dispatch = useDispatch();

  const { date, current } = useContext(NavbarContext);

  const { isDarkTheme } = useContext(ThemeContext);

  useEffect(() => {
    // This useffect is used for :
    // Fetch the data
    // Parse the data
    // Filter the data
    if (import.meta.env.VITE_APPMODE !== "DEBUG") {
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

  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
      >
        <Layout>
          <Navbar />
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
        <DownloadModal />
      </ConfigProvider>
    </>
  );
}

export default App;
