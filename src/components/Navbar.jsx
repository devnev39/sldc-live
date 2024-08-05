import { Badge, Button, DatePicker, Flex, Menu, Typography } from "antd";
import transmission from "../assets/transmission.svg?react";
import Icon from "@ant-design/icons/lib/components/Icon";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  CloudDownloadOutlined,
  MoonOutlined,
  StarFilled,
  SunOutlined,
} from "@ant-design/icons";
import { Header } from "antd/es/layout/layout";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/themeContext";
import { NavbarContext } from "../context/navbarContext";

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
    label: "Analysis",
    key: "analysis",
  },
  {
    label: "About",
    key: "about",
  },
];

export const Navbar = () => {
  const { isDarkTheme, changeColorTheme } = useContext(ThemeContext);
  const { current, onClick, date, setDate, showModal } =
    useContext(NavbarContext);

  const [spin, setSpin] = useState(true);

  useEffect(() => {
    // This useEffect is used for :
    // Spin animation code

    const i = setInterval(() => {
      setSpin(true);
      setTimeout(() => setSpin(false), 3000);
    }, 5000);
    return () => {
      clearInterval(i);
    };
  }, []);

  return (
    <Header className="header-height-min">
      <div className="navbar">
        <div className="navbar-icon-heading-position">
          <Icon
            component={transmission}
            style={{ fontSize: "2.5rem", color: "white" }}
          />
          <Typography.Text
            style={{ color: "#FFFFFFD9" }}
            className="navbar-title-size"
          >
            SLDC Live (Kalwa)
          </Typography.Text>
        </div>
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
              defaultValue={date}
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
      </div>
    </Header>
  );
};
