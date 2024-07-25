import { useContext, useEffect } from "react";
// import data from "./testdata.test.json";
import {
  clearData,
  clearDataFrame,
  createDataFrame,
  filterData,
  parseData,
} from "./features/data";
import { ConfigProvider, Divider, Layout, theme } from "antd";
import Home from "./pages/Home";
import Stats from "./pages/Stats";
import About from "./pages/About";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import api from "./query/query";
import { Content, Footer } from "antd/es/layout/layout";
import { inject } from "@vercel/analytics";
import { Navbar } from "./components/Navbar";
import { DownloadModal } from "./components/DownloadModal";
import { NavbarContext } from "./context/navbarContext";
import FooterComponent from "./components/Footer";
import Analysis from "./pages/Analysis";
import { ThemeContext } from "./context/themeContext";
import { Timestamp } from "firebase/firestore";

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

  useEffect(() => {
    if (import.meta.env.VITE_APPMODE !== "DEBUG") {
      api.getAllParsedData().then((docs) => {
        dispatch(clearDataFrame());
        const data = [];
        for (let d of docs) {
          for (let key of Object.keys(d)) {
            let ts = new Timestamp(
              d[key].created_at.seconds,
              d[key].created_at.nanoseconds,
            );
            d[key]["created_at"] = ts.seconds;
            const ordered = Object.keys(d[key])
              .sort()
              .reduce((obj, k) => {
                obj[k] = d[key][k];
                return obj;
              }, {});
            data.push(ordered);
          }
        }
        dispatch(createDataFrame(data));
      });
    }

    return () => {
      dispatch(clearDataFrame());
    };
  }, [dispatch]);

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
            {current == "analysis" ? <Analysis /> : null}
            {current == "about" ? <About /> : null}
          </Content>
          <Divider />
          <Footer>
            <FooterComponent />
          </Footer>
        </Layout>
        <DownloadModal />
      </ConfigProvider>
    </>
  );
}

export default App;
