import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import TopTitle from "../../Components/TopTitle";
import SongsList from "../../Components/SongsList";
import SongsListSkeletonView from "../../Components/SongsListSkeletonView";
import PlayListModal from "../../Components/PlayListModal";
import { useTheme } from "../../contexts/ThemeContext";
import { apiBaseUrl } from "../../utils/apiAddress";
import { playAllSongs } from "../../utils/songs";
import { toggleFavorite, isFavorite } from "../../utils/Favorite";
import * as SecureStore from "expo-secure-store";

const TrendingSongs = () => {
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [somethingWentWrong, setSomethingWentWrong] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const { theme } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    fetchTrendingSongs();
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await SecureStore.getItemAsync("favorites");
      if (stored) setFavorites(JSON.parse(stored));
    } catch (error) {
      console.log("Error loading favorites:", error);
    }
  };

  const fetchTrendingSongs = async () => {
    try {
      setLoading(true);
      setSomethingWentWrong(false);

      const response = await fetch(`${apiBaseUrl}get-trending-songs-jio-savan`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      // Transform the data to match our song format
      const transformedSongs = data.data.map((song) => ({
        title: song.title.replace(/&quot;/g, '"').replace(/&amp;/g, "&"),
        artist: song.author || "Unknown Artist",
        uploader: song.author || "Unknown Artist",
        thumbnail: song.thumbnail,
        url:
          song.downloadUrl["320kbps"] ||
          song.downloadUrl["160kbps"] ||
          song.downloadUrl["96kbps"],
        duration: formatDuration(song.duration),
        id: song.id,
      }));

      setTrendingSongs(transformedSongs);
      setSomethingWentWrong(false);
    } catch (error) {
      console.error("Error fetching trending songs:", error);
      setSomethingWentWrong(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  const checkIsFavorite = (song) => isFavorite(song, favorites);

  const handleToggleFavorite = async (song) => {
    await toggleFavorite(song, favorites, setFavorites);
  };

  const playTrendingSong = async (song) => {
    await playAllSongs(song, navigation, trendingSongs, true);
  };

  const addToPlaylist = (song) => {
    setSelectedSong(song);
    setShowModal(true);
  };

  const retryFetch = () => {
    fetchTrendingSongs();
  };

  // Loading State
  if (loading) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <LinearGradient
          colors={theme.colors.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.screen}>
            <StatusBar style="light" />
            <TopTitle title="Trending Songs" />

            <View style={styles.contentContainer}>
              {/* Loading Header */}
              <View
                style={[
                  styles.loadingHeader,
                  { backgroundColor: theme.colors.glassBackground },
                ]}
              >
                <View
                  style={[
                    styles.loadingIcon,
                    { backgroundColor: theme.colors.primary + "20" },
                  ]}
                >
                  <Ionicons
                    name="trending-up"
                    size={24}
                    color={theme.colors.primary}
                  />
                </View>
                <View>
                  <Text
                    style={[
                      styles.loadingTitle,
                      { color: theme.colors.textPrimary },
                    ]}
                  >
                    Loading Trending Songs
                  </Text>
                  <Text
                    style={[
                      styles.loadingSubtitle,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Fetching the hottest tracks...
                  </Text>
                </View>
              </View>

              {/* Skeleton List */}
              <ScrollView showsVerticalScrollIndicator={false}>
                {Array.from({ length: 8 }).map((_, index) => (
                  <SongsListSkeletonView key={index} />
                ))}
              </ScrollView>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }

  // Error State
  if (somethingWentWrong) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <LinearGradient
          colors={theme.colors.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.screen}>
            <StatusBar style="light" />
            <TopTitle title="Trending Songs" />

            <View style={styles.emptyContainer}>
              <LinearGradient
                colors={[
                  theme.colors.errorColor + "30",
                  theme.colors.errorColor + "10",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.emptyIconContainer,
                  {
                    backgroundColor: theme.colors.glassBackground,
                    shadowColor: theme.colors.shadowColor,
                  },
                ]}
              >
                <Ionicons
                  name="alert-circle"
                  size={48}
                  color={theme.colors.errorColor}
                />
              </LinearGradient>

              <Text
                style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}
              >
                Something Went Wrong
              </Text>
              <Text
                style={[
                  styles.emptySubtitle,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Unable to load trending songs. Please try again later.
              </Text>

              <TouchableOpacity
                style={[
                  styles.retryButton,
                  { backgroundColor: theme.colors.primary },
                ]}
                onPress={retryFetch}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="refresh"
                  size={20}
                  color={theme.colors.textPrimary}
                />
                <Text
                  style={[
                    styles.retryText,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  Try Again
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }

  // Empty State (No data but no error)
  if (trendingSongs.length === 0) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <LinearGradient
          colors={theme.colors.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.screen}>
            <StatusBar style="light" />
            <TopTitle title="Trending Songs" />

            <View style={styles.emptyContainer}>
              <LinearGradient
                colors={[
                  theme.colors.primary + "30",
                  theme.colors.secondary + "20",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.emptyIconContainer,
                  {
                    backgroundColor: theme.colors.glassBackground,
                    shadowColor: theme.colors.shadowColor,
                  },
                ]}
              >
                <Ionicons
                  name="trending-up"
                  size={48}
                  color={theme.colors.primary}
                />
              </LinearGradient>

              <Text
                style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}
              >
                No Trending Songs Found
              </Text>
              <Text
                style={[
                  styles.emptySubtitle,
                  { color: theme.colors.textSecondary },
                ]}
              >
                We couldn't find any trending songs at the moment. Check back
                later!
              </Text>

              <TouchableOpacity
                style={[
                  styles.retryButton,
                  { backgroundColor: theme.colors.primary },
                ]}
                onPress={retryFetch}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="refresh"
                  size={20}
                  color={theme.colors.textPrimary}
                />
                <Text
                  style={[
                    styles.retryText,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  Refresh
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }

  // Success State - Show Songs
  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <LinearGradient
        colors={theme.colors.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.screen}>
          <StatusBar style="light" />
          <TopTitle title="Trending Songs" />

          <View style={styles.contentContainer}>
            {/* Stats Card */}
            <View
              style={[
                styles.statsCard,
                {
                  backgroundColor: theme.colors.glassBackground,
                  borderColor: theme.colors.border,
                  shadowColor: theme.colors.shadowColor,
                },
              ]}
            >
              <LinearGradient
                colors={[
                  theme.colors.primary + "25",
                  theme.colors.secondary + "15",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statsGradient}
              >
                <View style={styles.statsContent}>
                  <View style={styles.statsInfo}>
                    <Text
                      style={[
                        styles.statsNumber,
                        { color: theme.colors.textPrimary },
                      ]}
                    >
                      {trendingSongs.length}
                    </Text>
                    <Text
                      style={[
                        styles.statsLabel,
                        { color: theme.colors.textSecondary },
                      ]}
                    >
                      Trending Tracks
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statsIconContainer,
                      { backgroundColor: theme.colors.primary + "25" },
                    ]}
                  >
                    <Ionicons
                      name="trending-up"
                      size={24}
                      color={theme.colors.primary}
                    />
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* Songs List */}
            <SongsList
              data={trendingSongs}
              playSong={playTrendingSong}
              toggleFavorite={handleToggleFavorite}
              isFavorite={checkIsFavorite}
              addToPlaylist={addToPlaylist}
            />
          </View>

          {/* Playlist Modal */}
          {showModal && (
            <PlayListModal
              selectedSong={selectedSong}
              setSelectedSong={setSelectedSong}
              setShowModal={setShowModal}
              showModal={showModal}
            />
          )}
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default TrendingSongs;

const styles = StyleSheet.create({
  container: {
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
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 20,
  },
  // Loading States
  loadingHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  loadingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  loadingSubtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  // Empty States
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    opacity: 0.8,
    lineHeight: 22,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  retryText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  // Stats Card
  statsCard: {
    borderRadius: 20,
    marginBottom: 24,
    overflow: "hidden",
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  statsGradient: {
    padding: 20,
  },
  statsContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsInfo: {
    flex: 1,
  },
  statsNumber: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 14,
    opacity: 0.8,
  },
  statsIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
});
