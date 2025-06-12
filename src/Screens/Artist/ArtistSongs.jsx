import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import TrackPlayer from "react-native-track-player";
import * as SecureStore from "expo-secure-store";
import { useTheme } from "../../contexts/ThemeContext";
import SongsList from "../../Components/SongsList";
import SongsListSkeletonView from "../../Components/SongsListSkeletonView";

const ArtistSongs = () => {
  const [artistSongs, setArtistSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const route = useRoute();
  const navigation = useNavigation();
  const { theme } = useTheme();

  const { artist } = route.params || {};

  useEffect(() => {
    if (artist) {
      fetchArtistSongs();
      loadFavorites();
    }
  }, [artist]);

  const loadFavorites = async () => {
    try {
      const stored = await SecureStore.getItemAsync("favorites");
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.log("Error loading favorites:", error);
    }
  };

  const fetchArtistSongs = async () => {
    if (!artist?.name) return;

    try {
      setIsLoading(true);

      
      const response = await fetch(
        `https://rhythm-rise-backend.vercel.app/api/music/search-songs?q=${encodeURIComponent(
          artist.name
        )}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      // Filter songs that are more likely to be from this artist
      const filteredSongs = data.filter(
        (song) =>
          song.uploader.toLowerCase().includes(artist.name.toLowerCase()) ||
          song.title.toLowerCase().includes(artist.name.toLowerCase())
      );

      setArtistSongs(filteredSongs.length > 0 ? filteredSongs : data);
    } catch (error) {
      console.log("Error fetching artist songs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSecondsFromDuration = (timeStr) => {
    if (!timeStr) return 0;
    const [mins, secs] = timeStr.split(":").map(Number);
    return mins * 60 + secs;
  };

  const playSong = async (selectedSong) => {
    try {
      // Clear current queue
      await TrackPlayer.reset();

      // Add all songs to queue
      const tracksToAdd = artistSongs.map((song) => ({
        id: song.url,
        url: `https://rhythm-rise-backend.vercel.app/api/music/get-audio-stream?url=${encodeURIComponent(
          song.url
        )}&quality=high`,
        title: song.title,
        artist: song.uploader,
        artwork: song.thumbnail,
        duration: getSecondsFromDuration(song.duration),
      }));

      await TrackPlayer.add(tracksToAdd);

      // Find the index of the selected song and skip to it
      const selectedIndex = artistSongs.findIndex(
        (song) => song.url === selectedSong.url
      );
      if (selectedIndex !== -1) {
        await TrackPlayer.skip(selectedIndex);
      }

      await TrackPlayer.play();

      // Store in recently played
      let recent = [];
      const stored = await SecureStore.getItemAsync("recentlyPlayed");
      if (stored) recent = JSON.parse(stored);

      // Remove if already exists, then add to front
      recent = [
        selectedSong,
        ...recent.filter((s) => s.url !== selectedSong.url),
      ];
      if (recent.length > 20) recent = recent.slice(0, 20);
      await SecureStore.setItemAsync("recentlyPlayed", JSON.stringify(recent));

      // Navigate to player
     navigation.replace("Tabs", { screen: "Player" });
    } catch (error) {
      console.log("Error playing song:", error);
    }
  };

  const toggleFavorite = async (song) => {
    try {
      let updatedFavorites;
      const isFav = favorites.some((fav) => fav.url === song.url);

      if (isFav) {
        updatedFavorites = favorites.filter((fav) => fav.url !== song.url);
      } else {
        updatedFavorites = [song, ...favorites];
      }

      setFavorites(updatedFavorites);
      await SecureStore.setItemAsync(
        "favorites",
        JSON.stringify(updatedFavorites)
      );
    } catch (error) {
      console.log("Error toggling favorite:", error);
    }
  };

  const isFavorite = (song) => {
    return favorites.some((fav) => fav.url === song.url);
  };

  const addToPlaylist = (song) => {
    // Implement playlist functionality later
    console.log("Add to playlist:", song.title);
  };

  if (!artist) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Text style={[styles.errorText, { color: theme.colors.textPrimary }]}>
          Artist information not available
        </Text>
      </View>
    );
  }

  return (
    <View
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

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={[
                styles.backButton,
                { backgroundColor: theme.colors.glassBackground },
              ]}
              onPress={() => navigation.goBack()}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={theme.colors.textPrimary}
              />
            </TouchableOpacity>
            <Text
              style={[styles.headerTitle, { color: theme.colors.textPrimary }]}
            >
              {artist.name}
            </Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Artist Header */}
          <View style={styles.artistHeader}>
            <LinearGradient
              colors={artist.gradient || theme.colors.activeGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.artistImageContainer}
            >
              <Image
                source={{ uri: artist.image }}
                style={styles.artistImage}
              />
            </LinearGradient>

            <View style={styles.artistInfo}>
              <Text
                style={[styles.artistName, { color: theme.colors.textPrimary }]}
              >
                {artist.name}
              </Text>
              <Text
                style={[
                  styles.artistGenre,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {artist.genre}
              </Text>
              {artistSongs.length > 0 && (
                <Text
                  style={[
                    styles.songCount,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {artistSongs.length} songs
                </Text>
              )}
            </View>
          </View>

          {/* Play All Button */}
          {artistSongs.length > 0 && (
            <TouchableOpacity
              style={[
                styles.playAllButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => playSong(artistSongs[0])}
            >
              <Ionicons name="play" size={20} color="#FFFFFF" />
              <Text style={styles.playAllText}>Play All</Text>
            </TouchableOpacity>
          )}

          {/* Songs Section */}
          <View style={styles.songsSection}>
            <Text
              style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
            >
              Songs
            </Text>

            {isLoading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <SongsListSkeletonView key={index} />
              ))
            ) : artistSongs.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="musical-notes-outline"
                  size={48}
                  color={theme.colors.textSecondary}
                />
                <Text
                  style={[
                    styles.emptyText,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  No songs found for {artist.name}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.retryButton,
                    { backgroundColor: theme.colors.glassBackground },
                  ]}
                  onPress={fetchArtistSongs}
                >
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
            ) : (
              <SongsList
                data={artistSongs}
                playSong={playSong}
                toggleFavorite={toggleFavorite}
                isFavorite={isFavorite}
                addToPlaylist={addToPlaylist}
              />
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default ArtistSongs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  artistHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  artistImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 4,
    marginBottom: 16,
  },
  artistImage: {
    width: "100%",
    height: "100%",
    borderRadius: 56,
  },
  artistInfo: {
    alignItems: "center",
  },
  artistName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  artistGenre: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 8,
  },
  songCount: {
    fontSize: 14,
    opacity: 0.6,
  },
  playAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 32,
    alignSelf: "center",
  },
  playAllText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  songsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  retryText: {
    fontSize: 14,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
  },
});
