const stateGenChart = {
  options: {
    maintainAspectRatio: false,
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
          font: {
            size: "16px",
            weight: "500",
          },
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "MW",
          font: {
            size: "16px",
            weight: "500",
          },
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
