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
import TrackPlayer from "react-native-track-player";
import * as SecureStore from "expo-secure-store";
import SearchQuery from "../../Components/SearchQuery";
import SearchSongsList from "../../Components/SearchSongsList";
import { useTheme } from "../../contexts/ThemeContext";
import { apiBaseUrl } from "../../utils/apiAddress";

export const getBestQualityUrl = (downloadUrls) => {
  const qualityPriority = ["320kbps", "160kbps", "96kbps", "48kbps", "12kbps"];

  for (const quality of qualityPriority) {
    const found = downloadUrls.find((item) => item.quality === quality);
    if (found) return found.url;
  }

  // Fallback to first available URL
  return downloadUrls[0]?.url || "";
};

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [youtubeResults, setYoutubeResults] = useState([]);
  const [jioSavanResults, setJioSavanResults] = useState([]);
  const [isLoadingYoutube, setIsLoadingYoutube] = useState(false);
  const [isLoadingJioSavan, setIsLoadingJioSavan] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [activeTab, setActiveTab] = useState("youtube"); // 'youtube' or 'jiosavan'
  const route = useRoute();
  const { search } = route.params || {};
  const navigation = useNavigation();
  const [searchHistory, setSearchHistory] = useState([]);
  const { theme } = useTheme();

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

  // Fetch songs from both APIs in parallel
  const fetchSongs = async (search) => {
    if (!search.trim()) return;

    // Update search history
    let updated = [search, ...searchHistory.filter((q) => q !== search)];
    if (updated.length > 10) updated = updated.slice(0, 10);
    setSearchHistory(updated);
    await SecureStore.setItemAsync("searchHistory", JSON.stringify(updated));

    // Start both API calls in parallel
    const youtubePromise = fetchYoutubeSongs(search);
    const jioSavanPromise = fetchJioSavanSongs(search);

    // Wait for both to complete
    await Promise.all([youtubePromise, jioSavanPromise]);
  };

  // Fetch YouTube songs
  const fetchYoutubeSongs = async (search) => {
    try {
      setIsLoadingYoutube(true);
      const response = await fetch(
        `${apiBaseUrl}search-songs?q=${encodeURIComponent(search)}`
      );
      if (!response.ok) {
        throw new Error("YouTube search failed");
      }
      const data = await response.json();
      setYoutubeResults(data);
    } catch (error) {
      console.log("Error fetching YouTube songs:", error);
      setYoutubeResults([]);
    } finally {
      setIsLoadingYoutube(false);
    }
  };

  // Fetch JioSavan songs
  const fetchJioSavanSongs = async (search) => {
    try {
      setIsLoadingJioSavan(true);
      const response = await fetch(
        `${apiBaseUrl}search-songs-jio-savan?q=${encodeURIComponent(search)}`
      );
      if (!response.ok) {
        throw new Error("JioSavan search failed");
      }
      const data = await response.json();

      // Transform JioSavan data to match our format
      const transformedData = data.data.map((song) => ({
        id: song.id,
        title: song.title,
        uploader: song.author || "Unknown Artist",
        artist: song.author || "Unknown Artist",
        thumbnail: song.thumbnail,
        duration: formatDuration(song.duration),
        url: song.id, // Use ID as identifier
        downloadUrls: song.downloadUrls,
        source: "jiosavan",
      }));

      setJioSavanResults(transformedData);
    } catch (error) {
      console.log("Error fetching JioSavan songs:", error);
      setJioSavanResults([]);
    } finally {
      setIsLoadingJioSavan(false);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
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

  const getSecondsFromDuration = (timeStr) => {
    const [mins, secs] = timeStr.split(":").map(Number);
    return mins * 60 + secs;
  };

  // Handle YouTube song press
  const onYoutubeSongPress = async (song) => {
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
      await storeRecentlyPlayed(song);
      navigation.navigate("Player");
    } catch (error) {
      console.log("Error playing YouTube song:", error);
    }
  };

  // Handle JioSavan song press
  const onJioSavanSongPress = async (song) => {
    try {
      // Get the best quality URL
      const bestQualityUrl = getBestQualityUrl(song.downloadUrls);

      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: song.id,
        url: bestQualityUrl,
        title: song.title,
        artist: song.uploader,
        artwork: song.thumbnail,
        duration: getSecondsFromDuration(song.duration),
      });
      await TrackPlayer.play();

      // Store in recently played
      await storeRecentlyPlayed(song);
      navigation.navigate("Player");
    } catch (error) {
      console.log("Error playing JioSavan song:", error);
    }
  };

  // Get best quality URL from JioSavan downloadUrls

  // Store recently played songs
  const storeRecentlyPlayed = async (song) => {
    let recent = [];
    const stored = await SecureStore.getItemAsync("recentlyPlayed");
    if (stored) recent = JSON.parse(stored);

    // Remove if already exists, then add to front
    recent = [
      song,
      ...recent.filter((s) => s.url !== song.url && s.id !== song.id),
    ];
    if (recent.length > 20) recent = recent.slice(0, 20); // Limit to 20
    await SecureStore.setItemAsync("recentlyPlayed", JSON.stringify(recent));
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
                currentTrack={currentTrack}
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
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
