import { Checkbox, DatePicker, Divider, Flex, Modal, Typography } from "antd";
import { Button } from "antd";
import Title from "antd/es/typography/Title";
import { useContext, useState } from "react";
import { NavbarContext } from "../../context/navbarContext";
import dayjs from "dayjs";
import api from "../../query/query";
import {
  availableDownloads,
  defaultDownloads,
} from "../../commons/downloadOptions";
import {
  filteredDataToWorkbook,
  preprocessDocs,
  s2ab,
} from "../../preprocessor/preprocess";

export const DownloadModal = () => {
  const [loading, setLoading] = useState(false);

  const [dateRange, setDateRange] = useState([
    dayjs(dayjs().subtract(2, "days")),
    dayjs(dayjs()),
  ]);

  const [checkedList, setCheckedList] = useState(defaultDownloads);

  const checkAll = availableDownloads.length === checkedList.length;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < availableDownloads.length;

  const onChange = (list) => {
    setCheckedList(list);
  };

  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? availableDownloads : []);
  };

  const { setOpen, open, handleCancel, dateFormat } = useContext(NavbarContext);
  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };

  const downloadData = async () => {
    // Download docs
    // Screen with selected fields
    // Preprocess the data
    // Arrange in sheets

    // Download the data
    try {
      setLoading(true);
      const data = [];
      for (
        let day = dateRange[0];
        day <= dateRange[1];
        day = day.add(1, "days")
      ) {
        const docs = await api.getDateData(day.format("YYYY-MM-DD"));
        data.push(docs);
        // console.log(day.format("YYYY-MM-DD"));
      }

      if (!data.length) throw new Error("Data not found");

      // Screen with selected fields
      // Preprocess the data

      for (let i = 0; i < data.length; i++) {
        const docs = preprocessDocs(data[i], checkedList);
        data[i] = docs;
      }
      // Arrage in sheets
      const workbookBinaryString = filteredDataToWorkbook(data, checkedList);

      const blob = new Blob([s2ab(workbookBinaryString)], {
        type: "application/octet-stream",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `SLDC_${dayjs(dateRange[0]).format("MMM_DD_YYYY")}_${dayjs(dateRange[0]).format("MMM_DD_YYYY")}.xlsx`;
      link.click();
      URL.revokeObjectURL(link.href);
      setLoading(false);
    } catch (e) {
      console.log(e);
      window.alert(e);
      setLoading(false);
    }
  };

  return (
    <Modal
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
          onClick={downloadData}
          disabled={!dateRange}
        >
          Download
        </Button>,
      ]}
    >
      <div>
        <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          Check all
        </Checkbox>
        <Divider />
        <Checkbox.Group
          options={availableDownloads}
          value={checkedList}
          onChange={onChange}
        />
      </div>
      <Flex
        justify="center"
        align="center"
        gap={15}
        style={{ marginTop: "2rem" }}
      >
        <Typography.Text strong underline>
          Select FROM and TO date :
        </Typography.Text>
        <DatePicker.RangePicker
          onChange={(date) => {
            setDateRange(date);
          }}
          defaultValue={[
            (dateRange && dateRange[0]) || dayjs(dayjs()),
            (dateRange && dateRange[1]) || dayjs(dayjs()),
          ]}
          maxDate={dayjs(dayjs(), dateFormat)}
          minDate={dayjs(dayjs().subtract(14, "days"), dateFormat)}
        />
      </Flex>
    </Modal>
  );
};
