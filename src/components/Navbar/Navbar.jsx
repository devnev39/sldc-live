import { Badge, Button, DatePicker, Menu } from "antd";
import transmission from "../../assets/transmission.svg?react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  CloudDownloadOutlined,
  MoonOutlined,
  QuestionCircleOutlined,
  StarFilled,
  SunOutlined,
} from "@ant-design/icons";
import { Header } from "antd/es/layout/layout";
import { useContext, useEffect, useState } from "react";
import Icon from "@ant-design/icons/lib/components/Icon";
import { ThemeContext, NavbarContext } from "../../context/index.js";

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
  const { current, onClick, date, setDate, showModal, setShowIntro } =
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
          <div className="navbar-title">SLDC Live (Kalwa)</div>
        </div>
        <div className="navbar-set-2">
          <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={items}
            theme="dark"
          />
        </div>
        <div className="navbar-set-3">
          <div>
            <DatePicker
              defaultValue={date}
              onChange={(e) => {
                setDate(dayjs(e, dateFormat));
              }}
              minDate={dayjs(dayjs().subtract(15, "days"), dateFormat)}
              maxDate={dayjs(dayjs(), dateFormat)}
            />
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
            <Button
              className="start-intro"
              onClick={() => setShowIntro(true)}
              icon={<QuestionCircleOutlined />}
              type="primary"
              style={{ marginLeft: "1rem" }}
              danger
            ></Button>
          </div>
        </div>
      </div>
    </Header>
  );
};
