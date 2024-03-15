import { createSlice } from "@reduxjs/toolkit";
import frequencyChart from "../charts/frequencyChart";
import stateGenChart from "../charts/stateGenChart";
import generationDistributionChart from "../charts/generationDistributionChart";
import { Timestamp } from "firebase/firestore";

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
  },
};

// chart.frequencyChart

const clipDifference = (data, value) => {
  if (data.length && parseInt(value)) {
    let last = data[data.length - 1];
    if (isNaN(last) && data.length > 2) {
      last = data[data.length - 2];
    }
    if (isNaN(last)) return parseInt(value);
    let diff = last - parseInt(value);
    if (diff < 0) diff *= -1;
    if (diff < last * 0.5) {
      return parseInt(value);
    }
    return NaN;
  }
  return parseInt(value);
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
            parseInt(dataPoint.fields.frequency),
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
        // Set fields and
      });
    },
    clearData: (state) => {
      state.fields = [];
      state.charts = {
        frequencyChart: frequencyChart,
        stateGenChart: stateGenChart,
        generationDistChart: generationDistributionChart,
      };
      state.tables = [];
      state.serverStats = [];
      state.stats = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateData, parseData, clearData } = counterSlice.actions;

export default counterSlice.reducer;
