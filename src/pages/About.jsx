import { Divider, Flex, Typography } from "antd";
import cloudRun from "../assets/cloud_run.svg?react";
import eventarc from "../assets/eventarc.svg?react";
import firebase from "../assets/firebase.svg?react";
import google_cloud from "../assets/google_cloud.svg?react";
import ocr from "../assets/ocr.svg?react";
import ocr_white from "../assets/ocr_white.svg?react";
import arrow from "../assets/arrow.svg?react";
import arrow_white from "../assets/arrow_white.svg?react";
import react from "../assets/react.svg?react";
import redux from "../assets/redux.svg?react";
import ant from "../assets/ant.svg?react";
import Icon from "@ant-design/icons/lib/components/Icon";
import "./styles.css";
import { useContext } from "react";
import { ThemeContext } from "../context/themeContext";

const About = () => {
  const { isDarkTheme: theme } = useContext(ThemeContext);
  return (
    <>
      <Flex style={{ marginTop: "1rem" }} justify="center">
        <div style={{ width: "75vw" }}>
          <Typography.Text style={{ fontSize: "24px" }}>
            SLDC Live fetches real-time generation data for Maharashtra from
            SLDC Kalwa in image format. An Optical Character Recognition (OCR)
            model then processes the image to extract the data and store it in
            Firestore.
          </Typography.Text>
          <Divider />
          <div>
            <Typography.Title level={2}>Architecture</Typography.Title>
          </div>
          <Typography.Text style={{ fontSize: "24px" }}>
            The image processing and data extraction service runs on Google
            Cloud Run. Eventarc triggers the FastAPI service every hour to
            process the SLDC Kalwa image and extract generation data for
            Maharashtra. The extracted data is then stored in Firestore with
            timestamps for easy retrieval.
          </Typography.Text>
          <div style={{ marginTop: "2rem" }}>
            <Flex justify="center" align="center">
              <Icon component={google_cloud} style={{ fontSize: "4rem" }} />
              <Typography.Text style={{ marginLeft: "1rem", fontSize: "24px" }}>
                Google Cloud
              </Typography.Text>
            </Flex>
            <Flex
              justify="space-evenly"
              align="center"
              style={{ marginTop: "2rem" }}
            >
              <div>
                <Flex justify="center">
                  <Icon component={eventarc} className="icon-size" />
                </Flex>
                <Flex justify="center" style={{ marginTop: "1rem" }}>
                  <Typography.Text>Event Arc</Typography.Text>
                </Flex>
              </div>
              <Icon
                component={theme ? arrow_white : arrow}
                className="arrow-icon-size"
              />
              <div>
                <Flex justify="center">
                  <Icon component={cloudRun} className="icon-size" />
                </Flex>
                <Flex justify="center" style={{ marginTop: "1rem" }}>
                  <Typography.Text>Cloud Run Service</Typography.Text>
                </Flex>
              </div>
              <Icon
                component={theme ? arrow_white : arrow}
                className="arrow-icon-size"
              />
              <div>
                <Flex justify="center">
                  <Icon
                    component={theme ? ocr_white : ocr}
                    className="icon-size"
                  />
                </Flex>
                <Flex justify="center" style={{ marginTop: "1rem" }}>
                  <Typography.Text>OCR Detection</Typography.Text>
                </Flex>
              </div>
              <Icon
                component={theme ? arrow_white : arrow}
                className="arrow-icon-size"
              />
              <div>
                <Flex justify="center">
                  <Icon component={firebase} className="icon-size" />
                </Flex>
                <Flex justify="center" style={{ marginTop: "1rem" }}>
                  <Typography.Text>Firestore DB</Typography.Text>
                </Flex>
              </div>
            </Flex>
          </div>
          <Divider />
          <div>
            <Typography.Title level={2}>FrontEnd</Typography.Title>
          </div>
          <Flex justify="space-evenly" style={{ marginTop: "2rem" }}>
            <div>
              <Flex justify="center">
                <Icon component={react} className="icon-size" />
              </Flex>
              <Flex justify="center" style={{ marginTop: "1rem" }}>
                <Typography.Text>React</Typography.Text>
              </Flex>
            </div>
            <div>
              <Flex justify="center">
                <Icon component={ant} className="icon-size" />
              </Flex>
              <Flex justify="center" style={{ marginTop: "1rem" }}>
                <Typography.Text>Ant Design UI</Typography.Text>
              </Flex>
            </div>
            <div>
              <Flex justify="center">
                <Icon component={redux} className="icon-size" />
              </Flex>
              <Flex justify="center" style={{ marginTop: "1rem" }}>
                <Typography.Text>Redux</Typography.Text>
              </Flex>
            </div>
          </Flex>
        </div>
      </Flex>
    </>
  );
};

export default About;
