import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDriver as getDriverService } from "../../services/driverAPI";

const initialState = {
  status: "idle",
  driver: {
    uuid: "",
    name: "",
    otherName: "",
    dob: "",
    mobileNumber: "",
    gender: "",
    bloodType: "",
    address: "",
    issuedDate: "",
    expireDate: "",
    image: "",
  },
  logedinDriver: {},
};

export const getDriver = createAsyncThunk(
  "driver/getDriver",
  async ({ token, driverId }) => {
    const response = await getDriverService({ token, driverId });
    return response.data;
  }
);

const driverSlice = createSlice({
  name: "driver",
  initialState,
  reducers: {
    scanDriver: (state, action) => {
      state.driver = action?.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDriver.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getDriver.fulfilled, (state, action) => {
        state.status = "idle";
        state.logedinDriver = { ...action?.payload };
      })
      .addCase(getDriver.rejected, (state) => {
        state.status = "idle";
        state.logedinDriver = {};
      });
  },
});

export const selectDriver = (state) => state.driver;
export const { scanDriver } = driverSlice.actions;
export default driverSlice.reducer;
