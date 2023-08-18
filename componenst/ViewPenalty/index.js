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
} from "native-base";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import i18n from "../../localization";

import { selectAuth } from "../../store/reducers/loginSlice";
import {
  selectPenalties,
  getDriverPenalty,
} from "../../store/reducers/penaltySlice";
import { selectDriver } from "../../store/reducers/driverSlice";
import Moment from "moment";

const ViewPenalty = () => {
  const auth = useSelector(selectAuth);
  const penalty = useSelector(selectPenalties);
  const driver = useSelector(selectDriver);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getDriverPenalty({
        token: auth?.user?.token,
        driverId: driver?.driver?.id,
      })
    );
  }, [driver]);

  useEffect(() => {
    console.log("driver penalty", penalty?.driver);
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
    <FlatList
      data={penalty?.driver}
      renderItem={({ item }) => <PenaltyCard penalty={item} />}
      keyExtractor={(item, index) => index}
      onRefresh={() => {
        dispatch(
          getDriverPenalty({
            token: auth?.user?.token,
            driverId: driver?.driver?.id,
          })
        );
      }}
      refreshing={penalty?.status == "loading" ? true : false}
    />
  );
};

export default ViewPenalty;
