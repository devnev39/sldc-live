import { useContext } from "react";
import { ConfigProvider, Divider, Layout, theme } from "antd";
import Home from "./pages/Home";
import Stats from "./pages/Stats";
import About from "./pages/About";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Content, Footer } from "antd/es/layout/layout";
import { inject } from "@vercel/analytics";
import { Navbar } from "./components/Navbar";
import { DownloadModal } from "./components/DownloadModal";
import { NavbarContext } from "./context/navbarContext";
import FooterComponent from "./components/Footer";
import Analysis from "./pages/Analysis";
import { ThemeContext } from "./context/themeContext";
import useRawData from "./hooks/useRawData";
import useParsedData from "./hooks/useParsedData";
import useModelsData from "./hooks/useModelsData";
// import * as tf from '@tensorflow/tfjs';

inject();

dayjs.extend(customParseFormat);

function App() {
  const { current } = useContext(NavbarContext);
  const { isDarkTheme } = useContext(ThemeContext);

  useRawData();
  useParsedData();
  useModelsData();

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
