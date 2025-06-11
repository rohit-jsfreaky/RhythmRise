import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

const PlayerMenu = ({
  showMenu,
  closeMenu,
  trackInPlaylists,
  handleAddToPlaylist,
  handleRemoveFromPlaylist,
}) => {
  const menuAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const { theme } = useTheme();

  useEffect(() => {
    if (showMenu) {
      Animated.parallel([
        Animated.timing(menuAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(menuAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showMenu]);

  if (!showMenu) return null;

  return (
    <>
      {/* Backdrop to close menu when clicking outside */}
      <Pressable style={styles.menuBackdrop} onPress={closeMenu} />

      {/* Overflow Menu */}
      <Animated.View
        style={[
          styles.overflowMenu,
          {
            opacity: menuAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={theme.colors.cardGradient}
          style={[styles.menuGradient, { borderColor: theme.colors.border }]}
        >
          {trackInPlaylists.length > 0 ? (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleRemoveFromPlaylist}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.menuIconBg,
                  { backgroundColor: theme.colors.errorColor + "33" }, // 20% opacity
                ]}
              >
                <Ionicons name="remove-circle" size={16} color={theme.colors.errorColor} />
              </View>
              <Text style={[styles.menuText, { color: theme.colors.textPrimary }]}>
                Remove from Playlist
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleAddToPlaylist}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBg, { backgroundColor: theme.colors.primary + "33" }]}>
                <Ionicons name="musical-notes" size={16} color={theme.colors.primary} />
              </View>
              <Text style={[styles.menuText, { color: theme.colors.textPrimary }]}>
                Add to Playlist
              </Text>
            </TouchableOpacity>
          )}

          <View style={[styles.menuSeparator, { backgroundColor: theme.colors.border }]} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              closeMenu();
              // Add download functionality here
            }}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.menuIconBg,
                { backgroundColor: theme.colors.successColor + "33" }, // 20% opacity
              ]}
            >
              <Ionicons name="download-outline" size={16} color={theme.colors.successColor} />
            </View>
            <Text style={[styles.menuText, { color: theme.colors.textPrimary }]}>
              Download
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    </>
  );
};

export default PlayerMenu;

const styles = StyleSheet.create({
  menuBackdrop: {
    position: "absolute",
    top: 0,
    left: -20,
    right: -20,
    bottom: 0,
    zIndex: 999,
  },
  overflowMenu: {
    position: "absolute",
    top: 44,
    right: 0,
    minWidth: 200,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 15,
    zIndex: 1001,
  },
  menuGradient: {
    borderRadius: 16,
    borderWidth: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuSeparator: {
    height: 1,
    marginHorizontal: 16,
  },
  menuIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
