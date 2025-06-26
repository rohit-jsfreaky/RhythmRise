import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  Platform,
  ToastAndroid,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as MediaLibrary from "expo-media-library";

const { width } = Dimensions.get("window");

const UpdateModal = ({
  visible,
  onClose,
  isChecking,
  hasUpdate,
  currentVersion,
  latestVersion,
  error,
  theme,
  onCheckUpdate,
  hasCheckedOnce,
  onDownloadAndInstall,
  downloadStarted,
  downloadProgress,
}) => {
  useEffect(() => {
    console.log("Download Progress:", downloadProgress);
  }, [downloadProgress]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const checkPermissions = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        setPermissionGranted(true);
        return true;
      } else {
        setPermissionGranted(false);
      }
    } catch (error) {
      setPermissionGranted(false);
      return false;
    }
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  const handleDownload = async () => {
    if (Platform.OS !== "android") {
      Alert.alert(
        "Not Supported",
        "In-app updates are only supported on Android devices.",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        if (onDownloadAndInstall) {
          onDownloadAndInstall();
        }
      } else {
        return ToastAndroid.show(
          "Storage permission is required to download updates.",
          ToastAndroid.LONG
        );
      }
    } catch (error) {
      console.error("Permission request error:", error);
      Alert.alert(
        "Permission Error",
        "There was an error requesting permission. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const renderContent = () => {
    if (isChecking) {
      return (
        <View style={styles.contentContainer}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: theme.colors.primary + "20" },
            ]}
          >
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Checking for Updates
          </Text>
          <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
            Please wait while we check for the latest version...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.contentContainer}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: theme.colors.errorColor + "20" },
            ]}
          >
            <Ionicons
              name="alert-circle"
              size={40}
              color={theme.colors.errorColor}
            />
          </View>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Check Failed
          </Text>
          <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
            Unable to check for updates. Please check your internet connection
            and try again.
          </Text>
          <TouchableOpacity
            style={[
              styles.retryButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={onCheckUpdate}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={theme.colors.activeGradient}
              style={styles.buttonGradient}
            >
              <Ionicons name="refresh" size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Try Again</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      );
    }

    if (hasUpdate) {
      return (
        <View style={styles.contentContainer}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: theme.colors.successColor + "20" },
            ]}
          >
            <Ionicons
              name="download"
              size={40}
              color={theme.colors.successColor}
            />
          </View>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Update Available!
          </Text>
          <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
            A new version is available for download and installation.
          </Text>

          <View style={styles.versionContainer}>
            <View style={styles.versionItem}>
              <Text
                style={[
                  styles.versionLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Current Version
              </Text>
              <Text
                style={[
                  styles.versionNumber,
                  { color: theme.colors.textPrimary },
                ]}
              >
                v{currentVersion}
              </Text>
            </View>
            <Ionicons
              name="arrow-forward"
              size={20}
              color={theme.colors.primary}
            />
            <View style={styles.versionItem}>
              <Text
                style={[
                  styles.versionLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Latest Version
              </Text>
              <Text
                style={[
                  styles.versionNumber,
                  { color: theme.colors.successColor },
                ]}
              >
                v{latestVersion}
              </Text>
            </View>
          </View>

          {downloadStarted ? (
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Ionicons
                  name="cloud-download"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text
                  style={[
                    styles.progressTitle,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  Downloading Update...
                </Text>
              </View>

              <View
                style={[
                  styles.progressBarContainer,
                  { backgroundColor: theme.colors.border },
                ]}
              >
                <View
                  style={[
                    styles.progressBar,
                    {
                      backgroundColor: theme.colors.successColor,
                      width: `${downloadProgress || 0}%`,
                    },
                  ]}
                />
              </View>

              <Text
                style={[
                  styles.progressText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {Math.round(downloadProgress || 0)}% Complete
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.downloadButton,
                { backgroundColor: theme.colors.successColor },
              ]}
              onPress={handleDownload}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[theme.colors.successColor, theme.colors.primary]}
                style={styles.buttonGradient}
              >
                <Ionicons name="key" size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>
                  {permissionGranted
                    ? "Download & Install"
                    : "Request Permission & Download"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    if (hasCheckedOnce && !hasUpdate) {
      return (
        <View style={styles.contentContainer}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: theme.colors.successColor + "20" },
            ]}
          >
            <Ionicons
              name="checkmark-circle"
              size={40}
              color={theme.colors.successColor}
            />
          </View>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            You're Up to Date!
          </Text>
          <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
            You have the latest version of RhythmRise installed.
          </Text>

          <View style={styles.currentVersionContainer}>
            <Text
              style={[
                styles.versionLabel,
                { color: theme.colors.textSecondary },
              ]}
            >
              Current Version
            </Text>
            <Text
              style={[
                styles.versionNumber,
                { color: theme.colors.successColor },
              ]}
            >
              v{currentVersion}
            </Text>
          </View>
        </View>
      );
    }

    // Initial state - show check button
    return (
      <View style={styles.contentContainer}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.colors.primary + "20" },
          ]}
        >
          <Ionicons
            name="refresh-outline"
            size={40}
            color={theme.colors.primary}
          />
        </View>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          Check for Updates
        </Text>
        <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
          Tap the button below to check if there are any updates available for
          RhythmRise.
        </Text>

        <TouchableOpacity
          style={[
            styles.checkButton,
            { backgroundColor: theme.colors.primary },
          ]}
          onPress={onCheckUpdate}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={theme.colors.activeGradient}
            style={styles.buttonGradient}
          >
            <Ionicons name="search" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Check Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView intensity={20} style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              activeOpacity={1}
              style={[
                styles.modal,
                {
                  backgroundColor: theme.colors.surface,
                  shadowColor: theme.colors.shadowColor,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>

              {renderContent()}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width - 40,
    maxWidth: 400,
  },
  modal: {
    borderRadius: 24,
    padding: 24,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    alignItems: "center",
    paddingTop: 16,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
    opacity: 0.8,
  },
  versionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  versionItem: {
    alignItems: "center",
    flex: 1,
  },
  versionLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
    opacity: 0.7,
  },
  versionNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  currentVersionContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  checkButton: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },
  downloadButton: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },
  retryButton: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 16,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  progressBarContainer: {
    width: "100%",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
    transition: "width 0.3s ease",
  },
  progressText: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default UpdateModal;
