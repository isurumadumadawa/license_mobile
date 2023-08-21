import axios from "axios";

import envVariables from "../utils/config.json";

export const getDriver = ({ token, driverId }) => {
  console.log("wgeg.....", token, driverId);
  return axios({
    method: "GET",
    url: `${envVariables.REACT_APP_API_BASE_URL}/driver/${driverId}`,
    headers: {
      "x-auth-token": token,
    },
  });
};
