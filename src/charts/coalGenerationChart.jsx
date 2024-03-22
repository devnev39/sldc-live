const coalGenerationChart = {
  options: {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Coal Geneartion Distribution For Today",
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
        label: "Nashik",
        data: [],
      },
      {
        label: "KORADI",
        data: [],
      },
      {
        label: "KHAPERKHEDA",
        data: [],
      },
      {
        label: "PARAS",
        data: [],
      },
      {
        label: "PARLY",
        data: [],
      },
      {
        label: "CHANDRAPUR",
        data: [],
      },
      {
        label: "BHUSAWAL",
        data: [],
      },
    ],
  },
};

export default coalGenerationChart;
