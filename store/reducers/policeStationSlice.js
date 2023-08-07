import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";

import { getPloceAreaService } from "../../services/policeAreaAPI";

const initialState = {
  status: "idle",
  policeAreas: [],
};

export const getPloceArea = createAsyncThunk(
  "policeArea/getAPI",
  async ({ token }) => {
    const response = await getPloceAreaService({ token });
    return response.data;
  }
);

export const getPloceAreaFromStorage = createAsyncThunk(
  "policeArea/getStorage",
  async () => {
    const response = await SecureStore.getItemAsync("policeArea");
    return JSON.parse(response);
  }
);

export const policeAreaSlice = createSlice({
  name: "policeArea",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPloceArea.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPloceArea.fulfilled, (state, action) => {
        state.status = "idle";
        state.policeAreas = [...action?.payload];
        if (action?.payload?.data)
          SecureStore.setItemAsync(
            "policeArea",
            JSON.stringify(action?.payload)
          );
      })
      .addCase(getPloceArea.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(getPloceAreaFromStorage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPloceAreaFromStorage.fulfilled, (state, action) => {
        state.status = "idle";
        state.policeAreas = { ...action?.payload };
      })
      .addCase(getPloceAreaFromStorage.rejected, (state) => {});
  },
});

export const selectPoliceAreas = (state) => state.policeArea;

export default policeAreaSlice.reducer;
