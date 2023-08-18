import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./reducers/counterSlice";
import loginReducer from "./reducers/loginSlice";
import driverReducer from "./reducers/driverSlice";
import policeAreaReducer from "./reducers/policeStationSlice";
import rulesReducer from "./reducers/ruleSlice";
import connectionReducer from "./reducers/connectionSlice";
import penaltyReducer from "./reducers/penaltySlice";

const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: loginReducer,
    driver: driverReducer,
    policeArea: policeAreaReducer,
    rules: rulesReducer,
    connection: connectionReducer,
    penalty: penaltyReducer,
  },
});

export default store;
