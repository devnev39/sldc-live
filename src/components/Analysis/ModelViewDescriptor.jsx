import { List } from "antd";
import dayjs from "dayjs";

export const getModelViewDescriptor = (model) => {
  const data = [
    `Epochs: ${model.epochs}`,
    `Window size: ${model.window_size}`,
    `Tensorflow version: ${model.version_info.tf}`,
    `Onnx version: ${model.version_info.onnx}`,
  ];
  return [
    {
      key: "1",
      label: "Model name",
      children: model.name,
      span: 3,
    },
    {
      key: "2",
      label: "Model tag name",
      children: <p className="model-tag">{model.tag_name}</p>,
      span: 3,
    },
    {
      key: "3",
      label: "Average loss",
      children: model.avg_loss,
      span: 3,
    },
    {
      key: "4",
      label: "Mean squared error",
      children: model.mse,
      span: 3,
    },
    {
      key: "5",
      label: "Validation loss",
      children: model.val_mse,
      span: 3,
    },
    {
      key: "8",
      label: "Training datapoints",
      children: (
        <p className="model-training-data">
          {model.train_data_size} ~ {Math.round(model.train_data_size / 24)}{" "}
          days
        </p>
      ),
      span: 3,
    },
    {
      key: "6",
      label: "Trained at",
      children: dayjs(model.created_at.seconds * 1000).format(
        "DD-MM-YYYY HH:mm:ss",
      ),
      span: 3,
    },
    {
      key: "7",
      label: "Other parameters",
      span: 3,
      children: (
        <>
          <List
            bordered
            dataSource={data}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </>
      ),
    },
  ];
};