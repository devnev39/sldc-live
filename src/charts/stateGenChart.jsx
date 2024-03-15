const stateGenChart = {
  options: {
    plugins: {
      title: {
        display: true,
        text: "State Generated And Demand For Today",
        font: {
          size: "20px",
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "MW",
        },
      },
    },
  },
  data: {
    labels: [],
    datasets: [
      {
        label: "STATE GENERATED",
        type: "bar",
        data: [],
      },
      {
        label: "STATE DEMAND",
        type: "line",
        data: [],
      },
    ],
  },
};

export default stateGenChart;
