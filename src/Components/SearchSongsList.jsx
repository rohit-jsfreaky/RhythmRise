import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const SearchSongsList = ({
  isLoading,
  setSearchResults,
  searchResults,
  onSongPress,
  currentTrack,
}) => {
  return (
    <FlatList
      refreshControl={
        searchResults.length === 0 ? (
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              setSearchResults([]);
            }}
            colors={["#7B4DFF"]}
            tintColor="#7B4DFF"
          />
        ) : null
      }
      
      showsVerticalScrollIndicator={false}
      data={searchResults}
      keyExtractor={(item) => item.url}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.songItem}
          onPress={() => onSongPress(item)}
          activeOpacity={0.8}
        >
          <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
          <View style={styles.songInfo}>
            <Text style={styles.songTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.songUploader} numberOfLines={1}>
              {item.uploader}
            </Text>
            <Text style={styles.songDuration}>{item.duration}</Text>
          </View>
          <TouchableOpacity
            onPress={() => onSongPress(item)}
            style={styles.playButton}
          >
            <Ionicons name="play" size={22} color="#F8F9FE" />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
      contentContainerStyle={{
        paddingBottom: currentTrack ? 80 : 20,
      }}
    />
  );
};

export default SearchSongsList;

const styles = StyleSheet.create({
  songItem: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    alignItems: "center",
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: "rgba(24, 181, 255, 0.2)",
  },
  songInfo: {
    marginLeft: 16,
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F8F9FE",
    marginBottom: 2,
  },
  songUploader: {
    fontSize: 13,
    color: "#A0A6B1",
    marginBottom: 2,
  },
  songDuration: {
    fontSize: 12,
    color: "#A0A6B1",
    opacity: 0.8,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(123, 77, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
});
