import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function useGetChartRows() {
  const charts = useSelector((state) => state.data.charts);

  const [graphRow1, setGraphRow1] = useState(null);
  const [graphRow2, setGraphRow2] = useState(null);
  const [graphRow3, setGraphRow3] = useState(null);

  useEffect(() => {
    setGraphRow1({
      chart1: {
        data: charts.frequencyChart.data,
        options: charts.frequencyChart.options,
        warning: true,
        warningMessage:
          "Frequency data is rounded to 49 sometimes due to no detection of decimal !",
      },
      chart2: {
        data: charts.stateGenChart.data,
        options: charts.stateGenChart.options,
      },
    });

    setGraphRow2({
      chart1: {
        data: charts.generationDistChart.data,
        options: charts.generationDistChart.options,
      },
      chart2: {
        data: charts.coalGenerationChart.data,
        options: charts.coalGenerationChart.options,
      },
    });

    setGraphRow3({
      chart1: {
        data: charts.mumbaiExchangeChart.data,
        options: charts.mumbaiExchangeChart.options,
      },
      chart2: {
        data: charts.privateGenerationChart.data,
        options: charts.privateGenerationChart.options,
      },
    });
  }, [charts]);

  return [graphRow1, graphRow2, graphRow3];
}

export default useGetChartRows;
