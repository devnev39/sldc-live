import { Modal, Tabs } from "antd";
import { Button } from "antd";
import Title from "antd/es/typography/Title";
import { useContext, useState } from "react";
import { FaFileCsv } from "react-icons/fa";
import { NavbarContext } from "../../context/index.js";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { NormalDataDownloadTab, DatasetDownloadTab } from "./index.js";

export const DownloadModal = () => {
  const [loading, setLoading] = useState(false);

  const [downloadClicked, setDownloadClicked] = useState(false);

  const [downloadButtonDisabled, setDownloadButtonDisabled] = useState(false);

  const [activeTabKey, setActiveTabKey] = useState(1);

  const { setOpen, open, handleCancel } = useContext(NavbarContext);
  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };

  return (
    <Modal
      width={"50vw"}
      open={open}
      title={<Title level={3}>Download data</Title>}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key={"back"} onClick={handleCancel}>
          Close
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => setDownloadClicked(true)}
          disabled={downloadButtonDisabled}
        >
          Download
        </Button>,
      ]}
    >
      <Tabs
        size="large"
        type="card"
        activeKey={activeTabKey}
        onChange={(key) => setActiveTabKey(key)}
        items={[
          {
            key: 1,
            label: "Normal Download",
            icon: <PiMicrosoftExcelLogoFill />,
            children: (
              <NormalDataDownloadTab
                activeTabKey={activeTabKey}
                setLoading={setLoading}
                downloadClicked={downloadClicked}
                setDownloadButtonDisabled={setDownloadButtonDisabled}
                setDownloadClicked={setDownloadClicked}
              />
            ),
          },
          {
            key: 2,
            label: "Data for ML/AI",
            icon: <FaFileCsv />,
            children: (
              <DatasetDownloadTab
                activeTabKey={activeTabKey}
                setLoading={setLoading}
                downloadClicked={downloadClicked}
                setDownloadButtonDisabled={setDownloadButtonDisabled}
                setDownloadClicked={setDownloadClicked}
              />
            ),
          },
        ]}
      />
    </Modal>
  );
};
