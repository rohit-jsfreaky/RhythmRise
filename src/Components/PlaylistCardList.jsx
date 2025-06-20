import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Image,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useTheme } from "../contexts/ThemeContext";

const PlaylistCardList = ({
  playlistColumns,
  setPlaylistToDelete,
  setShowDeleteModal,
  setRenameValue,
  setShowRenameModal,
}) => {
  const navigation = useNavigation();
  const menuAnim = useRef(new Animated.Value(0)).current;
  const [menuOpenFor, setMenuOpenFor] = useState(null);
  const { theme } = useTheme();

  // Generate random gradient for each playlist
  const getPlaylistGradient = (title) => {
    const gradients = [
      [theme.colors.primary + "80", theme.colors.secondary + "60"], // 50%, 38% opacity
      [theme.colors.secondary + "80", theme.colors.accent + "60"],
      [theme.colors.accent + "80", theme.colors.primary + "60"],
      [theme.colors.primary + "60", theme.colors.accent + "80"],
    ];
    const index = title.length % gradients.length;
    return gradients[index];
  };

  // Generate random icon for each playlist
  const getPlaylistIcon = (title) => {
    const icons = [
      "musical-notes",
      "library",
      "headset",
      "radio",
      "disc",
      "albums",
    ];
    const index = title.length % icons.length;
    return icons[index];
  };

  useEffect(() => {
    if (menuOpenFor) {
      Animated.timing(menuAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(menuAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }).start();
    }
  }, [menuOpenFor]);

  return (
    <View style={styles.container}>
      {playlistColumns.map((column, colIdx) => (
        <View key={colIdx} style={styles.column}>
          {column.map((item) => (
            <View key={item.title} style={styles.cardWrapper}>
              <TouchableOpacity
                style={[
                  styles.card,
                  {
                    shadowColor: theme.colors.shadowColor,
                  },
                ]}
                onPress={() =>
                  navigation.navigate("Playlist", { title: item.title })
                }
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={getPlaylistGradient(item.title)}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardGradient}
                >
                  {/* Modern glassmorphism overlay */}
                  <View
                    style={[
                      styles.glassOverlay,
                      { backgroundColor: theme.colors.glassBackground },
                    ]}
                  >
                    {/* Icon Section */}
                    <View style={styles.cardHeader}>
                      <View
                        style={[
                          styles.modernIconContainer,
                          { backgroundColor: theme.colors.textPrimary + "20" }, // 12% opacity
                        ]}
                      >
                        <Ionicons
                          name={getPlaylistIcon(item.title)}
                          size={28}
                          color={theme.colors.textPrimary}
                        />
                      </View>

                      {/* Song count badge */}
                      <View
                        style={[
                          styles.songCountBadge,
                          { backgroundColor: theme.colors.primary + "33" }, // 20% opacity
                        ]}
                      >
                        <Text
                          style={[
                            styles.songCountText,
                            { color: theme.colors.textPrimary },
                          ]}
                        >
                          {item.songs.length}
                        </Text>
                      </View>
                    </View>

                    {/* Content Section */}
                    <View style={styles.cardContent}>
                      <Text
                        style={[
                          styles.playlistTitle,
                          { color: theme.colors.textPrimary },
                        ]}
                        numberOfLines={2}
                      >
                        {item.title}
                      </Text>
                      <Text
                        style={[
                          styles.playlistSubtitle,
                          { color: theme.colors.textSecondary },
                        ]}
                      >
                        {item.songs.length}{" "}
                        {item.songs.length === 1 ? "song" : "songs"}
                      </Text>
                    </View>

                    {/* Play button overlay on hover/press */}
                    <View style={styles.playOverlay}>
                      <View
                        style={[
                          styles.playButton,
                          { backgroundColor: theme.colors.primary + "E6" }, // 90% opacity
                        ]}
                      >
                        <Ionicons
                          name="play"
                          size={20}
                          color={theme.colors.textPrimary}
                        />
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              {/* Menu Button */}
              <TouchableOpacity
                onPress={() => {
                  menuAnim.setValue(0);
                  setMenuOpenFor(item.title);
                }}
                style={[
                  styles.menuButton,
                  { backgroundColor: theme.colors.background + "CC" }, // 80% opacity
                ]}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name="ellipsis-vertical"
                  size={18}
                  color={theme.colors.textPrimary}
                />
              </TouchableOpacity>

              {/* Context Menu */}
              {menuOpenFor === item.title && (
                <>
                  {/* Backdrop */}
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.menuBackdrop}
                    onPress={() => setMenuOpenFor(null)}
                  />

                  <Animated.View
                    style={[
                      styles.menu,
                      {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border,
                        shadowColor: theme.colors.shadowColor,
                        opacity: menuAnim,
                        transform: [
                          {
                            translateY: menuAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [20, 0],
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
                        setPlaylistToDelete(item.title);
                        setRenameValue(item.title);
                        setShowRenameModal(true);
                        setMenuOpenFor(null);
                      }}
                      style={styles.menuItem}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.menuIconBg,
                          { backgroundColor: theme.colors.primary + "33" }, // 20% opacity
                        ]}
                      >
                        <Ionicons
                          name="create-outline"
                          size={16}
                          color={theme.colors.textPrimary}
                        />
                      </View>
                      <Text
                        style={[
                          styles.menuText,
                          { color: theme.colors.textPrimary },
                        ]}
                      >
                        Rename
                      </Text>
                    </TouchableOpacity>

                    <View
                      style={[
                        styles.menuDivider,
                        { backgroundColor: theme.colors.border },
                      ]}
                    />

                    <TouchableOpacity
                      onPress={() => {
                        setPlaylistToDelete(item.title);
                        setShowDeleteModal(true);
                        setMenuOpenFor(null);
                      }}
                      style={styles.menuItem}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.menuIconBg,
                          { backgroundColor: theme.colors.errorColor + "33" }, // 20% opacity
                        ]}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={16}
                          color={theme.colors.errorColor}
                        />
                      </View>
                      <Text
                        style={[
                          styles.menuText,
                          { color: theme.colors.errorColor },
                        ]}
                      >
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                </>
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default PlaylistCardList;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginTop: 8,
  },
  column: {
    flex: 1,
    paddingHorizontal: 8,
  },
  cardWrapper: {
    position: "relative",
    marginBottom: 20,
  },
  card: {
    borderRadius: 20,
    overflow: "hidden",
    height: 180,
  },
  cardGradient: {
    flex: 1,
    borderRadius: 20,
  },
  glassOverlay: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  modernIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  songCountBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  songCountText: {
    fontSize: 12,
    fontWeight: "600",
  },
  cardContent: {
    flex: 1,
    justifyContent: "flex-end",
  },
  playlistTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    lineHeight: 20,
  },
  playlistSubtitle: {
    fontSize: 13,
    opacity: 0.8,
  },
  playOverlay: {
    position: "absolute",
    bottom: 16,
    right: 16,
    opacity: 0.9,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  menuButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  menuBackdrop: {
    position: "absolute",
    top: -1000,
    left: -1000,
    right: -1000,
    bottom: -1000,
    zIndex: 99,
  },
  menu: {
    position: "absolute",
    top: 45,
    right: 0,
    minWidth: 160,
    borderRadius: 16,
    overflow: "hidden",
    zIndex: 100,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuDivider: {
    height: 1,
    marginHorizontal: 16,
  },
  menuText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
