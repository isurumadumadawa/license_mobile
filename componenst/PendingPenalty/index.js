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
} from "native-base";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { StyleSheet } from "react-native";
import Moment from "moment";

import {
  selectPenalties,
  removePendingPenalty,
} from "../../store/reducers/penaltySlice";
import { selectPoliceAreas } from "../../store/reducers/policeStationSlice";
import { selectAuth } from "../../store/reducers/loginSlice";
import { selectRules } from "../../store/reducers/ruleSlice";
import { selectConnection } from "../../store/reducers/connectionSlice";

import { addPenalty } from "../../services/penaltyAPI";
import i18n from "../../localization";

import VehicleData from "../../Data/vehicle.json";

function PendingPanelty() {
  const penaties = useSelector(selectPenalties);
  const rulesList = useSelector(selectRules);
  const policeAreas = useSelector(selectPoliceAreas);
  const auth = useSelector(selectAuth);
  const connection = useSelector(selectConnection);

  const [isLoading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    console.log("penaties.........", penaties);

    console.log("policeAreas.........", policeAreas);
    console.log("auth.........", auth);
  }, [penaties, policeAreas, auth]);

  const PenaltyCard = ({ penalty }) => {
    const {
      driverId,
      vehicleId,
      policeStationId,
      policeOfficerId,
      vehicleNumber,
      issuedDate,
      expireDate,
      isCourt,
      rules,
    } = penalty;

    const getRule = ({ id }) => {
      let rule = "";

      rulesList?.rules?.map((r) => {
        if (id == r?.id) rule = r?.name;
      });
      return rule;
    };

    const getPoliceArea = ({ id }) => {
      let area = "";

      policeAreas?.policeAreas?.map((r) => {
        if (id == r?.policeStation?.id) area = r?.policeStation?.name;
      });
      return area;
    };

    const getVehicle = ({ id }) => {
      let vehicle = "";

      VehicleData?.map((r) => {
        if (id == r?.value) vehicle = r?.label;
      });
      return vehicle;
    };

    const onRemovePenalty = () => {
      dispatch(removePendingPenalty(penalty));
    };

    const onSubmit = async () => {
      const payload = {
        ...penalty,
        issuedDate: Moment(penalty?.issuedDate, "DD MMM YYYY").toDate(),
        expireDate: Moment(penalty?.expireDate, "DD MMM YYYY").toDate(),
      };
      console.log("payload.....", payload);
      try {
        if (connection) {
          setLoading(true);
          const response = await addPenalty({
            token: auth?.user?.token,
            data: payload,
          });
          setLoading(false);
          onRemovePenalty();
          toast.show({
            description: i18n.t("PENDING_PENALTY.UPLOAD_SUCCESS"),
          });
        } else {
          setLoading(false);
          toast.show({
            description: i18n.t("PENDING_PENALTY.UPLOAD_ERROR"),
          });
        }
      } catch (error) {
        console.log("error.....", error);
        toast.show({
          description: i18n.t("PENDING_PENALTY.UPLOAD_ERROR"),
        });
        setLoading(false);
      }
    };

    return (
      <Box
        bg="gray.100"
        borderWidth={1}
        borderColor="gray.200"
        borderRadius={12}
        p={4}
        shadow={3}
        m="5"
      >
        <VStack space={3}>
          {rules.map((rule, index) => (
            // <Box key={index} mt={2}>
            //   <Text fontWeight="bold" mb={1}>
            //     Rule {index + 1}
            //   </Text>
            //   <Text>Penalty: {rule.panelty}</Text>
            //   <Text>Rule ID: {getRule({ id: rule.ruleId })}</Text>
            //   <Text>Score: {rule.score}</Text>
            // </Box>
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
              {getRule({ id: rule.ruleId })}
            </Badge>
          ))}
          <HStack>
            <Box w="60%">
              <FormControl>
                <FormControl.Label
                  _text={{
                    bold: true,
                    color: "black",
                  }}
                >
                  {i18n.t("PENDING_PENALTY.VEHICLE_NUMBER")}
                </FormControl.Label>
                <Input
                  placeholder={i18n.t("PENDING_PENALTY.VEHICLE_NUMBER")}
                  value={vehicleNumber}
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
                  {i18n.t("PENDING_PENALTY.VEHICLE_TYPE")}
                </FormControl.Label>
                <Input
                  placeholder={i18n.t("PENDING_PENALTY.VEHICLE_TYPE")}
                  value={getVehicle({ id: vehicleId })}
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
                {i18n.t("PENDING_PENALTY.POLICE_AREA")}
              </FormControl.Label>
              <Input
                placeholder={i18n.t("PENDING_PENALTY.POLICE_AREA")}
                value={getPoliceArea({ id: policeStationId })}
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
                  {i18n.t("PENDING_PENALTY.ISSUED_DATE")}
                </FormControl.Label>
                <Input
                  placeholder={i18n.t("PENDING_PENALTY.ISSUED_DATE")}
                  value={JSON.parse(issuedDate)}
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
                  {i18n.t("PENDING_PENALTY.EXPIRE_DATE")}
                </FormControl.Label>
                <Input
                  placeholder={i18n.t("PENDING_PENALTY.EXPIRE_DATE")}
                  value={JSON.parse(expireDate)}
                  isReadOnly={true}
                />
              </FormControl>
            </Box>
          </HStack>
          <HStack mt="3">
            <Box alignItems="center" w="30%">
              {/* <FormControl w="100%">
                <FormControl.Label
                  _text={{
                    bold: true,
                    color: "black",
                  }}
                >
                  {i18n.t("PENDING_PENALTY.IS_COURT")}
                </FormControl.Label>
                <Switch
                  isChecked={isCourt}
                  colorScheme="primary"
                  isDisabled={true}
                />
              </FormControl> */}
              {isLoading ? (
                <Spinner accessibilityLabel="Loading posts" mt="5" />
              ) : null}
            </Box>
            <Box w="10%"></Box>
            <Box w="60%">
              <Button onPress={onSubmit}>
                {i18n.t("PENDING_PENALTY.UPLOAD_BUTTON")}
              </Button>
            </Box>
          </HStack>
        </VStack>
        {/* <Button onPress={() => onRemovePenalty()}>Remove</Button> */}
      </Box>
    );
  };

  return (
    <ScrollView>
      {penaties?.pending?.map((pending, index) => {
        return <PenaltyCard key={index} penalty={pending} />;
      })}
      {penaties?.pending?.length < 1 ? (
        <Center mt="10">
          <Heading>{i18n.t("PENDING_PENALTY.NO_DATA")}</Heading>
        </Center>
      ) : null}
    </ScrollView>
  );
}

export default PendingPanelty;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
  },
});
