import { useContext, useEffect, useState } from "react";
import { NavbarContext } from "../../context/navbarContext";
import { Checkbox, Divider } from "antd";
import api from "../../query/query";
import dayjs from "dayjs";
import {
  availableDownloads,
  defaultDownloads,
} from "../../commons/downloadOptions";
import {
  filteredDataToWorkbook,
  preprocessDocs,
  s2ab,
} from "../../preprocessor/preprocess";
import DateRangePicker from "./DateRangePicker";

/**
 * Donwloads normal data in excel form
 * activeTabKey: Current active tab key
 * setLoading: Sets the loading state for the donwload button
 * downloadClicked: Checks for the downoad button event
 * setDownloadClicked: Resets the downloadClicked flag
 * setDownloadButtonDisabled: Checks if the valid date range is selected, based on that enables/disbales the donwload button
 */
function NormalDataDownloadTab({
  setLoading,
  downloadClicked,
  setDownloadClicked,
  setDownloadButtonDisabled,
  activeTabKey,
}) {
  const { dateFormat } = useContext(NavbarContext);
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

  useEffect(() => {
    if (downloadClicked && activeTabKey == 1)
      downloadData().then(() => {
        setDownloadClicked(false);
      });
  }, [downloadClicked]);

  useEffect(() => {
    if (dateRange) setDownloadButtonDisabled(false);
    else setDownloadButtonDisabled(true);
  }, [dateRange]);
  return (
    <>
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
      <DateRangePicker
        maxDate={dayjs(dayjs(), dateFormat)}
        minDate={dayjs(dayjs().subtract(14, "days"), dateFormat)}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
    </>
  );
}

export default NormalDataDownloadTab;
