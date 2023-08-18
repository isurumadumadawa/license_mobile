import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { Text, View, Button, Flex } from "native-base";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import i18n from "../../localization";
import { scanDriver, selectDriver } from "../../store/reducers/driverSlice";
import DriverView from "../DriverView";

const QRScan = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  const driver = useSelector(selectDriver);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    console.log("driver.......", driver?.driver?.name);
  }, [driver]);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    dispatch(scanDriver(JSON.parse(data)));
    //alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!scanned && (
        <>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={[StyleSheet.absoluteFillObject, styles.container]}
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          />
          <View style={styles.ButtonContaiber}>
            <View style={styles.Button}>
              <Button
                h="75"
                size="lg"
                variant="ghost"
                title={"Tap to Scan Again"}
                onPress={() => navigation.navigate("pendingPenalty")}
                colorScheme="cyan"
              >
                {i18n.t("SCANNER.PENDING_BUTTON")}
              </Button>
            </View>
          </View>
        </>
      )}

      {scanned && (
        <>
          <Flex w="100%" alignItems="flex-end" justyfyContent="flex-end">
            <Button.Group
              colorScheme="blue"
              mx={{
                base: "auto",
                md: 0,
              }}
              size="lg"
              mt="5"
              mb="5"
              w="90%"
            >
              <Button
                w="48%"
                onPress={() => navigation.navigate("pendingPenalty")}
              >
                {i18n.t("SCANNER.PENDING_BUTTON")}
              </Button>
              <Button w="48%" onPress={() => setScanned(false)}>
                {i18n.t("SCANNER.SCAN_BUTON")}
              </Button>
            </Button.Group>
          </Flex>
          <DriverView driver={driver?.driver} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  ButtonContaiber: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 70,
    backgroundColor: "white",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  Button: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});

export default QRScan;
