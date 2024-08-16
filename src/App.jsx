import { useContext } from "react";
import { ConfigProvider, Divider, Layout, theme } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { inject } from "@vercel/analytics";
import { Content, Footer } from "antd/es/layout/layout";
import { Home, Stats, Analysis, About } from "./pages/index.js";
import { Navbar, DownloadModal } from "./components/Navbar/index.js";
import { NavbarContext, ThemeContext } from "./context/index.js";
import FooterComponent from "./components/Footer";
import { useRawData, useParsedData, useModelsData } from "./hooks/App/index.js";

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
