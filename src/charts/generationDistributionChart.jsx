const generationDistributionChart = {
  options: {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Generation Distribution Graph For Today",
        font: {
          size: "20px",
        },
      },
    },
    interaction: {
      intersect: false,
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
        suggestedMax: 10000,
      },
    },
  },
  data: {
    labels: [],
    datasets: [
      {
        label: "COAL+GAS",
        data: [],
        tension: 0.4,
      },
      {
        label: "HYDRO",
        data: [],
        tension: 0.4,
      },
      {
        label: "OTHERS TOTAL",
        data: [],
        tension: 0.4,
      },
    ],
  },
};

export default generationDistributionChart;
