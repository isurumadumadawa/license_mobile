import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
  name: "connection",
  initialState: {
    connection: true,
  },
  reducers: {
    setConnection: (state, action) => {
      state.connection = action?.payload;
    },
  },
});

export const { setConnection } = connectionSlice.actions;
export const selectConnection = (state) => state.connection.connection;
export default connectionSlice.reducer;
