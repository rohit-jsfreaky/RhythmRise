import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

const MenuPortal = ({
  menuOpenFor,
  setMenuOpenFor,
  menuPosition,
  onAddToPlaylist,
  onCancel,
}) => {
  const { theme } = useTheme();
  const menuAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (menuOpenFor) {
      Animated.timing(menuAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(menuAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [menuOpenFor]);

  if (!menuOpenFor) return null;

  return (
    <Modal
      transparent
      visible={!!menuOpenFor}
      animationType="none"
      onRequestClose={() => setMenuOpenFor(null)}
    >
      <TouchableOpacity
        style={styles.portalOverlay}
        activeOpacity={1}
        onPress={() => setMenuOpenFor(null)}
      >
        <Animated.View
          style={[
            styles.portalMenuContainer,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              shadowColor: theme.colors.shadowColor,
              left: menuPosition.x,
              top: menuPosition.y,
              opacity: menuAnim,
              transform: [
                {
                  translateY: menuAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-10, 0],
                  }),
                },
                {
                  scale: menuAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              setMenuOpenFor(null);
              onAddToPlaylist();
            }}
            style={[
              styles.portalMenuItem,
              { borderBottomColor: theme.colors.border },
            ]}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.portalMenuIconContainer,
                { backgroundColor: theme.colors.primary + "20" },
              ]}
            >
              <Ionicons
                name="musical-notes"
                size={16}
                color={theme.colors.textPrimary}
              />
            </View>
            <Text
              style={[
                styles.portalMenuText,
                { color: theme.colors.textPrimary },
              ]}
            >
              Add to Playlist
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setMenuOpenFor(null);
              onCancel();
            }}
            style={styles.portalMenuItem}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.portalMenuIconContainer,
                { backgroundColor: theme.colors.textSecondary + "20" },
              ]}
            >
              <Ionicons
                name="close"
                size={16}
                color={theme.colors.textSecondary}
              />
            </View>
            <Text
              style={[
                styles.portalMenuText,
                { color: theme.colors.textSecondary },
              ]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

export default MenuPortal;

const styles = StyleSheet.create({
  portalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  portalMenuContainer: {
    position: "absolute",
    borderRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
    minWidth: 180,
    overflow: "hidden",
    borderWidth: 1,
  },
  portalMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  portalMenuIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  portalMenuText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
