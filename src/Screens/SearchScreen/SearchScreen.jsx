import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import TopTitle from "../../Components/TopTitle";
import SearchBar from "../../Components/SearchBar";
import SongsListSkeletonView from "../../Components/SongsListSkeletonView";
import * as SecureStore from "expo-secure-store";
import SearchQuery from "../../Components/SearchQuery";
import SearchSongsList from "../../Components/SearchSongsList";
import { useTheme } from "../../contexts/ThemeContext";
import {
  handleFetchSognsYoutube,
  handleFetchSongsJioSavan,
  playSong,
} from "../../utils/songs";

import TrackPlayer, {
  useTrackPlayerEvents,
  Event,
} from "react-native-track-player";
import { mmkvStorage } from "../../utils/Favorite";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [youtubeResults, setYoutubeResults] = useState([]);
  const [jioSavanResults, setJioSavanResults] = useState([]);
  const [isLoadingYoutube, setIsLoadingYoutube] = useState(false);
  const [isLoadingJioSavan, setIsLoadingJioSavan] = useState(false);
  const [activeTab, setActiveTab] = useState("youtube"); // 'youtube' or 'jiosavan'
  const route = useRoute();
  const { search } = route.params || {};
  const navigation = useNavigation();
  const [searchHistory, setSearchHistory] = useState([]);
  const { theme } = useTheme();

  useEffect(() => {
    (async () => {
      const stored = mmkvStorage.getString("searchHistory");
      if (stored) setSearchHistory(JSON.parse(stored));
    })();
  }, []);

  useEffect(() => {
    if (search) {
      console.log("Search Query:", search);
      setSearchQuery(search);
      fetchSongs(search);
    }
  }, [search]);

  // Fetch songs from both APIs in parallel
  const fetchSongs = async (search) => {
    if (!search.trim()) return;

    // Update search history
    let updated = [search, ...searchHistory.filter((q) => q !== search)];
    if (updated.length > 10) updated = updated.slice(0, 10);
    setSearchHistory(updated);
    mmkvStorage.set("searchHistory", JSON.stringify(updated));
    // await SecureStore.setItemAsync("searchHistory", JSON.stringify(updated));

    // Start both API calls in parallel
    const youtubePromise = fetchYoutubeSongs(search);
    const jioSavanPromise = fetchJioSavanSongs(search);

    // Wait for both to complete
    await Promise.all([youtubePromise, jioSavanPromise]);
  };

  // Fetch YouTube songs
  const fetchYoutubeSongs = async (search) => {
    await handleFetchSognsYoutube(
      search,
      setIsLoadingYoutube,
      setYoutubeResults
    );
  };

  // Fetch JioSavan songs
  const fetchJioSavanSongs = async (search) => {
    await handleFetchSongsJioSavan(
      search,
      setIsLoadingJioSavan,
      setJioSavanResults
    );
  };

  const handleClear = () => {
    setSearchQuery("");
    setYoutubeResults([]);
    setJioSavanResults([]);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    fetchSongs(searchQuery);
  };
  // Handle YouTube song press
  const onYoutubeSongPress = async (song) => {
    await playSong(song, navigation);
  };

  // Handle JioSavan song press
  const onJioSavanSongPress = async (song) => {
    await playSong(song, navigation);
  };

  const handleQueryTap = async (query) => {
    setSearchQuery(query);
    fetchSongs(query);
  };

  // Get current results based on active tab
  const getCurrentResults = () => {
    return activeTab === "youtube" ? youtubeResults : jioSavanResults;
  };

  // Get current loading state
  const getCurrentLoading = () => {
    return activeTab === "youtube" ? isLoadingYoutube : isLoadingJioSavan;
  };

  // Get current song press handler
  const getCurrentSongPressHandler = () => {
    return activeTab === "youtube" ? onYoutubeSongPress : onJioSavanSongPress;
  };

  // Check if we have any results
  const hasAnyResults = youtubeResults.length > 0 || jioSavanResults.length > 0;

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      style={[styles.scrollView, { backgroundColor: theme.colors.background }]}
    >
      <LinearGradient
        colors={theme.colors.gradient}
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
            showClear={hasAnyResults}
            onClear={handleClear}
          />

          {/* Tabs - Show only when we have searched */}
          {hasAnyResults && (
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  {
                    backgroundColor:
                      activeTab === "youtube"
                        ? theme.colors.primary
                        : theme.colors.glassBackground,
                    borderColor: theme.colors.border,
                  },
                ]}
                onPress={() => setActiveTab("youtube")}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="logo-youtube"
                  size={20}
                  color={
                    activeTab === "youtube"
                      ? theme.colors.textPrimary
                      : theme.colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.tabText,
                    {
                      color:
                        activeTab === "youtube"
                          ? theme.colors.textPrimary
                          : theme.colors.textSecondary,
                      fontWeight: activeTab === "youtube" ? "600" : "500",
                    },
                  ]}
                >
                  YouTube ({youtubeResults.length})
                </Text>
                {isLoadingYoutube && (
                  <View
                    style={[
                      styles.loadingDot,
                      { backgroundColor: theme.colors.accent },
                    ]}
                  />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tab,
                  {
                    backgroundColor:
                      activeTab === "jiosavan"
                        ? theme.colors.primary
                        : theme.colors.glassBackground,
                    borderColor: theme.colors.border,
                  },
                ]}
                onPress={() => setActiveTab("jiosavan")}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="musical-notes"
                  size={20}
                  color={
                    activeTab === "jiosavan"
                      ? theme.colors.textPrimary
                      : theme.colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.tabText,
                    {
                      color:
                        activeTab === "jiosavan"
                          ? theme.colors.textPrimary
                          : theme.colors.textSecondary,
                      fontWeight: activeTab === "jiosavan" ? "600" : "500",
                    },
                  ]}
                >
                  JioSavan ({jioSavanResults.length})
                </Text>
                {isLoadingJioSavan && (
                  <View
                    style={[
                      styles.loadingDot,
                      { backgroundColor: theme.colors.accent },
                    ]}
                  />
                )}
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.resultsContainer}>
            {getCurrentLoading() ? (
              <View>
                {Array.from({ length: 8 }).map((_, index) => (
                  <SongsListSkeletonView key={index} />
                ))}
              </View>
            ) : !hasAnyResults ? (
              searchHistory.length === 0 ? (
                <View style={styles.emptyStateContainer}>
                  <LinearGradient
                    colors={[
                      theme.colors.primary + "20",
                      theme.colors.secondary + "20",
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                      styles.searchIconContainer,
                      { shadowColor: theme.colors.shadowColor },
                    ]}
                  >
                    <Ionicons
                      name="search"
                      size={32}
                      color={theme.colors.primary}
                    />
                  </LinearGradient>
                  <Text
                    style={[
                      styles.emptyTitle,
                      { color: theme.colors.textPrimary },
                    ]}
                  >
                    Search for Music
                  </Text>
                  <Text
                    style={[
                      styles.emptySubtitle,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Find songs from YouTube and JioSavan
                  </Text>
                </View>
              ) : (
                <SearchQuery
                  searchHistory={searchHistory}
                  setSearchHistory={setSearchHistory}
                  handleQueryTap={handleQueryTap}
                />
              )
            ) : getCurrentResults().length === 0 ? (
              <View style={styles.emptyStateContainer}>
                <LinearGradient
                  colors={[
                    theme.colors.textSecondary + "30",
                    theme.colors.textSecondary + "10",
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.searchIconContainer,
                    { shadowColor: theme.colors.shadowColor },
                  ]}
                >
                  <Ionicons
                    name="musical-note"
                    size={32}
                    color={theme.colors.textSecondary}
                  />
                </LinearGradient>
                <Text
                  style={[
                    styles.emptyTitle,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  No Results Found
                </Text>
                <Text
                  style={[
                    styles.emptySubtitle,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  No songs found on{" "}
                  {activeTab === "youtube" ? "YouTube" : "JioSavan"}
                </Text>
              </View>
            ) : (
              <SearchSongsList
                isLoading={getCurrentLoading()}
                searchResults={getCurrentResults()}
                setSearchResults={
                  activeTab === "youtube"
                    ? setYoutubeResults
                    : setJioSavanResults
                }
                onSongPress={getCurrentSongPressHandler()}
                scrollEnabled={false}
              />
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ScrollView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
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
  // Tab Styles
  tabContainer: {
    flexDirection: "row",
    marginVertical: 16,
    backgroundColor: "transparent",
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginHorizontal: 2,
    borderWidth: 1,
    position: "relative",
  },
  tabText: {
    fontSize: 14,
    marginLeft: 8,
  },
  loadingDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  // Results and Empty States
  resultsContainer: {
    flex: 1,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
    paddingHorizontal: 40,
  },
  searchIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 20,
  },
});
