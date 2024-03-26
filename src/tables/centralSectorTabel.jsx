import { Typography } from "antd";

const columns = [
  {
    dataIndex: "state",
    title: "State",
    render: (item) => (
      <Typography.Text style={{ fontWeight: "bold" }}>{item}</Typography.Text>
    ),
    key: "state",
    sorter: (a, b) => a.state.localeCompare(b.state),
    sortDirections: ["ascend", "descend"],
  },
  {
    dataIndex: "share",
    title: "Share",
    key: "share",
    sorter: (a, b) => parseFloat(a.share) > parseFloat(b.share),
    sortDirections: ["ascend", "descend"],
  },
  {
    dataIndex: "drawl",
    title: "Drawl",
    key: "drawl",
    sorter: (a, b) => parseFloat(a.share) > parseFloat(b.share),
    sortDirections: ["ascend", "descend"],
  },
  {
    dataIndex: "diff",
    title: "Diff",
    key: "diff",
    sorter: (a, b) => parseFloat(a.share) > parseFloat(b.share),
    sortDirections: ["ascend", "descend"],
  },
];

export const centralSectorData = [];

export const centralSectorColumns = columns;
