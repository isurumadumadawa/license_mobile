import axios from "axios";

import envVariables from "../utils/config.json";

export const loginService = ({ userName, password }) => {
  console.log(userName, password);
  return axios({
    method: "POST",
    url: `${envVariables.REACT_APP_API_BASE_URL}/auth/login`,
    data: { userName, password },
  });
};
