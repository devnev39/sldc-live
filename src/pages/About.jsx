import { Divider, Flex, Typography } from "antd";
import cloudRun from "../assets/cloud_run.svg?react";
import eventarc from "../assets/eventarc.svg?react";
import firebase from "../assets/firebase.svg?react";
import google_cloud from "../assets/google_cloud.svg?react";
import ocr from "../assets/ocr.svg?react";
import arrow from "../assets/arrow.svg?react";
import Icon from "@ant-design/icons/lib/components/Icon";

const About = () => {
  return (
    <>
      <Divider />
      <Flex justify="center">
        <div style={{ width: "75vw" }}>
          <Typography.Text style={{ fontSize: "24px" }}>
            SLDC Live fetches real-time generation data for Maharashtra from
            SLDC Kalwa in image format. An Optical Character Recognition (OCR)
            model then processes the image to extract the data and store it in
            Firestore.
          </Typography.Text>
          <Divider />
          <div>
            <Typography.Title level={3}>Architecture</Typography.Title>
          </div>
          <Typography.Text style={{ fontSize: "24px" }}>
            The image processing and data extraction service runs on Google
            Cloud Run. Eventarc triggers the FastAPI service every hour to
            process the SLDC Kalwa image and extract generation data for
            Maharashtra. The extracted data is then stored in Firestore with
            timestamps for easy retrieval.
          </Typography.Text>
          <div style={{ marginTop: "2rem" }}>
            <Flex justify="center">
              <Icon component={google_cloud} style={{ fontSize: "4rem" }} />
            </Flex>
            <Flex justify="space-evenly" style={{ marginTop: "2rem" }}>
              <Icon component={eventarc} style={{ fontSize: "4rem" }} />
              <Icon component={arrow} style={{ fontSize: "2rem" }} />
              <Icon component={cloudRun} style={{ fontSize: "4rem" }} />
              <Icon component={arrow} style={{ fontSize: "2rem" }} />
              <Icon component={ocr} style={{ fontSize: "4rem" }} />
              <Icon component={arrow} style={{ fontSize: "2rem" }} />
              <Icon component={firebase} style={{ fontSize: "4rem" }} />
            </Flex>
          </div>
        </div>
      </Flex>
    </>
  );
};

export default About;
