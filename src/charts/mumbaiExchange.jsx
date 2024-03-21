const mumbaiExchangeChart = {
  options: {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Mumbai Generation Distribution For Today",
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
        label: "TPC HYD.",
        data: [],
      },
      {
        label: "TPC THM.",
        data: [],
      },
      {
        label: "TPC TTL.",
        data: [],
      },
      {
        label: "AEML GEN.",
        data: [],
      },
      {
        data: [],
        label: "MUM GEN.",
        type: "bar",
      },
      {
        data: [],
        label: "MUM EXCH",
        type: "bar",
      },
      {
        label: "MUM DEMD",
        data: [],
        type: "bar",
      },
    ],
  },
};

export default mumbaiExchangeChart;
