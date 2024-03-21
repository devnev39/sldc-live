const privateGenerationChart = {
  options: {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Private Generation Distribution For Today",
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
        label: "GHATGAR PUMP",
        data: [],
      },
      {
        label: "JINDAL (SW)",
        data: [],
      },
      {
        label: "ADANI",
        data: [],
      },
      {
        data: [],
        label: "IDEAL ENR",
      },
      {
        data: [],
        label: "RATTAN_IND-AMT",
      },
      {
        data: [],
        label: "RATTAN_IND-NSK",
      },
      {
        data: [],
        label: "BUTIBORI-REL",
      },
    ],
  },
};

export default privateGenerationChart;
