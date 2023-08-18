import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";

import { getPenalty } from "../../services/penaltyAPI";

export const getPendingPenaltyFromStorage = createAsyncThunk(
  "penalty/getPendingFromStroge",
  async () => {
    const response = await SecureStore.getItemAsync("pending");
    return JSON.parse(response);
  }
);

export const getDriverPenalty = createAsyncThunk(
  "penalty/getDriverPenalty",
  async ({ token, driverId }) => {
    const response = await getPenalty({ token, driverId });
    return response.data;
  }
);

const penaltySlice = createSlice({
  name: "penalty",
  initialState: {
    status: "idle",
    pending: [],
    driver: [],
  },
  reducers: {
    AddPendingPenalty: (state, action) => {
      const newPending = [...state.pending, action.payload];
      const newPendingSerialized = newPending.map((p) => ({
        ...p,
        expireDate: JSON.stringify(p.expireDate),
        issuedDate: JSON.stringify(p.issuedDate), // Convert to ISO string
      }));

      state.pending = newPendingSerialized;
      SecureStore.setItemAsync("pending", JSON.stringify(newPendingSerialized));
    },
    removePendingPenalty: (state, action) => {
      const tempPending = [...state.pending];
      const result = tempPending.filter((pending) => {
        if (JSON.stringify(action.payload) == JSON.stringify(pending)) {
          console.log("singale item", action.payload, pending);
        }
        return JSON.stringify(action.payload) != JSON.stringify(pending);
      });

      state.pending = result;
      SecureStore.setItemAsync("pending", JSON.stringify(result));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPendingPenaltyFromStorage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPendingPenaltyFromStorage.fulfilled, (state, action) => {
        state.status = "idle";
        state.pending = [...action?.payload];
      })
      .addCase(getPendingPenaltyFromStorage.rejected, (state) => {})
      .addCase(getDriverPenalty.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getDriverPenalty.fulfilled, (state, action) => {
        state.status = "idle";
        state.driver = [...action?.payload];
      })
      .addCase(getDriverPenalty.rejected, (state) => {});
  },
});

export const { AddPendingPenalty, removePendingPenalty } = penaltySlice.actions;
export const selectPenalties = (state) => state.penalty;
export default penaltySlice.reducer;
