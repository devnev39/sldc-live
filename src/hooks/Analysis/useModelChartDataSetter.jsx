import { useEffect, useState } from "react";
import modelHistoryChart from "../../charts/modelHistoryChart";

/**
 * Sets the model chart data with provided data
 * models: Models list
 */
function useModelChartDataSetter(models) {
  const [modelChartData, setModelChartData] = useState(modelHistoryChart);
  useEffect(() => {
    setModelChartData(() => {
      const data = JSON.parse(JSON.stringify(modelHistoryChart));
      data.data.labels = models.map((i) => i.tag_name);

      const properties = {
        mse: "bar",
        val_mse: "line",
        parameters: "line",
      };

      for (let i of Object.keys(properties)) {
        data.data.datasets.push({
          label: i,
          data: models.map((m) =>
            i != "parameters" ? m[i] : Number(m[i].split("(")[0]),
          ),
          type: properties[i],
          yAxisID: i != "parameters" ? "y" : "y1",
        });
      }

      return data;
    });
  }, [models]);
  return modelChartData;
}

export default useModelChartDataSetter;
