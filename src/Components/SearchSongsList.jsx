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
import { useTheme } from "../contexts/ThemeContext";

const SearchSongsList = ({
  isLoading,
  setSearchResults,
  searchResults,
  onSongPress,
  currentTrack,
}) => {
  const { theme } = useTheme();

  return (
    <FlatList
      refreshControl={
        searchResults.length === 0 ? (
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              setSearchResults([]);
            }}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        ) : null
      }
      
      showsVerticalScrollIndicator={false}
      data={searchResults}
      keyExtractor={(item) => item.url}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.songItem, { backgroundColor: theme.colors.glassBackground }]}
          onPress={() => onSongPress(item)}
          activeOpacity={0.8}
        >
          <Image 
            source={{ uri: item.thumbnail }} 
            style={[styles.thumbnail, { backgroundColor: theme.colors.secondary + '30' }]} 
          />
          <View style={styles.songInfo}>
            <Text style={[styles.songTitle, { color: theme.colors.textPrimary }]} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={[styles.songUploader, { color: theme.colors.textSecondary }]} numberOfLines={1}>
              {item.uploader}
            </Text>
            <Text style={[styles.songDuration, { color: theme.colors.textSecondary }]}>
              {item.duration}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => onSongPress(item)}
            style={[styles.playButton, { backgroundColor: theme.colors.primary + '40' }]}
          >
            <Ionicons name="play" size={22} color={theme.colors.textPrimary} />
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
    borderRadius: 12,
    alignItems: "center",
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 10,
  },
  songInfo: {
    marginLeft: 16,
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  songUploader: {
    fontSize: 13,
    marginBottom: 2,
  },
  songDuration: {
    fontSize: 12,
    opacity: 0.8,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
});
