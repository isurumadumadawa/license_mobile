import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";

import { getRulesService } from "../../services/ruleAPI";

const initialState = {
  status: "idle",
  rules: [],
};

export const getRules = createAsyncThunk("rules/getAPI", async ({ token }) => {
  const response = await getRulesService({ token });
  return response.data;
});

export const getRulesFromStorage = createAsyncThunk(
  "rules/getStorage",
  async () => {
    const response = await SecureStore.getItemAsync("rules");
    return JSON.parse(response);
  }
);

export const rulesSlice = createSlice({
  name: "rules",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRules.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getRules.fulfilled, (state, action) => {
        state.status = "idle";
        state.rules = [...action?.payload];
        if (action?.payload?.data)
          SecureStore.setItemAsync("rules", JSON.stringify(action?.payload));
      })
      .addCase(getRules.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(getRulesFromStorage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getRulesFromStorage.fulfilled, (state, action) => {
        state.status = "idle";
        state.rules = { ...action?.payload };
      })
      .addCase(getRulesFromStorage.rejected, (state) => {});
  },
});

export const selectRules = (state) => state.rules;

export default rulesSlice.reducer;
