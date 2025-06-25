import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import DeviceInfo from "react-native-device-info";

import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import { Alert } from "react-native";

export const useProfileScreen = () => {
  const [appCurrentVersion, setAppCurrentVersion] = useState("");
  const [latestVersion, setLatestVersion] = useState("");
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [hasCheckedOnce, setHasCheckedOnce] = useState(false);

  const [updateUrl, setUpdateUrl] = useState(null);

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
      setUpdateUrl(data.apkUrl || null);

      return {
        updateAvailable,
        currentVersion: currentVer,
        latestVersion: data.version,
        releaseNotes:
          data.releaseNotes || "Bug fixes and performance improvements",
        apkUrl: data.apkUrl || null,
      };
    } catch (error) {
      console.error("Error checking for updates:", error);
      setUpdateError(error.message);
      setHasCheckedOnce(true);
      return {
        updateAvailable: false,
        currentVersion: appCurrentVersion || getAppCurrentVersion(),
        latestVersion: "",
        releaseNotes: "",
        apkUrl: null,
      };
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  const onDownloadAndInstall = async () => {
    if (!updateUrl) return;

    console.log("Downloading and installing update from:", updateUrl);

    try {
      const downloadDest = `${RNFS.DownloadDirectoryPath}/RhythmRiseUpdated.apk`;
      console.log("Downloading to:", downloadDest);

      const { promise } = RNFS.downloadFile({
        fromUrl: updateUrl,
        toFile: downloadDest,
      });

      const result = await promise;

      if (result.statusCode === 200) {
        Alert.alert("Download complete", "Starting installation...");
        FileViewer.open(downloadDest, { showOpenWithDialog: true });
      } else {
        Alert.alert("Download failed", `Status code: ${result.statusCode}`);
      }
    } catch (error) {
      console.error("Error during download and install:", error);
      setUpdateError(error.message);
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
    onDownloadAndInstall,
  };
};
