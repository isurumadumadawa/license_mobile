import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { View, Text, Button } from "react-native";
import store from "./store/store";
import { NativeBaseProvider, Box } from "native-base";
import { NavigationContainer } from "@react-navigation/native";

import Layout from "./layout";

export default function App() {
  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <NavigationContainer>
          <Layout />
        </NavigationContainer>
      </NativeBaseProvider>
    </Provider>
  );
}
