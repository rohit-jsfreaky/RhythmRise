import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const SongsList = ({
  data,
  playSong,
  toggleFavorite,
  isFavorite,
  addToPlaylist,
  onRemove, // <-- for playlist removal
}) => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.url}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <View style={styles.songItem}>
          <TouchableOpacity
            style={styles.songContent}
            onPress={() => playSong(item)}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: item.thumbnail }}
              style={styles.thumbnail}
            />
            <View style={styles.songInfo}>
              <Text style={styles.title} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.artist} numberOfLines={1}>
                {item.uploader}
              </Text>
              <Text style={styles.duration}>{item.duration}</Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              onPress={() => toggleFavorite(item)}
              style={styles.actionButton}
            >
              <Ionicons
                name={isFavorite(item) ? "heart" : "heart-outline"}
                size={22}
                color={isFavorite(item) ? "#e74c3c" : "#A0A6B1"}
              />
            </TouchableOpacity>
            
            {!onRemove ? (
              <TouchableOpacity
                onPress={() => addToPlaylist(item)}
                style={styles.actionButton}
              >
                <Ionicons name="ellipsis-vertical" size={22} color="#A0A6B1" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => onRemove(item)}
                style={styles.actionButton}
              >
                <Ionicons name="trash-outline" size={22} color="#e74c3c" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
      contentContainerStyle={{
        paddingBottom: 20,
      }}
    />
  );
};

export default SongsList;

const styles = StyleSheet.create({
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  songContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "rgba(24, 181, 255, 0.2)",
  },
  songInfo: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#F8F9FE",
    marginBottom: 2,
  },
  artist: {
    fontSize: 13,
    color: "#A0A6B1",
    marginBottom: 2,
  },
  duration: {
    fontSize: 12,
    color: "#A0A6B1",
    opacity: 0.7,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    marginLeft: 8,
    padding: 6,
    borderRadius: 20,
  },
  playIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(123, 77, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
});