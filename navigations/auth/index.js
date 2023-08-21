import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAuth } from "../../store/reducers/loginSlice";

import Driver from "./driver";
import PoliceOfficer from "./policeOfficer";

const Auth = () => {
  const auth = useSelector(selectAuth);
  useEffect(() => {
    console.log("user......", auth?.user);
  }, [auth?.user]);
  return (
    <>
      {auth?.user?.roleId == 3 ? (
        <PoliceOfficer />
      ) : auth?.user?.roleId == 5 ? (
        <Driver />
      ) : null}
    </>
  );
};

export default Auth;
