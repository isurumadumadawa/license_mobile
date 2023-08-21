import { Platform, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
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
  Select,
  Switch,
  useToast,
  AlertDialog,
  Spinner,
} from "native-base";
import Moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MultipleSelectList } from "react-native-dropdown-select-list";

import i18n from "../../localization";
import VehicleData from "../../Data/vehicle.json";
import {
  selectPoliceAreas,
  getPloceAreaFromStorage,
} from "../../store/reducers/policeStationSlice";
import { selectAuth } from "../../store/reducers/loginSlice";
import {
  selectRules,
  getRulesFromStorage,
} from "../../store/reducers/ruleSlice";
import { selectDriver } from "../../store/reducers/driverSlice";
import { selectConnection } from "../../store/reducers/connectionSlice";
import { AddPendingPenalty } from "../../store/reducers/penaltySlice";

import { addPenalty } from "../../services/penaltyAPI";
import { getRecomendationService } from "../../services/recommendationAPI";

const initialValues = {
  vehicleId: "",
  policeStationId: "",
  vehicleNumber: "",
  isCourt: false,
  expireDate: new Date(),
  issuedDate: new Date(),
  rules: [],
};

const AddPenalty = () => {
  const [formData, setData] = useState(initialValues);
  const [recommendRules, setRecommendRules] = useState([]);
  const [errors, setErrors] = useState({});

  const [dateExpirePicker, setDateExpirePicker] = useState(false);
  const [selectedRules, setSelectedRules] = useState([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isRecOpen, setIsRecOpen] = React.useState(false);

  const [isLoading, setLoading] = useState(false);

  const cancelRef = React.useRef(null);
  const cancelRecRef = React.useRef(null);

  const rules = useSelector(selectRules);
  const policeAreas = useSelector(selectPoliceAreas);
  const auth = useSelector(selectAuth);
  const driver = useSelector(selectDriver);
  const connection = useSelector(selectConnection);
  const dispatch = useDispatch();

  const toast = useToast();

  const onClose = () => setIsOpen(false);
  const onRecClose = () => setIsRecOpen(false);

  useEffect(() => {
    if (rules?.rules?.length == 0 || policeAreas?.policeAreas?.length == 0) {
      dispatch(getPloceAreaFromStorage());
      dispatch(getRulesFromStorage());
    }
  }, []);

  useEffect(() => {
    const newRules = [];
    selectedRules?.map((selectedrule) => {
      rules?.rules?.map((rule) => {
        if (rule?.id == selectedrule) {
          newRules.push({
            panelty: rule?.penalty,
            ruleId: rule?.id,
            score: rule?.score,
          });
        }
      });
    });
    setData({ ...formData, rules: newRules });
  }, [selectedRules]);

  const validate = () => {
    if (formData.vehicleId === undefined || formData.vehicleId === "") {
      setErrors({
        ...errors,
        vehicleId: i18n.t("ADD_PENALTY.VEHICLE.ERRORS.REQUIRED"),
      });
      return false;
    } else if (
      formData.policeStationId === undefined ||
      formData.policeStationId === ""
    ) {
      setErrors({
        ...errors,
        policeStationId: i18n.t("ADD_PENALTY.POLICE_STATION.ERRORS.REQUIRED"),
      });
      return false;
    } else if (
      formData.vehicleNumber === undefined ||
      formData.vehicleNumber === ""
    ) {
      setErrors({
        ...errors,
        vehicleNumber: i18n.t("ADD_PENALTY.VEHICLE_NUMBER.ERRORS.REQUIRED"),
      });
      return false;
    } else if (
      formData.expireDate === undefined ||
      formData.expireDate === ""
    ) {
      setErrors({
        ...errors,
        expireDate: formData?.isCourt
          ? i18n.t("ADD_PENALTY.COURT_DATE.ERRORS.REQUIRED")
          : i18n.t("ADD_PENALTY.EXPIRE_DATE.ERRORS.REQUIRED"),
      });
      return false;
    } else if (formData.rules === [] || formData.rules.length === 0) {
      setErrors({
        ...errors,
        rules: i18n.t("ADD_PENALTY.RULES.ERRORS.REQUIRED"),
      });
      return false;
    }
    return true;
  };

  const getRule = ({ id }) => {
    let rule = "";

    rules?.rules?.map((r) => {
      if (id == r?.id) rule = r?.name;
    });
    return rule;
  };

  const onGetRecommendation = async () => {
    if (validate()) {
      const tempRules = [];
      formData?.rules?.map((r) => tempRules?.push(r?.ruleId));
      try {
        if (connection) {
          setLoading(true);
          setIsOpen(false);
          const response = await getRecomendationService({
            token: auth?.user?.token,
            rules: tempRules,
          });
          setRecommendRules(response?.data);
          setLoading(false);
          setIsRecOpen(true);
        } else {
          setLoading(false);
          setIsOpen(true);
        }
      } catch (error) {
        console.log("errrrrr", error);
        setLoading(false);
        setIsOpen(true);
      }
    }
  };

  const onSubmit = async () => {
    setErrors({});
    if (validate()) {
      const panelty = {
        driverId: driver?.driver?.id,
        vehicleId: formData?.vehicleId,
        policeStationId: formData?.policeStationId,
        policeOfficerId: auth?.user?.id,
        vehicleNumber: formData?.vehicleNumber,
        issuedDate: formData?.issuedDate,
        expireDate: formData?.expireDate,
        isCourt: formData?.isCourt,
        rules: recommendRules,
      };
      try {
        if (connection) {
          onRecClose();
          setIsOpen(false);
          setLoading(true);
          const response = await addPenalty({
            token: auth?.user?.token,
            data: panelty,
          });
          setLoading(false);
          setSelectedRules([]);
          setRecommendRules([]);
          setData(initialValues);
          toast.show({
            description: i18n.t("ADD_PENALTY.CREATE.SUCCESS"),
          });
        } else {
          setLoading(false);
          setIsOpen(true);
        }
      } catch (error) {
        setLoading(false);
        setIsOpen(true);
      }
    }
  };

  onChangeExpireDate = (event, date) => {
    setErrors({});
    setData({ ...formData, expireDate: date });
    if (Platform.OS === "android") {
      setDateExpirePicker(false);
    }
  };

  const onSaveToPrnding = () => {
    dispatch(
      AddPendingPenalty({
        driverId: driver?.driver?.id,
        vehicleId: formData?.vehicleId,
        policeStationId: formData?.policeStationId,
        policeOfficerId: auth?.user?.id,
        vehicleNumber: formData?.vehicleNumber,
        issuedDate: Moment(formData?.issuedDate).format("DD MMM YYYY"),
        expireDate: Moment(formData?.expireDate).format("DD MMM YYYY"),
        isCourt: formData?.isCourt,
        rules: formData?.rules,
      })
    );
    onClose();
  };

  const RecDialog = () => {
    return (
      <AlertDialog
        leastDestructiveRef={cancelRecRef}
        isOpen={isRecOpen}
        onClose={onRecClose}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>
            {i18n.t("ADD_PENALTY.RECOMMENDATION.SUCCESS.HEADER")}
          </AlertDialog.Header>
          <AlertDialog.Body>
            {recommendRules?.map((r, i) => {
              return (
                <Box key={i} mt={3}>
                  <FormControl>
                    <FormControl.Label
                      _text={{
                        bold: true,
                      }}
                    >
                      {/* {i18n.t("ADD_PENALTY.VEHICLE_NUMBER.LABEL")} */}
                      {getRule({ id: r?.ruleId })}
                    </FormControl.Label>
                    <TextInput
                      // placeholder={i18n.t("ADD_PENALTY.VEHICLE_NUMBER.PLACEHOLDER")}
                      onChangeText={(value) => {
                        const updatedData = recommendRules.map((item, index) =>
                          i === index
                            ? { ...item, panelty: JSON.parse(value) }
                            : item
                        );
                        setRecommendRules(updatedData);
                      }}
                      value={JSON.stringify(r?.panelty)}
                      keyboardType="number-pad"
                      style={{
                        height: 40,
                        margin: 12,
                        borderWidth: 1,
                        padding: 10,
                      }}
                    />
                  </FormControl>
                </Box>
              );
            })}
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="solid"
                colorScheme="coolGray"
                onPress={onSubmit}
                ref={cancelRecRef}
              >
                {i18n.t("ADD_PENALTY.RECOMMENDATION.SUCCESS.SUBMIT")}
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    );
  };

  const FaildDialog = () => {
    return (
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>
            {i18n.t("ADD_PENALTY.CREATE.ERROR.HEADER")}
          </AlertDialog.Header>
          <AlertDialog.Body>
            {i18n.t("ADD_PENALTY.CREATE.ERROR.BODY")}
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={onGetRecommendation}
                ref={cancelRef}
              >
                {i18n.t("ADD_PENALTY.CREATE.ERROR.RETRY")}
              </Button>
              <Button colorScheme="danger" onPress={onSaveToPrnding}>
                {i18n.t("ADD_PENALTY.CREATE.ERROR.ADD_TO_PENDING")}
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    );
  };

  return (
    <ScrollView>
      <Center p="3">
        <VStack w="95%" rounded="md" mt="3">
          <Box>
            <FormControl isRequired isInvalid={"vehicleNumber" in errors}>
              <FormControl.Label
                _text={{
                  bold: true,
                }}
              >
                {i18n.t("ADD_PENALTY.VEHICLE_NUMBER.LABEL")}
              </FormControl.Label>
              <Input
                placeholder={i18n.t("ADD_PENALTY.VEHICLE_NUMBER.PLACEHOLDER")}
                onChangeText={(value) => {
                  setErrors({});
                  setData({ ...formData, vehicleNumber: value });
                }}
              />
              {"vehicleNumber" in errors ? (
                <FormControl.ErrorMessage>
                  {errors.vehicleNumber}
                </FormControl.ErrorMessage>
              ) : null}
            </FormControl>
          </Box>
          <Box w="100%">
            <FormControl w="100%" isRequired isInvalid={"vehicleId" in errors}>
              <FormControl.Label>
                {i18n.t("ADD_PENALTY.VEHICLE.LABEL")}
              </FormControl.Label>
              <Select
                accessibilityLabel={i18n.t("ADD_PENALTY.VEHICLE.PLACEHOLDER")}
                placeholder={i18n.t("ADD_PENALTY.VEHICLE.PLACEHOLDER")}
                _selectedItem={{
                  bg: "teal.600",
                }}
                mt="1"
                selectedValue={formData?.vehicleId}
                onValueChange={(value) => {
                  setErrors({});
                  setData({ ...formData, vehicleId: value });
                }}
              >
                {VehicleData.map((vehicle, index) => {
                  return (
                    <Select.Item
                      key={index}
                      label={vehicle?.label}
                      value={vehicle?.value}
                    />
                  );
                })}
              </Select>
              {"vehicleId" in errors ? (
                <FormControl.ErrorMessage>
                  {errors.vehicleId}
                </FormControl.ErrorMessage>
              ) : null}
            </FormControl>
          </Box>

          <Box w="100%">
            <FormControl
              w="100%"
              isRequired
              isInvalid={"policeStationId" in errors}
            >
              <FormControl.Label>
                {i18n.t("ADD_PENALTY.POLICE_STATION.LABEL")}
              </FormControl.Label>
              <Select
                accessibilityLabel={i18n.t(
                  "ADD_PENALTY.POLICE_STATION.PLACEHOLDER"
                )}
                placeholder={i18n.t("ADD_PENALTY.POLICE_STATION.PLACEHOLDER")}
                _selectedItem={{
                  bg: "teal.600",
                }}
                mt="1"
                selectedValue={formData?.policeStationId}
                onValueChange={(value) => {
                  setErrors({});
                  setData({ ...formData, policeStationId: value });
                }}
              >
                {policeAreas?.policeAreas.map((policeArea, index) => {
                  return (
                    <Select.Item
                      key={index}
                      label={policeArea?.policeStation?.name}
                      value={policeArea?.policeStation?.id}
                    />
                  );
                })}
              </Select>
              {"policeStationId" in errors ? (
                <FormControl.ErrorMessage>
                  {errors.policeStationId}
                </FormControl.ErrorMessage>
              ) : null}
            </FormControl>
          </Box>

          <Box alignItems="center" w="100%">
            <FormControl w="100%">
              <FormControl.Label>
                {i18n.t("ADD_PENALTY.COURT.LABEL")}
              </FormControl.Label>
              <Switch
                onToggle={() => {
                  setErrors({});
                  setData({ ...formData, isCourt: !formData?.isCourt });
                }}
                isChecked={formData?.isCourt}
                colorScheme="primary"
              />
            </FormControl>
          </Box>

          <Box alignItems="center" w="100%">
            <FormControl w="100%">
              <FormControl.Label>
                {formData?.isCourt
                  ? i18n.t("ADD_PENALTY.COURT_DATE.LABEL")
                  : i18n.t("ADD_PENALTY.EXPIRE_DATE.LABEL")}
              </FormControl.Label>
              {dateExpirePicker ? (
                <DateTimePicker
                  value={formData?.expireDate}
                  mode={"date"}
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onChangeExpireDate}
                  //style={styleSheet.datePicker}
                />
              ) : null}
              <HStack>
                <Input
                  value={Moment(formData?.expireDate).format("DD MMM YYYY")}
                  isReadOnly={true}
                  w="60%"
                  h="40px"
                />
                <Button
                  onPress={() => setDateExpirePicker(true)}
                  colorScheme="cyan"
                  w="40%"
                  h="40px"
                >
                  {formData?.isCourt
                    ? i18n.t("ADD_PENALTY.COURT_DATE.PLACEHOLDER")
                    : i18n.t("ADD_PENALTY.EXPIRE_DATE.PLACEHOLDER")}
                </Button>
              </HStack>
            </FormControl>
          </Box>
          <Box alignItems="center" w="100%">
            <FormControl w="100%">
              <FormControl.Label>
                {i18n.t("ADD_PENALTY.RULES.LABEL")}
              </FormControl.Label>
              <MultipleSelectList
                setSelected={setSelectedRules}
                data={rules?.rules.map((rule, index) => {
                  return {
                    key: rule?.id,
                    value: rule?.name,
                  };
                })}
                save="key"
                onSelect={() => console.log("wrhbg", selectedRules)}
                label={i18n.t("ADD_PENALTY.RULES.PLACEHOLDER")}
              />
            </FormControl>
          </Box>
          {isLoading ? (
            <Spinner accessibilityLabel="Loading posts" mt="5" />
          ) : null}
          <Button onPress={onGetRecommendation} mt="5" colorScheme="cyan">
            {i18n.t("ADD_PENALTY.SUBMIT")}
          </Button>
        </VStack>
      </Center>
      <FaildDialog />
      <RecDialog />
    </ScrollView>
  );
};

export default AddPenalty;
