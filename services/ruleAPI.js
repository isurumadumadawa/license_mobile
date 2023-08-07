import axios from "axios";

import envVariables from "../utils/config.json";

export const getRulesService = ({ token }) => {
  return axios({
    method: "GET",
    url: `${envVariables.REACT_APP_API_BASE_URL}/rule`,
    headers: {
      "x-auth-token": token,
    },
  });
};
