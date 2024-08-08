import Statistic from "antd/es/statistic/Statistic";
import Typography from "antd/es/typography/Typography";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { green, red } from "@ant-design/colors";
/**
 * title: Title for the card
 * value: Value to show
 * increased: Increased flag to show the up down arrow and red green font
 * suffix: Unit
 */
function CardTemplate({ title, value, increased, suffix, precision }) {
  return (
    <Statistic
      title={
        <Typography.Text underline className="font-600">
          {title}
        </Typography.Text>
      }
      value={value}
      valueStyle={{
        color: `${!increased ? red.primary : green.primary}`,
      }}
      prefix={!increased ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
      precision={precision | 0}
      suffix={suffix}
    />
  );
}

export default CardTemplate;
