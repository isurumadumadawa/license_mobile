import { Text } from "react-native";
import React, { useState } from "react";
import {
  VStack,
  Button,
  FormControl,
  Input,
  useToast,
  View,
  Box,
  Heading,
  Spinner,
} from "native-base";
import { useSelector, useDispatch } from "react-redux";

import i18n from "../../localization";
import { selectAuth, loginDriver } from "../../store/reducers/loginSlice";
import { driverLoginService } from "../../services/loginAPI";

const DriverLogin = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileNumberError, setMobileNumberError] = useState("");
  const [OTP, setOTP] = useState("");
  const [OTPError, setOTPError] = useState("");
  const [VOTP, setVOTP] = useState("");
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const onSubmitMobileNumber = async () => {
    if (mobileNumber.length != 10) {
      setMobileNumberError(
        i18n.t("DRIVER_LOGIN.MOBILE_NUMBER.ERRORS.REQUIRED")
      );
    } else {
      setMobileNumberError("");
      setLoading(true);
      try {
        const result = await driverLoginService({ mobileNumber });
        console.log("result.....", result?.data?.data);
        setVOTP(result?.data?.data?.otp);
        setUser({ ...result?.data?.data, otp: undefined });
        setLoading(false);
      } catch (error) {
        console.log("error....", error);
        setLoading(false);
        setMobileNumberError(
          i18n.t("DRIVER_LOGIN.MOBILE_NUMBER.ERRORS.REQUIRED")
        );
      }
    }
  };
  const onSubmitOTP = () => {
    if (OTP.length != 4 && OTP == VOTP) {
      setOTPError(i18n.t("DRIVER_LOGIN.OTP.ERRORS.REQUIRED"));
    } else {
      setOTPError("");
      dispatch(loginDriver({ ...user }));
    }
  };
  return (
    <View w="100%" pb="20" pt="5">
      <Box safeArea p="2" py="8" w="100%">
        <Heading
          size="lg"
          fontWeight="600"
          color="coolGray.800"
          _dark={{
            color: "warmGray.50",
          }}
        >
          {i18n.t("DRIVER_LOGIN.HEADER")}
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
          {i18n.t("DRIVER_LOGIN.SUB_HEADER")}
        </Heading>

        <VStack width="100%" pt="10">
          <FormControl isRequired isInvalid={mobileNumber?.length != 10}>
            <FormControl.Label
              _text={{
                bold: true,
              }}
            >
              {i18n.t("DRIVER_LOGIN.MOBILE_NUMBER.LABEL")}
            </FormControl.Label>
            <Input
              placeholder={i18n.t("DRIVER_LOGIN.MOBILE_NUMBER.PLACEHOLDER")}
              onChangeText={(value) => {
                setMobileNumber(value);
              }}
            />
            {mobileNumberError ? (
              <FormControl.ErrorMessage>
                {mobileNumberError}
              </FormControl.ErrorMessage>
            ) : null}
          </FormControl>
          {loading ? (
            <Spinner accessibilityLabel="Loading posts" mt="5" />
          ) : null}
          <Button mt="5" colorScheme="cyan" onPress={onSubmitMobileNumber}>
            {i18n.t("DRIVER_LOGIN.MOBILE_NUMBER.SUBMIT")}
          </Button>
        </VStack>
        <VStack width="100%" pt="10">
          <FormControl isRequired isInvalid={OTP?.length != 4}>
            <FormControl.Label
              _text={{
                bold: true,
              }}
            >
              {i18n.t("DRIVER_LOGIN.OTP.LABEL")}
            </FormControl.Label>
            <Input
              placeholder={i18n.t("DRIVER_LOGIN.OTP.PLACEHOLDER")}
              onChangeText={(value) => {
                setOTP(value);
              }}
            />
            {OTPError ? (
              <FormControl.ErrorMessage>{OTPError}</FormControl.ErrorMessage>
            ) : null}
          </FormControl>

          <Button mt="5" colorScheme="cyan" onPress={onSubmitOTP}>
            {i18n.t("DRIVER_LOGIN.OTP.SUBMIT")}
          </Button>
        </VStack>
      </Box>
    </View>
  );
};

export default DriverLogin;
