const serverUsageChart = {
  options: {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Server Time Usage For Today",
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
        position: "left",
        title: {
          display: true,
          text: "Seconds",
          font: {
            size: "16px",
            weight: "500",
          },
        },
      },
      y1: {
        display: true,
        type: "linear",
        position: "right",
        title: {
          display: true,
          text: "Memory Used (GiB)",
          font: {
            size: "16px",
            weight: "500",
          },
        },
        suggestedMax: 0.5,
      },
    },
  },
  data: {
    labels: [],
    datasets: [
      {
        label: "Time",
        type: "line",
        data: [],
      },
      {
        label: "Memory (GiB)",
        type: "line",
        data: [],
      },
    ],
  },
};

export default serverUsageChart;
