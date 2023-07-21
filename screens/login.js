import React from "react";
import {
  VStack,
  Button,
  FormControl,
  Input,
  useToast,
  View,
  Box,
  Heading,
} from "native-base";
import QRScan from "../componenst/QRScan";

import LoginComp from "../componenst/Login";

const Login = () => {
  return (
    <View>
      <LoginComp />
      {/* <QRScan /> */}
    </View>
  );
};

export default Login;
