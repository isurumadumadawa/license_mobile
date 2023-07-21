import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { Text, View, Button } from "native-base";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useSelector, useDispatch } from "react-redux";

import i18n from "../../localization";
import { scanDriver, selectDriver } from "../../store/reducers/driverSlice";
import DriverView from "../DriverView";

const QRScan = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  const driver = useSelector(selectDriver);
  const dispatch = useDispatch();

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
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={[StyleSheet.absoluteFillObject, styles.container]}
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        />
      )}

      {scanned && (
        <>
          <Button
            size="lg"
            variant="outline"
            title={"Tap to Scan Again"}
            onPress={() => setScanned(false)}
            colorScheme="cyan"
          >
            {i18n.t("SCANNER.SCAN_BUTON")}
          </Button>
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
});

export default QRScan;
