import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import SongsList from "../../Components/SongsList";
import PlayListModal from "../../Components/PlayListModal";
import { useTheme } from "../../contexts/ThemeContext";
import { removeFavorite, toggleFavorite } from "../../utils/Favorite";
import { playAllSongs } from "../../utils/songs";

const Playlist = () => {
  const [favorites, setFavorites] = useState([]);
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const route = useRoute();
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const { title } = route.params;
  const { theme } = useTheme();

  useEffect(() => {
    (async () => {
      const stored = await SecureStore.getItemAsync("playlists");
      if (stored) {
        const playlists = JSON.parse(stored);
        const playlist = playlists.find((p) => p.title === title);
        setSongs(playlist ? playlist.songs : []);
      }
    })();
  }, [title]);

  useEffect(() => {
    const loadFavorites = async () => {
      const stored = await SecureStore.getItemAsync("favorites");
      if (stored) setFavorites(JSON.parse(stored));
    };
    loadFavorites();
  }, []);
  const playPlaylistSong = async (song) => {
    await playAllSongs(song, navigation, songs);
  };

  const addToPlaylist = (song) => {
    setSelectedSong(song);
    setShowModal(true);
  };

  const isFavorite = (song) => favorites.some((fav) => fav.url === song.url);

  const handletoggleFavorite = async (song) => {
    await toggleFavorite(song, favorites, setFavorites);
  };

  const handleRemoveSong = async (song) => {
    await removeFavorite(song, title, setSongs);
  };

  const handleplayAllSongs = async () => {
    if (songs.length === 0) return;

    await playAllSongs(null, navigation, songs);
  };

  // Generate dynamic playlist icon based on title
  const getPlaylistIcon = (title) => {
    const icons = [
      "musical-notes",
      "library",
      "headset",
      "radio",
      "disc",
      "albums",
    ];
    const index = title.length % icons.length;
    return icons[index];
  };

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

          {/* Modern Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[
                styles.backButton,
                { backgroundColor: theme.colors.glassBackground },
              ]}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme.colors.textPrimary}
              />
            </TouchableOpacity>

            <View style={styles.headerContent}>
              <View style={styles.titleContainer}>
                <Text
                  style={[styles.title, { color: theme.colors.textPrimary }]}
                  numberOfLines={1}
                >
                  {title}
                </Text>
                <Text
                  style={[
                    styles.songCount,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {songs.length} {songs.length === 1 ? "song" : "songs"}
                </Text>
              </View>

              {/* Playlist Icon */}
              <View
                style={[
                  styles.playlistIconContainer,
                  { backgroundColor: theme.colors.primary + "33" }, // 20% opacity
                ]}
              >
                <Ionicons
                  name={getPlaylistIcon(title)}
                  size={24}
                  color={theme.colors.primary}
                />
              </View>
            </View>
          </View>

          {/* Enhanced Action Bar */}
          {songs.length > 0 && (
            <View style={styles.actionBar}>
              <TouchableOpacity
                style={[
                  styles.playAllButton,
                  {
                    shadowColor: theme.colors.shadowColor,
                  },
                ]}
                onPress={handleplayAllSongs}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={theme.colors.activeGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.playAllGradient}
                >
                  <Ionicons
                    name="play"
                    size={20}
                    color={theme.colors.textPrimary}
                  />
                  <Text
                    style={[
                      styles.playAllText,
                      { color: theme.colors.textPrimary },
                    ]}
                  >
                    Play All
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Shuffle Button */}
              <TouchableOpacity
                style={[
                  styles.shuffleButton,
                  { backgroundColor: theme.colors.glassBackground },
                ]}
                onPress={() => {
                  // Add shuffle functionality
                  playAllSongs();
                }}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="shuffle"
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Content Container */}
          <View style={styles.contentContainer}>
            {songs.length === 0 ? (
              <View style={styles.emptyContainer}>
                <LinearGradient
                  colors={[
                    theme.colors.primary + "40",
                    theme.colors.secondary + "20",
                  ]} // 25%, 12% opacity
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
                    name="musical-notes"
                    size={48}
                    color={theme.colors.textPrimary}
                  />
                </LinearGradient>

                <Text
                  style={[
                    styles.emptyTitle,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  Playlist is empty
                </Text>
                <Text
                  style={[
                    styles.emptySubtitle,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Add songs from the search tab
                </Text>

                {/* Enhanced Empty State Tips */}
                <View style={styles.emptyTips}>
                  <View style={styles.tipItem}>
                    <View
                      style={[
                        styles.tipIcon,
                        { backgroundColor: theme.colors.accent + "33" }, // 20% opacity
                      ]}
                    >
                      <Ionicons
                        name="search"
                        size={16}
                        color={theme.colors.accent}
                      />
                    </View>
                    <Text
                      style={[
                        styles.tipText,
                        { color: theme.colors.textSecondary },
                      ]}
                    >
                      Search for songs in the Search tab
                    </Text>
                  </View>

                  <View style={styles.tipItem}>
                    <View
                      style={[
                        styles.tipIcon,
                        { backgroundColor: theme.colors.secondary + "33" }, // 20% opacity
                      ]}
                    >
                      <Ionicons
                        name="add"
                        size={16}
                        color={theme.colors.secondary}
                      />
                    </View>
                    <Text
                      style={[
                        styles.tipText,
                        { color: theme.colors.textSecondary },
                      ]}
                    >
                      Tap the menu button to add to playlist
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <SongsList
                addToPlaylist={addToPlaylist}
                data={songs}
                isFavorite={isFavorite}
                playSong={playPlaylistSong}
                toggleFavorite={handletoggleFavorite}
                onRemove={handleRemoveSong}
              />
            )}
          </View>

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

export default Playlist;

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
  },
  header: {
    marginVertical: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 6,
    lineHeight: 34,
  },
  songCount: {
    fontSize: 15,
    opacity: 0.8,
  },
  playlistIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  playAllButton: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  playAllGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  playAllText: {
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  shuffleButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contentContainer: {
    flex: 1,
  },
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
  },
  emptyTips: {
    alignSelf: "stretch",
    maxWidth: 300,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  tipIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
});
