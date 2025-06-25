import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import DeviceInfo from "react-native-device-info";

export const useProfileScreen = () => {
  const [appCurrentVersion, setAppCurrentVersion] = useState("");
  const [latestVersion, setLatestVersion] = useState("");
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [hasCheckedOnce, setHasCheckedOnce] = useState(false);

  const getAppCurrentVersion = () => {
    const currentVersion = DeviceInfo.getVersion();
    setAppCurrentVersion(currentVersion);
    return currentVersion;
  };

  useFocusEffect(
    useCallback(() => {
      getAppCurrentVersion();
    }, [])
  );

  const compareVersions = (current, latest) => {
    const currentParts = current.split(".").map(Number);
    const latestParts = latest.split(".").map(Number);

    for (
      let i = 0;
      i < Math.max(currentParts.length, latestParts.length);
      i++
    ) {
      const currentPart = currentParts[i] || 0;
      const latestPart = latestParts[i] || 0;

      if (latestPart > currentPart) return true;
      if (latestPart < currentPart) return false;
    }
    return false;
  };

  const checkForUpdates = async () => {
    setIsCheckingUpdate(true);
    setUpdateError(null);

    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/rohit-jsfreaky/RhythmRise/main/latest-version.json",
        {
          cache: "no-cache",
          headers: {
            "Cache-Control": "no-cache",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data || !data.version) {
        throw new Error("Invalid version data received");
      }

      setLatestVersion(data.version);
      const currentVer = appCurrentVersion || getAppCurrentVersion();
      const updateAvailable = compareVersions(currentVer, data.version);
      setIsUpdateAvailable(updateAvailable);
      setHasCheckedOnce(true);

      return {
        updateAvailable,
        currentVersion: currentVer,
        latestVersion: data.version,
        releaseNotes: data.releaseNotes || "Bug fixes and performance improvements",
        downloadUrl: data.downloadUrl || null,
      };
    } catch (error) {
      console.error("Error checking for updates:", error);
      setUpdateError(error.message);
      setHasCheckedOnce(true);
      throw error;
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  return {
    appCurrentVersion,
    latestVersion,
    isUpdateAvailable,
    isCheckingUpdate,
    updateError,
    hasCheckedOnce,
    checkForUpdates,
  };
};
