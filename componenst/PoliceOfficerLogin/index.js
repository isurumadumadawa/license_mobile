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
import { useSelector, useDispatch } from "react-redux";
import * as SecureStore from "expo-secure-store";

import { login, selectAuth } from "../../store/reducers/loginSlice";
import i18n from "../../localization";

const initialValues = { userName: "", password: "" };

function PoliceOfficerLogin() {
  const [formData, setData] = React.useState(initialValues);
  const [errors, setErrors] = React.useState({});
  const auth = useSelector(selectAuth);
  const dispatch = useDispatch();

  const validate = () => {
    if (formData.userName === undefined || formData.userName === "") {
      setErrors({
        ...errors,
        userName: i18n.t("POLICE_OFFICER_LOGIN.USER_NAME.ERRORS.REQUIRED"),
      });
      return false;
    } else if (formData.password === undefined || formData.password === "") {
      setErrors({
        ...errors,
        password: i18n.t("POLICE_OFFICER_LOGIN.PASSWORD.ERRORS.REQUIRED"),
      });
      return false;
    } else if (formData.password.length < 5) {
      setErrors({
        ...errors,
        password: i18n.t("POLICE_OFFICER_LOGIN.PASSWORD.ERRORS.SHORT"),
      });
      return false;
    }

    return true;
  };

  const onSubmit = () => {
    setErrors({});

    if (validate()) {
      dispatch(
        login({ userName: formData?.userName, password: formData?.password })
      );
    } else {
    }
  };
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
          {i18n.t("POLICE_OFFICER_LOGIN.HEADER")}
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
          {i18n.t("POLICE_OFFICER_LOGIN.SUB_HEADER")}
        </Heading>

        <VStack width="100%" pt="10">
          <FormControl isRequired isInvalid={"userName" in errors}>
            <FormControl.Label
              _text={{
                bold: true,
              }}
            >
              {i18n.t("POLICE_OFFICER_LOGIN.USER_NAME.LABEL")}
            </FormControl.Label>
            <Input
              placeholder={i18n.t("POLICE_OFFICER_LOGIN.USER_NAME.PLACEHOLDER")}
              onChangeText={(value) => {
                setErrors({});
                setData({ ...formData, userName: value });
              }}
            />
            {"userName" in errors ? (
              <FormControl.ErrorMessage>
                {errors.userName}
              </FormControl.ErrorMessage>
            ) : null}
          </FormControl>
          <FormControl isRequired isInvalid={"password" in errors}>
            <FormControl.Label
              _text={{
                bold: true,
              }}
            >
              {i18n.t("POLICE_OFFICER_LOGIN.PASSWORD.LABEL")}
            </FormControl.Label>
            <Input
              type="password"
              placeholder={i18n.t("POLICE_OFFICER_LOGIN.PASSWORD.PLACEHOLDER")}
              onChangeText={(value) => {
                setErrors({});
                setData({ ...formData, password: value });
              }}
            />
            {"password" in errors ? (
              <FormControl.ErrorMessage>
                {errors.password}
              </FormControl.ErrorMessage>
            ) : null}
          </FormControl>
          <Button onPress={onSubmit} mt="5" colorScheme="cyan">
            {i18n.t("POLICE_OFFICER_LOGIN.SUBMIT")}
          </Button>
        </VStack>
      </Box>
    </View>
  );
}

export default PoliceOfficerLogin;
