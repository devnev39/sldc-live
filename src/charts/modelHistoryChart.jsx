const modelHistoryChart = {
  data: {
    lables: [],
    datasets: [],
  },
  options: {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Model parameter history",
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
          text: "Model losses (lower is better)",
          font: {
            size: "16px",
            weight: "500",
          },
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Model parameters",
          font: {
            size: "16px",
            weight: "500",
          },
        },
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
      },
    },
  },
};

export default modelHistoryChart;
