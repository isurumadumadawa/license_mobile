import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Badge } from "native-base";
import NetInfo from "@react-native-community/netinfo";

import { selectAuth, getUserFromStorage } from "./store/reducers/loginSlice";
import {
  selectConnection,
  setConnection,
} from "./store/reducers/connectionSlice";

import UnAuthPoliceOfficer from "./navigations/unauth/policeOfficer";
import AuthPoliceOfficer from "./navigations/auth/policeOfficer";
import { Center, Spinner, View } from "native-base";

import i18n from "./localization";
import { getPloceArea } from "./store/reducers/policeStationSlice";
import { getRules } from "./store/reducers/ruleSlice";

function layout() {
  const auth = useSelector(selectAuth);
  const connection = useSelector(selectConnection);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      dispatch(setConnection(state.isConnected));
    });

    return () => {
      unsubscribe();
    };
  }, []);

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

  useEffect(() => {
    const getData = () => {
      if (auth?.user?.token) {
        dispatch(
          getPloceArea({
            token: auth?.user?.token,
          })
        );
        dispatch(
          getRules({
            token: auth?.user?.token,
          })
        );
      }
    };
    getData();
  }, [auth?.user?.token]);

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
      return (
        <>
          {!connection ? (
            <Box alignItems="center" w="100%" h="8">
              <Badge w="100%" h="8" colorScheme="danger">
                {i18n.t("CONNECTION")}
              </Badge>
            </Box>
          ) : null}
          <AuthPoliceOfficer />
        </>
      );
    } else {
      return <UnAuthPoliceOfficer />;
    }
  }
}

export default layout;
