import { useEffect, useState } from "react";
import data from "./testdata.test.json";
import { updateData } from "./features/data";
import { Flex, Menu } from "antd";
import transmission from "./assets/transmission.svg?react";
import Icon from "@ant-design/icons/lib/components/Icon";
import Title from "antd/es/typography/Title";
import Home from "./pages/Home";
import Stats from "./pages/Stats";
import About from "./pages/About";
// import api from "./query/query";

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

function App() {
  // Fetch the data and set to store

  // TODO: Fetch the local data for testing
  const fetchData = () => {
    // let date = new Date().toLocaleDateString().split("/");
    // [date[0],date[2]] = [date[2], date[0]];
    // date = date.join("-");
    // console.log(date);
    // api.getDateData(date).then((docs) => {
    //   console.log(docs);
    //   updateData(docs);
    // })
    updateData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [current, setCurrent] = useState("home");

  const onClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <Flex justify="center" align="center">
          <Icon component={transmission} style={{ fontSize: "2.5rem" }} />
          <Title level={4}>SLDC Live</Title>
        </Flex>
        <div style={{ width: "25vw" }}>
          <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={items}
          />
        </div>
      </div>
      {current == "home" ? <Home></Home> : null}
      {current == "stats" ? <Stats></Stats> : null}
      {current == "about" ? <About></About> : null}
    </>
  );
}

export default App;
