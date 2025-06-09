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
        >
          <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
          <View style={styles.songInfo}>
            <Text style={styles.songTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.songDetails}>
              {item.uploader} • {item.duration}
            </Text>
          </View>
        </TouchableOpacity>
      )}
      contentContainerStyle={{
        paddingBottom: currentTrack ? 60 : 0,
      }}
    />
  );
};

export default SearchSongsList;

const styles = StyleSheet.create({
  songItem: {
    flexDirection: "row",
    paddingVertical: 10,

    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  songInfo: {
    marginLeft: 10,
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  songDetails: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
});
