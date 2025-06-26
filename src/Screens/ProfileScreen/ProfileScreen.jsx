import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import TopTitle from "../../Components/TopTitle";
import { useProfileScreen } from "./useProfileScreen";
import UpdateModal from "../../Components/UpdateModal";

const ProfileScreen = () => {
  const { theme, currentTheme, changeTheme, themes } = useTheme();
  const {
    appCurrentVersion,
    latestVersion,
    isUpdateAvailable,
    isCheckingUpdate,
    updateError,
    hasCheckedOnce,
    checkForUpdates,
    onDownloadAndInstall,
    downloadProgress,
    downloadStarted,
  } = useProfileScreen();

  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const handleThemeChange = (themeName) => {
    Alert.alert("Change Theme", `Switch to ${themes[themeName].name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Change",
        onPress: () => changeTheme(themeName),
        style: "default",
      },
    ]);
  };

  const handleCheckForUpdates = async () => {
    setShowUpdateModal(true);
    if (!hasCheckedOnce) {
      try {
        await checkForUpdates();
      } catch (error) {
        // Error is handled in the hook
      }
    }
  };

  const handleUpdateCheck = async () => {
    try {
      await checkForUpdates();
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const getThemeIcon = (themeName) => {
    switch (themeName) {
      case "light":
        return "sunny-outline";
      case "purple":
        return "planet";
      case "ocean":
        return "water";
      case "dark":
        return "moon";
      case "sunset":
        return "sunny";
      case "rose":
        return "rose";
      case "arctic":
        return "snow";
      case "graphite":
        return "cube";
      case "mint":
        return "leaf";
      case "lavender":
        return "flower";
      case "coral":
        return "fish";
      case "emerald":
        return "diamond";
      case "gold":
        return "star";
      case "steel":
        return "hardware-chip";
      default:
        return "color-palette";
    }
  };

  const getStatusBarStyle = () => {
    return currentTheme === "light" ? "dark" : "light";
  };

  return (
    <>
      <View
        style={[
          styles.scrollView,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <LinearGradient
          colors={theme.colors.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.screen}>
            <StatusBar style={getStatusBarStyle()} />
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View style={styles.header}>
                <TopTitle title="Profile" />
              </View>

              {/* User Info Section */}
              <View
                style={[
                  styles.section,
                  {
                    backgroundColor: theme.colors.glassBackground,
                    shadowColor: theme.colors.shadowColor,
                  },
                ]}
              >
                <View style={styles.userInfo}>
                  <View
                    style={[
                      styles.avatar,
                      { backgroundColor: theme.colors.primary },
                    ]}
                  >
                    <Text
                      style={[
                        styles.avatarText,
                        {
                          color:
                            currentTheme === "light"
                              ? "#FFFFFF"
                              : theme.colors.textPrimary,
                        },
                      ]}
                    >
                      U
                    </Text>
                  </View>
                  <View style={styles.userDetails}>
                    <Text
                      style={[
                        styles.userName,
                        { color: theme.colors.textPrimary },
                      ]}
                    >
                      Music Lover
                    </Text>
                    <Text
                      style={[
                        styles.userEmail,
                        { color: theme.colors.textSecondary },
                      ]}
                    >
                      user@rhythmrise.com
                    </Text>
                  </View>
                </View>
              </View>

              {/* Theme Section */}
              <View style={styles.sectionHeader}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  Themes
                </Text>
                <Text
                  style={[
                    styles.sectionSubtitle,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Choose your preferred theme
                </Text>
              </View>

              <View
                style={[
                  styles.section,
                  {
                    backgroundColor: theme.colors.glassBackground,
                    shadowColor: theme.colors.shadowColor,
                  },
                ]}
              >
                {Object.entries(themes).map(([key, themeData]) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.themeItem,
                      currentTheme === key && {
                        backgroundColor: theme.colors.primary + "20",
                        borderColor: theme.colors.primary,
                        borderWidth: 1,
                      },
                    ]}
                    onPress={() => handleThemeChange(key)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.themeLeft}>
                      <View
                        style={[
                          styles.themeIconContainer,
                          { backgroundColor: themeData.colors.primary + "20" },
                        ]}
                      >
                        <Ionicons
                          name={getThemeIcon(key)}
                          size={24}
                          color={themeData.colors.primary}
                        />
                      </View>
                      <View style={styles.themeInfo}>
                        <Text
                          style={[
                            styles.themeName,
                            { color: theme.colors.textPrimary },
                          ]}
                        >
                          {themeData.name}
                        </Text>
                        <View style={styles.colorPreview}>
                          {[
                            themeData.colors.primary,
                            themeData.colors.secondary,
                            themeData.colors.accent,
                          ].map((color, index) => (
                            <View
                              key={index}
                              style={[
                                styles.colorDot,
                                { backgroundColor: color },
                              ]}
                            />
                          ))}
                        </View>
                      </View>
                    </View>

                    {currentTheme === key && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={theme.colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Settings Section */}
              <View style={styles.sectionHeader}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  Settings
                </Text>
              </View>

              <View
                style={[
                  styles.section,
                  {
                    backgroundColor: theme.colors.glassBackground,
                    shadowColor: theme.colors.shadowColor,
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.settingItem}
                  onPress={handleCheckForUpdates}
                  activeOpacity={0.7}
                >
                  <View style={styles.settingLeft}>
                    <View
                      style={[
                        styles.settingIcon,
                        {
                          backgroundColor: isUpdateAvailable
                            ? theme.colors.successColor + "20"
                            : theme.colors.primary + "20",
                        },
                      ]}
                    >
                      <Ionicons
                        name={
                          isUpdateAvailable
                            ? "arrow-up-circle"
                            : "refresh-outline"
                        }
                        size={20}
                        color={
                          isUpdateAvailable
                            ? theme.colors.successColor
                            : theme.colors.textPrimary
                        }
                      />
                    </View>
                    <View>
                      <View style={styles.updateTextContainer}>
                        <Text
                          style={[
                            styles.settingText,
                            { color: theme.colors.textPrimary },
                          ]}
                        >
                          Check For Updates
                        </Text>
                        {isUpdateAvailable && (
                          <View
                            style={[
                              styles.updateBadge,
                              { backgroundColor: theme.colors.successColor },
                            ]}
                          >
                            <Text style={styles.updateBadgeText}>New</Text>
                          </View>
                        )}
                      </View>
                      <Text
                        style={[
                          styles.settingSubtext,
                          { color: theme.colors.textSecondary },
                        ]}
                      >
                        v{appCurrentVersion}
                      </Text>
                    </View>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <View
                      style={[
                        styles.settingIcon,
                        { backgroundColor: theme.colors.accent + "20" },
                      ]}
                    >
                      <Ionicons
                        name="help-circle"
                        size={20}
                        color={theme.colors.textPrimary}
                      />
                    </View>
                    <Text
                      style={[
                        styles.settingText,
                        { color: theme.colors.textPrimary },
                      ]}
                    >
                      Help & Support
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              <View style={{ height: 100 }} />
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </View>

      {/* Update Modal */}
      <UpdateModal
        visible={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        isChecking={isCheckingUpdate}
        hasUpdate={isUpdateAvailable}
        currentVersion={appCurrentVersion}
        latestVersion={latestVersion}
        error={updateError}
        theme={theme}
        onCheckUpdate={checkForUpdates}
        hasCheckedOnce={hasCheckedOnce}
        onDownloadAndInstall={onDownloadAndInstall}
        downloadStarted={downloadStarted}
        downloadProgress={downloadProgress}
      />
    </>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    minHeight: "100%",
  },
  screen: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 10,
    marginBottom: 20,
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    marginTop: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "bold",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
  },
  themeItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  themeLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  themeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  themeInfo: {
    flex: 1,
  },
  themeName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  colorPreview: {
    flexDirection: "row",
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  settingText: {
    fontSize: 16,
    fontWeight: "500",
  },
  settingSubtext: {
    fontSize: 14,
    fontWeight: "400",
    marginTop: 2,
  },
  updateTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  updateBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  updateBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
});
