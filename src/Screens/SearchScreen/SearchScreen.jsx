import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import TopTitle from "../../Components/TopTitle";
import SearchBar from "../../Components/SearchBar";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const route = useRoute();
  const { search } = route.params || {};
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);

  useEffect(() => {
    if (search) {
      console.log("Search Query:", search);
      fetchSongs(search);
    }
  }, [search]);

  const fetchSongs = async (search) => {
    if (!search.trim()) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `https://rhythm-rise-backend.vercel.app/api/music/search-songs?q=${encodeURIComponent(
          search
        )}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.log("Error fetching songs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" backgroundColor="#fff" />
      <TopTitle title="Search Songs" />

      <SearchBar
        fetchSongs={fetchSongs}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <View style={styles.resultsContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#1DB954" />
        ) : searchResults.length === 0 ? (
          <Text style={styles.noResults}>Search for music to get started</Text>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={searchResults}
            keyExtractor={(item) => item.url}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.songItem}
                onPress={() => console.log("Selected song:", item)}
              >
                <Image
                  source={{ uri: item.thumbnail }}
                  style={styles.thumbnail}
                />
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
        )}
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  resultsContainer: {
    flex: 1,
  },
  noResults: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
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
