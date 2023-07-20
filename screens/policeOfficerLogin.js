import React from "react";
import { Center, ScrollView } from "native-base";

import i18n from "../localization";

import PoliceOfficerLoginComponent from "../componenst/PoliceOfficerLogin";

function PoliceOfficerLogin() {
  return (
    <ScrollView flex={1} px="3">
      <Center>
        <PoliceOfficerLoginComponent />
      </Center>
    </ScrollView>
  );
}

export default PoliceOfficerLogin;
