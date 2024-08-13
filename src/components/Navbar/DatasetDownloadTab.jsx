import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import * as dfd from "danfojs/dist/danfojs-browser/src";
import { Radio } from "antd";
import DateRangePicker from "./DateRangePicker";
/**
 * Donwloads data in excel or csv form for ML/AI
 * activeTabKey: Current active tab key
 * setLoading: Sets the loading state for the donwload button
 * downloadClicked: Checks for the downoad button event
 * setDownloadClicked: Resets the downloadClicked flag
 * setDownloadButtonDisabled: Checks if the valid date range is selected, based on that enables/disbales the donwload button
 */
function DatasetDownloadTab({
  setLoading,
  downloadClicked,
  setDownloadClicked,
  setDownloadButtonDisabled,
  activeTabKey,
}) {
  // Get the danfo js datset
  const [format, setFormat] = useState(1);

  const [dateRange, setDateRange] = useState([
    dayjs(dayjs().subtract(2, "days")),
    dayjs(dayjs()),
  ]);

  const df = useSelector((state) => state.data.parsedDataFrame);

  const downloadData = () => {
    setLoading(true);
    const subdf = df.loc({
      rows: df["created_at"]
        .gt(dateRange[0].unix())
        .and(df["created_at"].lt(dateRange[1].unix())),
    });
    if (format == 1) {
      dfd.toCSV(subdf, {
        fileName: `SLDC_${dateRange[0].format("DD MMM YYYY")}_${dateRange[1].format("DD MMM YYYY")}`,
        download: true,
      });
    } else {
      dfd.toExcel(subdf, {
        fileName: `SLDC_${dateRange[0].format("DD MMM YYYY")}_${dateRange[1].format("DD MMM YYYY")}`,
      });
    }
    setLoading(false);
    setDownloadClicked(false);
  };

  useEffect(() => {
    if (downloadClicked && activeTabKey == 2) downloadData();
  }, [downloadClicked]);

  useEffect(() => {
    if (!dateRange) setDownloadButtonDisabled(true);
    else setDownloadButtonDisabled(false);
  }, [dateRange]);

  return (
    <>
      <Radio.Group onChange={(e) => setFormat(e.target.value)} value={format}>
        <Radio value={1}>CSV</Radio>
        <Radio value={2}>Excel</Radio>
      </Radio.Group>
      <DateRangePicker
        maxDate={dayjs(df.iat(df.shape[0] - 1, 0) * 1000)}
        minDate={dayjs(df.iat(0, 0) * 1000)}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
    </>
  );
}

export default DatasetDownloadTab;
