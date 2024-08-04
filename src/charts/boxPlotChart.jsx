const boxPlotChart = {
  data: {
    lables: [],
    datasets: [],
  },
  options: {
    maintainAspectRatio: false,
    elements: {
      boxandwhiskers: {
        itemRadius: 2,
        itemHitRadius: 4,
      },
    },
    plugins: {
      title: {
        display: true,
        text: "State demand statistics",
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
          text: "Period",
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
          text: "State demand",
          font: {
            size: "16px",
            weight: "500",
          },
        },
        min: 15000,
      },
    },
  },
};

export default boxPlotChart;
