import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PoliceOfficerLogin from "../../screens/policeOfficerLogin";
import DriverLogin from "../../screens/driverLogin";
import Login from "../../screens/login";

import i18n from "../../localization";

function PoliceOfficer() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          title: i18n.t("LOGIN.TITLE"),
          headerStyle: {
            backgroundColor: "#0891b2",
          },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="driverLogin"
        component={DriverLogin}
        options={{
          title: i18n.t("DRIVER_LOGIN.TITLE"),
          headerStyle: {
            backgroundColor: "#0891b2",
          },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="policeOfficerLogin"
        component={PoliceOfficerLogin}
        options={{
          title: i18n.t("POLICE_OFFICER_LOGIN.TITLE"),
          headerStyle: {
            backgroundColor: "#0891b2",
          },
          headerTintColor: "#fff",
        }}
      />
    </Stack.Navigator>
  );
}

export default PoliceOfficer;
