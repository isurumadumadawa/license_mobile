import { View, FlatList } from "react-native";
import {
  HStack,
  Center,
  Heading,
  ScrollView,
  Box,
  VStack,
  Button,
  FormControl,
  Input,
  Badge,
  useToast,
  Spinner,
  Text,
  Container,
  Image,
} from "native-base";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Moment from "moment";

import { selectAuth } from "../../store/reducers/loginSlice";
import { selectDriver, getDriver } from "../../store/reducers/driverSlice";
import {
  selectPenalties,
  getDriverPenalty,
} from "../../store/reducers/penaltySlice";

import i18n from "../../localization";

const DriverDetails = () => {
  const auth = useSelector(selectAuth);
  const driver = useSelector(selectDriver);
  const penalty = useSelector(selectPenalties);

  const dispatch = useDispatch();

  useEffect(() => {
    if (auth?.user?.token && auth?.user?.userId) {
      dispatch(
        getDriver({ token: auth?.user?.token, driverId: auth?.user?.userId })
      );
    }
  }, [auth?.user]);

  useEffect(() => {
    console.log("driver.......", driver?.logedinDriver);
    if (driver?.logedinDriver?.id) {
      dispatch(
        getDriverPenalty({
          token: auth?.user?.token,
          driverId: driver?.logedinDriver?.id,
        })
      );
    }
  }, [driver?.logedinDriver]);

  useEffect(() => {
    console.log("penalty.....", penalty?.driver);
  }, [penalty?.driver]);

  const PenaltyCard = ({ penalty }) => {
    return (
      <Box
        bg="gray.100"
        borderWidth={3}
        borderColor={penalty?.isClosed ? "green.500" : "red.500"}
        borderRadius={12}
        p={4}
        shadow={3}
        m="5"
      >
        <VStack space={3}>
          <Box>
            <FormControl>
              <FormControl.Label
                _text={{
                  bold: true,
                  color: "black",
                }}
              >
                {i18n.t("VIEW_PENALTY.DRIVER_NAME")}
              </FormControl.Label>
              <Input
                placeholder={i18n.t("VIEW_PENALTY.DRIVER_NAME")}
                value={penalty?.driver?.name}
                isReadOnly={true}
              />
            </FormControl>
          </Box>
          <HStack>
            <Box w="60%">
              <FormControl>
                <FormControl.Label
                  _text={{
                    bold: true,
                    color: "black",
                  }}
                >
                  {i18n.t("VIEW_PENALTY.VEHICLE_NUMBER")}
                </FormControl.Label>
                <Input
                  placeholder={i18n.t("VIEW_PENALTY.VEHICLE_NUMBER")}
                  value={penalty?.vehicleNumber}
                  isReadOnly={true}
                />
              </FormControl>
            </Box>
            <Box w="10%"></Box>
            <Box w="30%">
              <FormControl>
                <FormControl.Label
                  _text={{
                    bold: true,
                    color: "black",
                  }}
                >
                  {i18n.t("VIEW_PENALTY.VEHICLE_TYPE")}
                </FormControl.Label>
                <Input
                  placeholder={i18n.t("VIEW_PENALTY.VEHICLE_TYPE")}
                  value={penalty?.vehicle?.category}
                  isReadOnly={true}
                />
              </FormControl>
            </Box>
          </HStack>
          <Box>
            <FormControl>
              <FormControl.Label
                _text={{
                  bold: true,
                  color: "black",
                }}
              >
                {i18n.t("VIEW_PENALTY.POLICE_AREA")}
              </FormControl.Label>
              <Input
                placeholder={i18n.t("VIEW_PENALTY.POLICE_AREA")}
                value={penalty?.policeArea?.name}
                isReadOnly={true}
              />
            </FormControl>
          </Box>
          <HStack>
            <Box w="45%">
              <FormControl>
                <FormControl.Label
                  _text={{
                    bold: true,
                    color: "black",
                  }}
                >
                  {i18n.t("VIEW_PENALTY.ISSUED_DATE")}
                </FormControl.Label>
                <Input
                  placeholder={i18n.t("VIEW_PENALTY.ISSUED_DATE")}
                  value={Moment(penalty?.expireDate).format("DD MMM YYYY")}
                  isReadOnly={true}
                />
              </FormControl>
            </Box>
            <Box w="10%"></Box>
            <Box w="45%">
              <FormControl>
                <FormControl.Label
                  _text={{
                    bold: true,
                    color: "black",
                  }}
                >
                  {i18n.t("VIEW_PENALTY.EXPIRE_DATE")}
                </FormControl.Label>
                <Input
                  placeholder={i18n.t("VIEW_PENALTY.EXPIRE_DATE")}
                  value={Moment(penalty?.expireDate).format("DD MMM YYYY")}
                  isReadOnly={true}
                />
              </FormControl>
            </Box>
          </HStack>
          {penalty?.panelties?.map((rule, index) => (
            <Badge
              colorScheme="info"
              alignSelf="flex-start"
              variant="subtle"
              key={index}
              _text={{
                bold: true,
                color: "black",
                fontSize: "15",
              }}
              h="10"
              w="100%"
            >
              {rule?.name}
            </Badge>
          ))}
        </VStack>
      </Box>
    );
  };

  return (
    <Center p="3">
      <HStack w="95%" rounded="md">
        <Container w="40%" rounded="md">
          <Image
            size={120}
            borderRadius={100}
            source={{
              uri: driver?.logedinDriver?.image,
            }}
            alt={i18n.t("DRIVER_VIEW.IMAGE")}
          />
        </Container>
        <Container w="60%" rounded="md" p="5">
          <Center>
            <Heading>{driver?.logedinDriver?.name}</Heading>
          </Center>
        </Container>
      </HStack>
      <FlatList
        data={penalty?.driver}
        renderItem={({ item }) => <PenaltyCard penalty={item} />}
        keyExtractor={(item, index) => index}
        onRefresh={() => {
          dispatch(
            getDriverPenalty({
              token: auth?.user?.token,
              driverId: driver?.logedinDriver?.id,
            })
          );
        }}
        refreshing={penalty?.status == "loading" ? true : false}
      />
    </Center>
  );
};

export default DriverDetails;
