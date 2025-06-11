import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import TopTitle from "../../Components/TopTitle";
import SearchBar from "../../Components/SearchBar";
import SongsListSkeletonView from "../../Components/SongsListSkeletonView";
import TrackPlayer from "react-native-track-player";

import * as SecureStore from "expo-secure-store";
import SearchQuery from "../../Components/SearchQuery";
import SearchSongsList from "../../Components/SearchSongsList";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const route = useRoute();
  const { search } = route.params || {};
  const navigation = useNavigation();
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    (async () => {
      const stored = await SecureStore.getItemAsync("searchHistory");
      if (stored) setSearchHistory(JSON.parse(stored));
    })();
  }, []);

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

  const handleClear = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    // Update history
    let updated = [
      searchQuery,
      ...searchHistory.filter((q) => q !== searchQuery),
    ];
    if (updated.length > 10) updated = updated.slice(0, 10);
    setSearchHistory(updated);
    await SecureStore.setItemAsync("searchHistory", JSON.stringify(updated));
    fetchSongs(searchQuery);
  };

  const getSecondsFromDuration = (timeStr) => {
    const [mins, secs] = timeStr.split(":").map(Number);
    return mins * 60 + secs;
  };

  const onSongPress = async (song) => {
    try {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: song.url,
        url: `https://rhythm-rise-backend.vercel.app/api/music/get-audio-stream?url=${encodeURIComponent(
          song.url
        )}&quality=high`,
        title: song.title,
        artist: song.uploader,
        artwork: song.thumbnail,
        duration: getSecondsFromDuration(song.duration),
      });
      await TrackPlayer.play();
      // Store in recently played
      let recent = [];
      const stored = await SecureStore.getItemAsync("recentlyPlayed");
      if (stored) recent = JSON.parse(stored);
      // Remove if already exists, then add to front
      recent = [song, ...recent.filter((s) => s.url !== song.url)];
      if (recent.length > 20) recent = recent.slice(0, 20); // Limit to 20
      await SecureStore.setItemAsync("recentlyPlayed", JSON.stringify(recent));
      navigation.navigate("Player");
    } catch (error) {
      console.log("Error playing song:", error);
    }
  };

  const handleQueryTap = async (query) => {
    setSearchQuery(query);
    fetchSongs(query);
  };

  return (
    <View style={styles.scrollView}>
      <LinearGradient
        colors={["rgba(123, 77, 255, 0.15)", "rgba(8, 11, 56, 1)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.screen}>
          <StatusBar style="light" />
          <TopTitle title="Search" />

          <SearchBar
            fetchSongs={handleSearch}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showClear={searchResults.length > 0}
            onClear={handleClear}
          />

          <View style={styles.resultsContainer}>
            {isLoading ? (
              <View>
                {Array.from({ length: 10 }).map((_, index) => (
                  <SongsListSkeletonView key={index} />
                ))}
              </View>
            ) : searchResults.length === 0 ? (
              searchHistory.length === 0 ? (
                <View style={styles.emptyStateContainer}>
                  <Text style={styles.noResults}>
                    Search for music to get started
                  </Text>
                </View>
              ) : (
                <SearchQuery
                  searchHistory={searchHistory}
                  setSearchHistory={setSearchHistory}
                  handleQueryTap={handleQueryTap}
                />
              )
            ) : (
              <SearchSongsList
                isLoading={isLoading}
                searchResults={searchResults}
                setSearchResults={setSearchResults}
                onSongPress={onSongPress}
                currentTrack={currentTrack}
              />
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#080B38",
  },
  gradient: {
    flex: 1,
    minHeight: "100%",
  },
  screen: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  resultsContainer: {
    flex: 1,
    //  // Space for player
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
  },
  noResults: {
    textAlign: "center",
    fontSize: 16,
    color: "#A0A6B1",
    opacity: 0.8,
  },
});
