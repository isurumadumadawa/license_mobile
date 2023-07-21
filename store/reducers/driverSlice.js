import { createSlice } from "@reduxjs/toolkit";

const driverSlice = createSlice({
  name: "driver",
  initialState: {
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
  },
  reducers: {
    scanDriver: (state, action) => {
      state.driver = action?.payload;
    },
  },
});

export const selectDriver = (state) => state.driver;
export const { scanDriver } = driverSlice.actions;
export default driverSlice.reducer;
