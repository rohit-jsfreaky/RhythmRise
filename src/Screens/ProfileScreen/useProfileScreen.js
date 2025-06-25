import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import DeviceInfo from "react-native-device-info";

export const useProfileScreen = () => {
  const [appCurrentVersion, setAppCurrentVersion] = useState("");

  const getAppCurrentVersion = () => {
    const currentVersion = DeviceInfo.getVersion();
    setAppCurrentVersion(currentVersion);
  };

  useFocusEffect(
    useCallback(() => {
      getAppCurrentVersion();
    }, [])
  );

  return {
    appCurrentVersion,
  };
};
