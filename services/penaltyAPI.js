import axios from "axios";

import envVariables from "../utils/config.json";

export const addPenalty = ({ token, data }) => {
  return axios({
    method: "POST",
    url: `${envVariables.REACT_APP_API_BASE_URL}/panelty`,
    headers: {
      "x-auth-token": token,
    },
    data: data,
  });
};

export const getPenalty = ({ token, driverId }) => {
  return axios({
    method: "GET",
    url: `${envVariables.REACT_APP_API_BASE_URL}/panelty/${driverId}`,
    headers: {
      "x-auth-token": token,
    },
  });
};
