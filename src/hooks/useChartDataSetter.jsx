import dayjs from "dayjs";
import initialPredictionChartData from "../charts/predictionChart";
import { useEffect, useState } from "react";
/**
 * Sets the chart data with latest provided data
 * subDf: Updated subDf
 * period: Period for which chart view is selected (yesterday, today, tomorrow)
 * models: List of models
 * df: Main dataframe
 */
function useChartDataSetter(subDf, period, models, df) {
  const [chartData, setChartData] = useState(initialPredictionChartData);
  useEffect(() => {
    if (!subDf) return;

    setChartData(() => {
      const copy = JSON.parse(JSON.stringify(initialPredictionChartData));

      // Get subdf copy according to today parameter
      let subdf = null;

      const yesterdayStartHour = dayjs()
        .add(-dayjs().hour() - 24, "hour")
        .add(-dayjs().minute(), "minute")
        .unix();

      const todaysStartHour = dayjs()
        .add(-dayjs().hour(), "hour")
        .add(-dayjs().minute(), "minute")
        .unix();

      const tomorrowStartHour = dayjs()
        .add(1, "day")
        .add(-dayjs().hour(), "hour")
        .add(-dayjs().minute(), "minute")
        .unix();

      if (period == 0) {
        subdf = subDf.loc({
          rows: subDf["created_at"]
            .gt(todaysStartHour)
            .and(subDf["created_at"].lt(tomorrowStartHour)),
        });
      } else if (period == -1) {
        subdf = subDf.loc({
          rows: subDf["created_at"]
            .gt(yesterdayStartHour)
            .and(subDf["created_at"].lt(todaysStartHour)),
        });
      } else {
        subdf = subDf.loc({ rows: subDf["created_at"].gt(tomorrowStartHour) });
      }

      // set the chart values
      //
      copy.data.labels = subdf
        .column("created_at")
        .values.map((i) => dayjs(i * 1000).format("HH:mm"));

      if (period == 0 && dayjs().hour() < subdf.shape[0]) {
        const ts = subdf.iat(dayjs().hour(), 0);
        copy.options.plugins.annotation = {
          annotations: {
            line1: {
              type: "line",
              xMin: dayjs(ts * 1000).format("HH:mm"),
              xMax: dayjs(ts * 1000).format("HH:mm"),
              label: {
                display: true,
                content: "Pure predictions beyond this",
                position: "start",
              },
            },
          },
        };
      }

      copy.options.plugins.tooltip = {
        callbacks: {
          footer: (items) => {
            let footer = "";
            for (let i = 1; i < items.length; i++) {
              footer += `${items[i].dataset.label} Error: ${Math.round(Math.abs(items[0].raw - items[i].raw))}\n`;
            }
            return footer;
          },
        },
      };

      let firstDataset = [];
      if (period == 0) {
        firstDataset = df
          .loc({ rows: df["created_at"].gt(todaysStartHour) })
          .column("state_demand").values;
      } else if (period == -1) {
        firstDataset = df
          .loc({
            rows: df["created_at"]
              .gt(yesterdayStartHour)
              .and(df["created_at"].lt(todaysStartHour)),
          })
          .column("state_demand").values;
      }

      copy.data.datasets[0] = {
        data: firstDataset,
        label: "Original State Demand",
        type: "line",
        fill: false,
        borderColor: "rgb(54, 162, 235, 0.5)",
        tension: 0.5,
      };

      for (let model of models) {
        if (subdf.columns.filter((c) => c == model.tag_name).length) {
          copy.data.datasets.push({
            data: subdf.column(model.tag_name).values,
            label: model.tag_name + " (predictions)",
            type: "line",
            fill: "-1",
            elements: {
              point: {
                pointStyle: "triangle",
                radius: 5,
              },
              line: {
                borderWidth: 2,
              },
            },
          });
        }
      }
      return copy;
    });
  }, [subDf, period]);

  return chartData;
}

export default useChartDataSetter;
