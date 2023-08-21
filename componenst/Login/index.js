import React, { useEffect } from "react";
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
import { useNavigation } from "@react-navigation/native";

import i18n from "../../localization";

const Login = () => {
  const navigation = useNavigation();

  return (
    <View w="100%" pb="20" pt="20">
      <Box safeArea p="2" py="8" w="100%">
        <Heading
          size="lg"
          fontWeight="600"
          color="coolGray.800"
          _dark={{
            color: "warmGray.50",
          }}
        >
          {i18n.t("LOGIN.HEADER")}
        </Heading>
        <Heading
          mt="1"
          _dark={{
            color: "warmGray.200",
          }}
          color="coolGray.600"
          fontWeight="medium"
          size="xs"
        >
          {i18n.t("LOGIN.SUB_HEADER")}
        </Heading>
      </Box>
      <Box safeArea p="2" py="8" w="100%">
        <Button onPress={() => navigation.navigate("policeOfficerLogin")}>
          {i18n.t("LOGIN.POLICE_BUTTON_TITLE")}
        </Button>
        <Button onPress={() => navigation.navigate("driverLogin")} mt="5">
          {i18n.t("LOGIN.DRIVER_BUTTON_TITLE")}
        </Button>
      </Box>
    </View>
  );
};

export default Login;
