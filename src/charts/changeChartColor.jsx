import { Chart } from "chart.js";
import { each } from "chart.js/helpers";

const chartJsDarkColor = "#FFFFFFD9";
const chartJsDarkBorderColor = "#FFFFFF40";

const chartJsLightColor = "#666";
const chartJsLightBorderColor = "#00000040";

export default function changeChartColor(isDarkTheme) {
  Chart.defaults.color = isDarkTheme ? chartJsDarkColor : chartJsLightColor;
  each(Chart.instances, (i) => {
    for (let scale in i.config.options.scales) {
      i.config.options.scales[scale].grid.color = isDarkTheme
        ? chartJsDarkBorderColor
        : chartJsLightBorderColor;
      i.config.options.scales[scale].grid.color = isDarkTheme
        ? chartJsDarkBorderColor
        : chartJsLightBorderColor;

      i.config.options.scales[scale].grid.borderColor = isDarkTheme
        ? chartJsDarkColor
        : chartJsLightColor;
      i.config.options.scales[scale].grid.borderColor = isDarkTheme
        ? chartJsDarkColor
        : chartJsLightColor;

      // Update axes label font color
      i.config.options.scales[scale].ticks.color = isDarkTheme
        ? chartJsDarkColor
        : chartJsLightColor;
      i.config.options.scales[scale].ticks.color = isDarkTheme
        ? chartJsDarkColor
        : chartJsLightColor;

      i.config.options.scales[scale].title.color = isDarkTheme
        ? chartJsDarkColor
        : chartJsLightColor;
    }
    i.update();
  });
}
