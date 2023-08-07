import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch } from "react-redux";

import PoliceOfficerHome from "../../screens/policeOfficerHome";
import AddPenalty from "../../screens/addPenalty";
import { logout } from "../../store/reducers/loginSlice";

import i18n from "../../localization";
import { Button } from "native-base";

function PoliceOfficer() {
  const Stack = createNativeStackNavigator();
  const dispatch = useDispatch();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="policeOfficerHome"
        component={PoliceOfficerHome}
        options={{
          title: i18n.t("POLICE_OFFICER_HOME.TITLE"),
          headerStyle: {
            backgroundColor: "#0891b2",
          },
          headerTintColor: "#fff",
          headerRight: () => (
            <Button
              onPress={() => dispatch(logout())}
              title="Info"
              color="#fff"
            >
              {i18n.t("LOGOUT.TITLE")}
            </Button>
          ),
        }}
      />
      <Stack.Screen
        name="addPenalty"
        component={AddPenalty}
        options={{
          title: i18n.t("ADD_PENALTY.TITLE"),
          headerStyle: {
            backgroundColor: "#0891b2",
          },
          headerTintColor: "#fff",
          headerRight: () => (
            <Button
              onPress={() => dispatch(logout())}
              title="Info"
              color="#fff"
            >
              {i18n.t("LOGOUT.TITLE")}
            </Button>
          ),
        }}
      />
    </Stack.Navigator>
  );
}

export default PoliceOfficer;
