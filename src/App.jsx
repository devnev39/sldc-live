import { useEffect, useState } from "react";
// import data from "./testdata.test.json";
import { clearData, filterData, parseData } from "./features/data";
import { DatePicker, Flex, Menu } from "antd";
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

function App() {
  // Fetch the data and set to store

  const dispatch = useDispatch();

  const [date, setDate] = useState(dayjs(dayjs(), dateFormat));

  // TODO: Fetch the local data for testing

  useEffect(() => {
    api.getDateData(date.format("YYYY-MM-DD")).then((docs) => {
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
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <Flex justify="center" align="center">
          <Icon component={transmission} style={{ fontSize: "2.5rem" }} />
          <Title level={4}>SLDC Live (Kalwa)</Title>
        </Flex>
        <div
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
            />
          </div>

          <div>
            <DatePicker
              defaultValue={dayjs(date, dateFormat)}
              onChange={(e) => {
                setDate(dayjs(e, dateFormat));
              }}
              minDate={dayjs("2024-03-14", dateFormat)}
              maxDate={dayjs(dayjs(), dateFormat)}
            />
          </div>
        </div>
      </div>
      {current == "home" ? <Home /> : null}
      {current == "stats" ? <Stats /> : null}
      {current == "about" ? <About /> : null}
    </>
  );
}

export default App;
