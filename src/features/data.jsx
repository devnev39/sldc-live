import { createSlice } from "@reduxjs/toolkit";
import frequencyChart from "../charts/frequencyChart";
import stateGenChart from "../charts/stateGenChart";
import generationDistributionChart from "../charts/generationDistributionChart";
import { Timestamp } from "firebase/firestore";
import serverUsageChart from "../charts/serverUsageChart";
import coalGenerationChart from "../charts/coalGenerationChart";
import mumbaiExchangeChart from "../charts/mumbaiExchange";
import privateGenerationChart from "../charts/privateGenerationChart";

// fields, stats, serverStats contains the latest object only
// The series data is converted into

const initialState = {
  fields: [],
  serverStats: [],
  stats: [],
  tables: [],
  charts: {
    frequencyChart: frequencyChart,
    stateGenChart: stateGenChart,
    generationDistChart: generationDistributionChart,
    serverUsageChart: serverUsageChart,
    coalGenerationChart: coalGenerationChart,
    mumbaiExchangeChart: mumbaiExchangeChart,
    privateGenerationChart: privateGenerationChart,
  },
};

// chart.frequencyChart

const clipDifference = (data, value) => {
  if (data.length && parseFloat(value)) {
    let last = data[data.length - 1];
    if (isNaN(last) && data.length > 2) {
      last = data[data.length - 2];
    }
    if (isNaN(last)) return parseFloat(value);
    let diff = last - parseFloat(value);
    if (diff < 0) diff *= -1;
    if (diff < last * 0.5) {
      return parseFloat(value);
    }
    return NaN;
  }
  return parseFloat(value);
};

const average = (nums) => {
  let sum = 0;
  let len = nums.length;
  for (let i = 0; i < nums.length; i++) {
    if (!isNaN(nums[i])) {
      sum += nums[i];
    } else {
      len -= 1;
    }
  }
  return sum / len;
};

const filterDifference = (chartData) => {
  // for each dataset
  // calculate avg value
  // remove the labels and datapoints which are not consistent from labels and other datasets

  for (let dataset of chartData.data.datasets) {
    const avg = average(dataset.data);
    for (let i = 0; i < dataset.data.length; i++) {
      if (!isNaN(dataset.data[i])) {
        let diff = dataset.data[i] - avg;
        diff = diff < 0 ? diff * -1 : diff;
        if (diff > avg) {
          dataset.data[i] = NaN;
        }
      }
    }
  }
};

export const counterSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    updateData: (state, action) => {
      action.payload.forEach((dataPoint) => {
        state.fields = state.fields.concat(dataPoint.fields);
        state.serverStats = state.serverStats.concat(dataPoint.serverStats);
        state.stats = state.stats.concat(dataPoint.stats);
        state.tables = state.tables.concat(dataPoint.tables);
      });
    },
    parseData: (state, action) => {
      action.payload.forEach((dataPoint) => {
        let ts = new Timestamp(
          dataPoint.created_at.seconds,
          dataPoint.created_at.nanoseconds,
        );
        ts = ts
          .toDate()
          .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        state.charts.frequencyChart.data.labels =
          state.charts.frequencyChart.data.labels.concat(ts);
        state.charts.frequencyChart.data.datasets[0].data =
          state.charts.frequencyChart.data.datasets[0].data.concat(
            parseFloat(dataPoint.fields.frequency),
          );
        // State Gen field
        const stateGen = clipDifference(
          state.charts.stateGenChart.data.datasets[0].data,
          dataPoint.stats.filter((i) => i.name == "STATE GEN")[0].value,
        );
        const stateDem = clipDifference(
          state.charts.stateGenChart.data.datasets[1].data,
          dataPoint.stats.filter((i) => i.name == "STATE DEMAND")[0].value,
        );
        state.charts.stateGenChart.data.labels =
          state.charts.stateGenChart.data.labels.concat(ts);
        state.charts.stateGenChart.data.datasets[0].data =
          state.charts.stateGenChart.data.datasets[0].data.concat(stateGen);
        state.charts.stateGenChart.data.datasets[1].data =
          state.charts.stateGenChart.data.datasets[1].data.concat(stateDem);

        const coalGas = clipDifference(
          state.charts.generationDistChart.data.datasets[0].data,
          dataPoint.stats.filter((i) => i.name == "COAL+GAS")[0].value,
        );
        const hydro = clipDifference(
          state.charts.generationDistChart.data.datasets[1].data,
          dataPoint.stats.filter((i) => i.name == "HYDRO")[0].value,
        );
        const othersTtl = clipDifference(
          state.charts.generationDistChart.data.datasets[2].data,
          dataPoint.stats.filter((i) => i.name == "OTHERS TTL")[0].value,
        );

        state.charts.generationDistChart.data.labels =
          state.charts.generationDistChart.data.labels.concat(ts);
        state.charts.generationDistChart.data.datasets[0].data =
          state.charts.generationDistChart.data.datasets[0].data.concat(
            coalGas,
          );
        state.charts.generationDistChart.data.datasets[1].data =
          state.charts.generationDistChart.data.datasets[1].data.concat(hydro);
        state.charts.generationDistChart.data.datasets[2].data =
          state.charts.generationDistChart.data.datasets[2].data.concat(
            othersTtl,
          );

        state.charts.serverUsageChart.data.labels =
          state.charts.serverUsageChart.data.labels.concat(ts);
        state.charts.serverUsageChart.data.datasets[0].data =
          state.charts.serverUsageChart.data.datasets[0].data.concat(
            parseFloat(dataPoint.server_stats.time),
          );
        state.charts.serverUsageChart.data.datasets[1].data =
          state.charts.serverUsageChart.data.datasets[1].data.concat(
            parseFloat(dataPoint.server_stats.memory),
          );

        state.charts.coalGenerationChart.data.labels =
          state.charts.coalGenerationChart.data.labels.concat(ts);

        // Coal+GAS Generation
        for (let i = 0; i < dataPoint.tables[0].rows.length; i++) {
          const value = clipDifference(
            state.charts.coalGenerationChart.data.datasets[i].data,
            dataPoint.tables[0].rows[i].generated,
          );
          state.charts.coalGenerationChart.data.datasets[i].data =
            state.charts.coalGenerationChart.data.datasets[i].data.concat(
              value,
            );
        }

        state.charts.mumbaiExchangeChart.data.labels =
          state.charts.mumbaiExchangeChart.data.labels.concat(ts);
        // Mumbai Exch.
        for (let i = 0; i < dataPoint.tables[4].rows.length; i++) {
          const value = clipDifference(
            state.charts.mumbaiExchangeChart.data.datasets[i].data,
            dataPoint.tables[4].rows[i].generated,
          );
          state.charts.mumbaiExchangeChart.data.datasets[i].data =
            state.charts.mumbaiExchangeChart.data.datasets[i].data.concat(
              value,
            );
        }

        state.charts.privateGenerationChart.data.labels =
          state.charts.privateGenerationChart.data.labels.concat(ts);
        // Pvt. Generation Chart
        for (let i = 0; i < dataPoint.tables[3].rows.length; i++) {
          if (i < state.charts.privateGenerationChart.data.datasets.length) {
            const value = clipDifference(
              state.charts.privateGenerationChart.data.datasets[i].data,
              dataPoint.tables[3].rows[i].generated,
            );
            state.charts.privateGenerationChart.data.datasets[i].data =
              state.charts.privateGenerationChart.data.datasets[i].data.concat(
                value,
              );
          }
        }

        // Set fields and
      });
    },
    filterData: (state) => {
      filterDifference(state.charts.stateGenChart);
      filterDifference(state.charts.generationDistChart);
      filterDifference(state.charts.coalGenerationChart);
      filterDifference(state.charts.privateGenerationChart);
      filterDifference(state.charts.mumbaiExchangeChart);
    },
    clearData: (state) => {
      state.fields = [];
      state.charts = {
        frequencyChart: frequencyChart,
        stateGenChart: stateGenChart,
        generationDistChart: generationDistributionChart,
        serverUsageChart: serverUsageChart,
        coalGenerationChart: coalGenerationChart,
        mumbaiExchangeChart: mumbaiExchangeChart,
        privateGenerationChart: privateGenerationChart,
      };
      state.tables = [];
      state.serverStats = [];
      state.stats = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateData, parseData, clearData, filterData } =
  counterSlice.actions;

export default counterSlice.reducer;
