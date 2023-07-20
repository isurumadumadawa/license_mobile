import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { selectAuth, getUserFromStorage } from "./store/reducers/loginSlice";

import UnAuthPoliceOfficer from "./navigations/unauth/policeOfficer";
import AuthPoliceOfficer from "./navigations/auth/policeOfficer";
import { Center, Spinner } from "native-base";

function layout() {
  const auth = useSelector(selectAuth);
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      if (
        !(
          auth?.user?.roleId &&
          auth?.user?.token &&
          auth?.user?.userId &&
          auth?.user?.userName
        )
      ) {
        dispatch(getUserFromStorage());
      }
    };
    getUser();
  }, []);
  if (auth?.status == "loading") {
    return (
      <Center width="100%" height="100%">
        <Spinner />
      </Center>
    );
  } else {
    if (
      auth?.user?.roleId &&
      auth?.user?.token &&
      auth?.user?.userId &&
      auth?.user?.userName
    ) {
      return <AuthPoliceOfficer />;
    } else {
      return <UnAuthPoliceOfficer />;
    }
  }
}

export default layout;
