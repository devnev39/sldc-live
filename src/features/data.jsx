import { createSlice } from "@reduxjs/toolkit";
import frequencyChart from "../charts/frequencyChart";
import stateGenChart from "../charts/stateGenChart";
import generationDistributionChart from "../charts/generationDistributionChart";
// import { Timestamp } from "firebase/firestore";
import serverUsageChart from "../charts/serverUsageChart";
import coalGenerationChart from "../charts/coalGenerationChart";
import mumbaiExchangeChart from "../charts/mumbaiExchange";
import privateGenerationChart from "../charts/privateGenerationChart";
import {
  centralSectorColumns,
  centralSectorData,
} from "../tables/centralSectorTabel";
import { clipDifference, filterDifference } from "../preprocessor/preprocess";
import * as dfd from "danfojs/dist/danfojs-browser/src";
import dayjs from "dayjs";
// import timezone from "dayjs/plugin/timezone";

// fields, stats, serverStats contains the latest object only
// The series data is converted into

const initialState = {
  fields: [],
  serverStats: [],
  stats: [],
  tables: {
    centralSectorTable: {
      columns: centralSectorColumns,
      data: centralSectorData,
    },
  },
  charts: {
    frequencyChart: frequencyChart,
    stateGenChart: stateGenChart,
    generationDistChart: generationDistributionChart,
    serverUsageChart: serverUsageChart,
    coalGenerationChart: coalGenerationChart,
    mumbaiExchangeChart: mumbaiExchangeChart,
    privateGenerationChart: privateGenerationChart,
  },
  parsedDataFrame: null,
  models: [],
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
        let ts = dataPoint.created_at.seconds;
        ts = dayjs(ts * 1000).format("HH:mm");
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
        // Table 0 corresponds to COAL+GAS
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
      });

      const len = action.payload.length;
      const latest = action.payload[len - 1];
      state.tables.centralSectorTable.data = latest.tables.filter(
        (tbl) => tbl.name == "CENTRAL SECTOR",
      )[0].rows;

      state.tables.centralSectorTable.data =
        state.tables.centralSectorTable.data.map((t) => ({
          ...t,
          key: t["state"],
        }));
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
      state.tables = {
        centralSectorTable: {
          columns: centralSectorColumns,
          data: centralSectorData,
        },
      };
      state.serverStats = [];
      state.stats = [];
    },

    createDataFrame: (state, action) => {
      // state.action.payload to be array of objects
      // console.log(action.payload);
      const size = action.payload.length;
      console.log(action.payload[size - 1]);

      action.payload.sort((a, b) => {
        if (a.created_at > b.create_at) return 1;
        else if (a.created_at < b.created_at) return -1;
        else return 0;
      });
      console.log(action.payload[size - 1]);
      let df = new dfd.DataFrame(action.payload);

      // Remove datapoints with values greater than 30000 and less than 5000

      df = df.loc({
        rows: df["state_demand"].gt(5000).and(df["state_demand"].lt(30000)),
      });

      df.setIndex({ column: "created_at", inplace: true });

      // df.index.sort();

      df.setIndex({
        index: df.index.map((i) =>
          dayjs(i * 1000).format("DD-MM-YYYY HH:mm:ss"),
        ),
        inplace: true,
      });

      df.addColumn(
        "hour",
        df.column("created_at").map((t) => {
          return dayjs(t * 1000).hour();
        }),
        { inplace: true },
      );

      df.addColumn(
        "dayOfWeek",
        df.column("created_at").map((t) => {
          return dayjs(t * 1000).day();
        }),
        { inplace: true },
      );

      df.addColumn(
        "month",
        df.column("created_at").map((t) => {
          return dayjs(t * 1000).month();
        }),
        { inplace: true },
      );

      df.tail(5).print();

      state.parsedDataFrame = df;
    },

    clearDataFrame: (state) => {
      state.parsedDataFrame = null;
    },

    setModels: (state, action) => {
      state.models = action.payload;
    },

    clearModels: (state) => {
      state.models = [];
    },

    updateModel: (state, action) => {
      state.models = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  updateData,
  parseData,
  clearData,
  filterData,
  createDataFrame,
  clearDataFrame,
  setModels,
  updateModel,
  clearModels,
} = counterSlice.actions;

export default counterSlice.reducer;
