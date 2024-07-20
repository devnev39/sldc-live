import { Button, Divider, Flex, Typography } from "antd";
import { GithubOutlined, LinkedinOutlined } from "@ant-design/icons";

export default function FooterComponent() {
  return (
    <Flex justify="center">
      <div>
        <div>
          <Typography.Text style={{ fontSize: "16px" }}>
            Developed and maintained by @devnev39
          </Typography.Text>
        </div>
        <div>
          <Flex justify="center">
            <Button type="text" href="https://github.com/devnev39">
              <GithubOutlined style={{ fontSize: "2rem" }} />
            </Button>
            <Divider style={{ height: "2vw" }} type="vertical" />
            <Button
              type="text"
              href="https://www.linkedin.com/in/bhuvanesh-bonde-58793615b"
            >
              <LinkedinOutlined style={{ fontSize: "2rem" }} />
            </Button>
          </Flex>
        </div>
      </div>
    </Flex>
  );
}
