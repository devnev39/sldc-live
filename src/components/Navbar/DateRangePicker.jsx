import { DatePicker, Flex, Typography } from "antd";
import dayjs from "dayjs";

/**
 * Range picker component
 * minDate: Minimum allowed date (dayjs object)
 * maxDate: Max allowed date (dayjs object)
 * setDateRange: Date range setter on change
 * dateRange: dateRange state
 */
function DateRangePicker({ minDate, maxDate, setDateRange, dateRange }) {
  return (
    <Flex
      justify="center"
      align="center"
      gap={15}
      style={{ marginTop: "2rem", width: "100%" }}
    >
      <Typography.Text strong style={{ fontSize: "1rem" }}>
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
        maxDate={maxDate}
        minDate={minDate}
      />
    </Flex>
  );
}

export default DateRangePicker;
