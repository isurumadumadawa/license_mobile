import {
  VStack,
  HStack,
  Center,
  Container,
  Image,
  Heading,
  FormControl,
  Box,
  Input,
  ScrollView,
  Button,
  Flex,
} from "native-base";
import React from "react";
import Moment from "moment";
import { useNavigation } from "@react-navigation/native";

import i18n from "../../localization";

const DriverView = ({ driver }) => {
  console.log("driver data......", driver);
  const navigation = useNavigation();
  return (
    <ScrollView>
      <Center p="3">
        <HStack w="95%" rounded="md">
          <Container w="40%" rounded="md">
            <Image
              size={120}
              borderRadius={100}
              source={{
                uri: driver?.image,
              }}
              alt={i18n.t("DRIVER_VIEW.IMAGE")}
            />
          </Container>
          <Container w="60%" rounded="md" p="5">
            <Center>
              <Heading>{driver?.name}</Heading>
            </Center>
          </Container>
        </HStack>
        <VStack w="95%" rounded="md" mt="3">
          <Box alignItems="center" w="100%">
            <FormControl w="100%">
              <FormControl.Label>
                {i18n.t("DRIVER_VIEW.OTHER_NAME")}
              </FormControl.Label>
              <Input isReadOnly={true} value={driver?.otherName} />
            </FormControl>
          </Box>

          <Box alignItems="center" w="100%">
            <FormControl w="100%">
              <FormControl.Label>
                {i18n.t("DRIVER_VIEW.GENDER")}
              </FormControl.Label>
              <Input value={driver?.gender} isReadOnly={true} />
            </FormControl>
          </Box>
          <Box alignItems="center" w="100%">
            <FormControl w="100%">
              <FormControl.Label>
                {i18n.t("DRIVER_VIEW.MOBILE_NUMBER")}
              </FormControl.Label>
              <Input value={driver?.mobileNumber} isReadOnly={true} />
            </FormControl>
          </Box>
          <Box alignItems="center" w="100%">
            <FormControl w="100%">
              <FormControl.Label>
                {i18n.t("DRIVER_VIEW.BIRTH_DAY")}
              </FormControl.Label>
              <Input
                value={Moment(driver?.dob).format("DD MMM YYYY")}
                isReadOnly={true}
              />
            </FormControl>
          </Box>
          <Box alignItems="center" w="100%">
            <FormControl w="100%">
              <FormControl.Label>
                {i18n.t("DRIVER_VIEW.BLOOD_TYPE")}
              </FormControl.Label>
              <Input value={driver?.bloodType} isReadOnly={true} />
            </FormControl>
          </Box>
          <Box alignItems="center" w="100%">
            <FormControl w="100%">
              <FormControl.Label>
                {i18n.t("DRIVER_VIEW.ADDRESS")}
              </FormControl.Label>
              <Input value={driver?.address} isReadOnly={true} />
            </FormControl>
          </Box>
          <Box alignItems="center" w="100%">
            <FormControl w="100%">
              <FormControl.Label>
                {i18n.t("DRIVER_VIEW.ISSUED_DATE")}
              </FormControl.Label>
              <Input
                value={Moment(driver?.issuedDate).format("DD MMM YYYY")}
                isReadOnly={true}
              />
            </FormControl>
          </Box>
          <Box alignItems="center" w="100%">
            <FormControl w="100%">
              <FormControl.Label>
                {i18n.t("DRIVER_VIEW.EXPIRE_DATE")}
              </FormControl.Label>
              <Input
                value={Moment(driver?.expireDate).format("DD MMM YYYY")}
                isReadOnly={true}
              />
            </FormControl>
          </Box>
          <Flex w="100%" alignItems="flex-end" justyfyContent="flex-end">
            <Button.Group
              colorScheme="blue"
              mx={{
                base: "auto",
                md: 0,
              }}
              size="lg"
              mt="5"
              w="100%"
            >
              <Button
                w="48%"
                onPress={() => navigation.navigate("viewPenalty")}
              >
                {i18n.t("DRIVER_VIEW.VIEW_PANELTIES")}
              </Button>
              <Button
                w="48%"
                variant="outline"
                onPress={() => {
                  navigation.navigate("addPenalty");
                }}
              >
                {i18n.t("DRIVER_VIEW.ADD_PANELTY")}
              </Button>
            </Button.Group>
          </Flex>
        </VStack>
      </Center>
    </ScrollView>
  );
};

export default DriverView;
