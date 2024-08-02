const modelHistoryChart = {
  charData: {
    lables: [],
    datasets: [
      {
        label: "",
        data: [],
      },
    ],
  },
  options: {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Model loss history",
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
          text: "Model Tag Name",
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
          text: "Loss",
          font: {
            size: "16px",
            weight: "500",
          },
        },
      },
    },
  },
};

export default modelHistoryChart;
