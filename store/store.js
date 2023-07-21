import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./reducers/counterSlice";
import loginReducer from "./reducers/loginSlice";
import driverReducer from "./reducers/driverSlice";

const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: loginReducer,
    driver: driverReducer,
  },
});

export default store;
