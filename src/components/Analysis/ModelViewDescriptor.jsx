import { Button, Flex, List } from "antd";
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
      key: "9",
      label: "Model actions",
      children: (
        <Flex gap="small" wrap style={{ width: "50%" }}>
          <Button
            onClick={() =>
              window
                .open(`https://netron.app/?url=${model.link}`, "_blank")
                .focus()
            }
            size="small"
            danger
          >
            Visualize model
          </Button>
          <Button
            size="small"
            danger
            onClick={() => {
              const ele = document.createElement("a");
              ele.setAttribute("href", model.link);
              ele.setAttribute("download", `${model.tag_name}.onnx`);
              ele.click();
            }}
          >
            Download model
          </Button>
        </Flex>
      ),
      span: 3,
    },
    {
      key: "3",
      label: "Average loss",
      children: model.avg_loss.toFixed(3),
      span: 3,
    },
    {
      key: "9",
      label: "Model parameters",
      children: model.parameters,
      span: 3,
      contentStyle: { backgroundColor: "rgba(255,0,0,0.2)" },
      labelStyle: { backgroundColor: "rgba(255,0,0,0.2)" },
    },
    {
      key: "4",
      label: "Mean squared error",
      children: model.mse.toFixed(3),
      span: 3,
    },
    {
      key: "5",
      label: "Validation loss",
      children: model.val_mse.toFixed(3),
      span: 3,
      contentStyle: { backgroundColor: "rgba(255,0,0,0.2)" },
      labelStyle: { backgroundColor: "rgba(255,0,0,0.2)" },
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
      contentStyle: { backgroundColor: "rgba(255,0,0,0.2)" },
      labelStyle: { backgroundColor: "rgba(255,0,0,0.2)" },
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
