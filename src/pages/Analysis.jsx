import Predictions from "../components/Analysis/Predictions";
import Statistics from "../components/Analysis/Statistics";
import { Steps } from "intro.js-react";
import { useContext, useEffect, useState } from "react";
import { NavbarContext } from "../context/navbarContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  BoxPlotController,
  BoxAndWiskers,
} from "@sgratzl/chartjs-chart-boxplot";
import Annotation from "chartjs-plugin-annotation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BoxPlotController,
  BoxAndWiskers,
  Title,
  Tooltip,
  Legend,
  Annotation,
);

export default function Analysis() {
  // Show intro if it's first visit and current page is Analysis
  // Or showIntro changes

  const { showIntro, setShowIntro } = useContext(NavbarContext);
  const [enabled, setEnabled] = useState(false);

  const onIntroExit = () => {
    setShowIntro(false);
    setEnabled(false);
    let introStatus = localStorage.getItem("intro");
    if (introStatus) {
      introStatus = JSON.parse(introStatus);
      introStatus.analysis = true;
      localStorage.setItem("intro", JSON.stringify(introStatus));
    } else {
      introStatus = {
        analysis: true,
        home: false,
      };
      localStorage.setItem("intro", JSON.stringify(introStatus));
    }
  };

  useEffect(() => {
    let introStatus = localStorage.getItem("intro");
    if (introStatus) {
      introStatus = JSON.parse(introStatus);
      if (!introStatus.analysis) setEnabled(true);
    } else {
      setEnabled(true);
    }
  }, []);

  useEffect(() => {
    setEnabled(showIntro);
  }, [showIntro]);

  return (
    <>
      <Steps
        enabled={enabled}
        steps={steps}
        onExit={() => onIntroExit()}
        initialStep={0}
        options={{
          showProgress: true,
          skipLabel: "skip",
        }}
      />
      <Predictions />
      <Statistics />
    </>
  );
}

const steps = [
  {
    element: ".prediction-heading",
    intro:
      "This section presents the prediction of load demand for the state of Maharashtra. The predictions are for today and tomorrow.",
  },
  {
    element: ".period-segment",
    intro:
      "The graph below shows prediction and true values upto this hour. After the current hour, only pure predictions are visible. You can toggle the predictions for today / yesterday / tomorrow with this selection.",
  },
  {
    element: ".model-select",
    intro:
      "You can select different models and see which model performs better in forecasting the load demand.",
  },
  {
    element: ".model-tag",
    intro:
      "This parameter represents the model tag name and version. The last number represents how many times this model has been trained.",
  },
  {
    element: ".model-training-data",
    intro:
      "This parameter shows on how much data points (or days' data) the model has been trained on.",
  },
  {
    element: ".stat-heading",
    intro:
      "This section presents a statistical analysis of the data recorded so far. Currently, box plots are available for analysis for different periods.",
  },
  {
    element: ".period-select",
    intro:
      "You can change the period of the box plot with this control. You can analyse the trend for different periods with these options.",
  },
];
