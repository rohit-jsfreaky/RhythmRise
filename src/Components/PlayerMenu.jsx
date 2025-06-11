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

const PlayerMenu = ({
  showMenu,
  closeMenu,
  trackInPlaylists,
  handleAddToPlaylist,
  handleRemoveFromPlaylist,
}) => {
  const menuAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

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
          colors={["#10133E", "rgba(16, 19, 62, 0.98)"]}
          style={styles.menuGradient}
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
                  { backgroundColor: "rgba(231, 76, 60, 0.2)" },
                ]}
              >
                <Ionicons name="remove-circle" size={16} color="#e74c3c" />
              </View>
              <Text style={styles.menuText}>Remove from Playlist</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleAddToPlaylist}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconBg}>
                <Ionicons name="musical-notes" size={16} color="#7B4DFF" />
              </View>
              <Text style={styles.menuText}>Add to Playlist</Text>
            </TouchableOpacity>
          )}

          <View style={styles.menuSeparator} />

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
                { backgroundColor: "rgba(46, 204, 113, 0.2)" },
              ]}
            >
              <Ionicons name="download-outline" size={16} color="#2ecc71" />
            </View>
            <Text style={styles.menuText}>Download</Text>
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
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuSeparator: {
    height: 1,
    backgroundColor: "rgba(160, 166, 177, 0.1)",
    marginHorizontal: 16,
  },
  menuIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(123, 77, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuText: {
    color: "#F8F9FE",
    fontSize: 14,
    fontWeight: "500",
  },
});
