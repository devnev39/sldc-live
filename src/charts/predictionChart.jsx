const predictionChart = {
  options: {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "State demand graph",
        font: {
          size: "20px",
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
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
        label: "True Data",
        data: [],
        type: "line",
      },
      {
        label: "Prediction",
        data: [],
        type: "line",
      },
    ],
  },
};

export default predictionChart;
