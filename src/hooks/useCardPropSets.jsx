import { useSelector } from "react-redux";
import { getAverage, getValue, isIncreased } from "../utils/homeUtils";
import { useEffect, useState } from "react";

function useCardPropSets() {
  const charts = useSelector((state) => state.data.charts);

  const [cardPropsSet1, setCardPropsSet1] = useState([]);
  const [cardPropsSet2, setCardPropsSet2] = useState([]);

  useEffect(() => {
    setCardPropsSet1([
      {
        title: "Frequency",
        value: getValue(charts.frequencyChart.data.datasets[0].data.slice(-1)),
        increased: isIncreased(charts.frequencyChart.data.datasets[0].data),
        suffix: "Hz",
        avg: getAverage(charts.frequencyChart.data.datasets[0].data),
        precision: 2,
      },
      {
        title: "State Demand",
        value: getValue(charts.stateGenChart.data.datasets[1].data),
        increased: isIncreased(charts.stateGenChart.data.datasets[1].data),
        suffix: "MW",
        avg: getAverage(charts.stateGenChart.data.datasets[1].data),
      },
      {
        title: "State Generated",
        value: getValue(charts.stateGenChart.data.datasets[0].data),
        increased: isIncreased(charts.stateGenChart.data.datasets[0].data),
        suffix: "MW",
        avg: getAverage(charts.stateGenChart.data.datasets[0].data),
      },
    ]);

    setCardPropsSet2([
      {
        title: "COAL+GAS",
        value: getValue(charts.generationDistChart.data.datasets[0].data),
        increased: isIncreased(
          charts.generationDistChart.data.datasets[0].data,
        ),
        suffix: "MW",
        avg: getAverage(charts.generationDistChart.data.datasets[0].data),
      },
      {
        title: "Hydro",
        value: getValue(charts.generationDistChart.data.datasets[1].data),
        increased: isIncreased(
          charts.generationDistChart.data.datasets[1].data,
        ),
        suffix: "MW",
        avg: getAverage(charts.generationDistChart.data.datasets[1].data),
      },
      {
        title: "Others Providers Total",
        value: getValue(charts.generationDistChart.data.datasets[2].data),
        increased: isIncreased(
          charts.generationDistChart.data.datasets[2].data,
        ),
        suffix: "MW",
        avg: getAverage(charts.generationDistChart.data.datasets[2].data),
      },
    ]);
  }, [charts]);

  return [cardPropsSet1, cardPropsSet2];
}

export default useCardPropSets;
