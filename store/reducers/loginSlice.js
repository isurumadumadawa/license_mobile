import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";

import { loginService } from "../../services/loginAPI";

const initialState = {
  status: "idle",
  user: {
    token: "",
    userId: "",
    userName: "",
    roleId: "",
    role: "",
  },
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ userName, password }) => {
    const response = await loginService({ userName, password });
    return response.data;
  }
);

export const getUserFromStorage = createAsyncThunk("auth/getUser", async () => {
  const response = await SecureStore.getItemAsync("auth");
  return JSON.parse(response);
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      SecureStore.setItemAsync("auth", JSON.stringify({}));
      state.status = "idle";
      state.user = {
        token: "",
        userId: "",
        userName: "",
        roleId: "",
        role: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "idle";
        state.user = { ...action?.payload?.data };
        SecureStore.setItemAsync(
          "auth",
          action?.payload?.data
            ? JSON.stringify(action?.payload?.data)
            : JSON.stringify({})
        );
      })
      .addCase(login.rejected, (state) => {
        state.status = "failed";
        state.user = {
          token: "",
          userId: "",
          userName: "",
          roleId: "",
          role: "",
        };
        SecureStore.setItemAsync("auth", JSON.stringify({}));
      })
      .addCase(getUserFromStorage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserFromStorage.fulfilled, (state, action) => {
        state.status = "idle";
        state.user = { ...action?.payload };
      })
      .addCase(getUserFromStorage.rejected, (state) => {});
  },
});

export const selectAuth = (state) => state.auth;
export const { logout } = authSlice.actions;

export default authSlice.reducer;
