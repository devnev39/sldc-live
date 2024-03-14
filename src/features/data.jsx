import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fields: [],
  serverStats: [],
  stats: [],
  tables: [],
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
  },
});

// Action creators are generated for each case reducer function
export const { updateData } = counterSlice.actions;

export default counterSlice.reducer;
