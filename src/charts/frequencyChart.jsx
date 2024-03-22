const frequencyChart = {
  options: {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Frequency Chart For This Day",
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
            size: "18px",
            weight: "500",
          },
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Frequency",
          font: {
            size: "16px",
            weight: "500",
          },
        },
        suggestedMin: 48,
        suggestedMax: 51,
      },
    },
  },
  data: {
    labels: [],
    datasets: [
      {
        label: "Frequency",
        data: [],
        tension: 0.4,
      },
    ],
  },
};

export default frequencyChart;
