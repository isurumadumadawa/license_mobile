import axios from "axios";

import envVariables from "../utils/config.json";

export const getRecomendationService = ({ token, rules }) => {
  console.log("data.........", token, rules);
  return axios({
    method: "POST",
    url: `${envVariables.REACT_APP_API_BASE_URL}/recomendation`,
    headers: {
      "x-auth-token": token,
    },
    data: { rules },
  });
};
