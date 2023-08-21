import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch } from "react-redux";

import DriverDetails from "../../screens/driverDetails";

import { logout } from "../../store/reducers/loginSlice";

import i18n from "../../localization";
import { Button } from "native-base";

function Driver() {
  const Stack = createNativeStackNavigator();
  const dispatch = useDispatch();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="driverDetails"
        component={DriverDetails}
        options={{
          title: i18n.t("DRIVER_DETAILS.TITLE"),
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

export default Driver;
