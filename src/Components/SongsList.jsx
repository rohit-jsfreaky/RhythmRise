import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import React, { useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../contexts/ThemeContext";

const SongsList = ({
  data,
  playSong,
  toggleFavorite,
  isFavorite,
  addToPlaylist,
  onRemove, // <-- for playlist removal
}) => {
  const { theme } = useTheme();

  const SongItem = ({ item }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    };

    return (
      <Animated.View
        style={[
          styles.songItem,
          {
            backgroundColor: theme.colors.glassBackground,
            borderColor: theme.colors.border,
            shadowColor: theme.colors.shadowColor,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        <TouchableOpacity
          style={styles.songContent}
          onPress={() => playSong(item)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.8}
        >
          <View style={styles.thumbnailContainer}>
            <Image
              source={{ uri: item.thumbnail }}
              style={[
                styles.thumbnail,
                { backgroundColor: theme.colors.secondary + "30" } // 19% opacity
              ]}
            />
            <View style={[
              styles.playOverlay,
              { backgroundColor: theme.colors.primary + "E6" } // 90% opacity
            ]}>
              <Ionicons name="play" size={20} color={theme.colors.textPrimary} />
            </View>
          </View>
          
          <View style={styles.songInfo}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={[styles.artist, { color: theme.colors.textSecondary }]} numberOfLines={1}>
              {item.uploader}
            </Text>
            <View style={styles.metaInfo}>
              <View style={[
                styles.durationBadge,
                { backgroundColor: theme.colors.accent + "40" } // 25% opacity
              ]}>
                <Ionicons name="time" size={12} color={theme.colors.textSecondary} />
                <Text style={[styles.duration, { color: theme.colors.textSecondary }]}
                  numberOfLines={1}>
                  {item.duration}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={() => toggleFavorite(item)}
            style={[
              styles.actionButton,
              {
                backgroundColor: isFavorite(item) 
                  ? theme.colors.errorColor + "33" // 20% opacity
                  : theme.colors.glassBackground
              }
            ]}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFavorite(item) ? "heart" : "heart-outline"}
              size={20}
              color={isFavorite(item) ? theme.colors.errorColor : theme.colors.textSecondary}
            />
          </TouchableOpacity>
          
          {!onRemove ? (
            <TouchableOpacity
              onPress={() => addToPlaylist(item)}
              style={[
                styles.actionButton,
                { backgroundColor: theme.colors.glassBackground }
              ]}
              activeOpacity={0.7}
            >
              <Ionicons name="ellipsis-vertical" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => onRemove(item)}
              style={[
                styles.actionButton,
                { backgroundColor: theme.colors.errorColor + "33" } // 20% opacity
              ]}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={20} color={theme.colors.errorColor} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.url}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => <SongItem item={item} />}
      contentContainerStyle={{
        paddingBottom: 20,
      }}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
    />
  );
};

export default SongsList;

const styles = StyleSheet.create({
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  songContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  thumbnailContainer: {
    position: "relative",
    marginRight: 16,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  playOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0,
  },
  songInfo: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    lineHeight: 20,
  },
  artist: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.8,
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  duration: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "500",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});