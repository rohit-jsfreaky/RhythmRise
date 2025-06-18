import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import TopTitle from "../../Components/TopTitle";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import PlayListModal from "../../Components/PlayListModal";
import SongsList from "../../Components/SongsList";
import { useTheme } from "../../contexts/ThemeContext";
import { playAllSongs } from "../../utils/songs";
import { toggleFavorite } from "../../utils/Favorite";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const navigation = useNavigation();
  const { theme } = useTheme();

  useEffect(() => {
    const loadFavorites = async () => {
      const stored = await SecureStore.getItemAsync("favorites");
      if (stored) setFavorites(JSON.parse(stored));
    };
    loadFavorites();
  }, []);

  const isFavorite = (song) => favorites.some((fav) => fav.url === song.url);

  const handletoggleFavorite = async (song) => {
    await toggleFavorite(song, favorites, setFavorites);
  };

  // Play all favorites, start from pressed song
  const playFavoriteSong = async (song) => {
    await playAllSongs(song, navigation, favorites);
  };
  const addToPlaylist = (song) => {
    setSelectedSong(song);
    setShowModal(true);
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
          <TopTitle title="Favorites" />

          <View style={styles.contentContainer}>
            {favorites.length === 0 ? (
              <View style={styles.emptyContainer}>
                <LinearGradient
                  colors={[
                    theme.colors.errorColor + "40",
                    theme.colors.errorColor + "20",
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
                    name="heart"
                    size={48}
                    color={theme.colors.errorColor}
                  />
                </LinearGradient>
                <Text
                  style={[
                    styles.emptyTitle,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  No favorites yet
                </Text>
                <Text
                  style={[
                    styles.emptySubtitle,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Songs you love will appear here
                </Text>
                <View style={styles.emptyTip}>
                  <View
                    style={[
                      styles.tipIconContainer,
                      { backgroundColor: theme.colors.primary + "33" }, // 20% opacity
                    ]}
                  >
                    <Ionicons
                      name="information-circle"
                      size={20}
                      color={theme.colors.primary}
                    />
                  </View>
                  <Text
                    style={[
                      styles.tipText,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Tap the heart icon on any song to add it here
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.songsContainer}>
                {/* Statistics Card */}
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
                      theme.colors.primary + "33",
                      theme.colors.secondary + "20",
                    ]} // 20%, 12% opacity
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
                          {favorites.length}
                        </Text>
                        <Text
                          style={[
                            styles.statsLabel,
                            { color: theme.colors.textSecondary },
                          ]}
                        >
                          {favorites.length === 1
                            ? "Favorite Song"
                            : "Favorite Songs"}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.statsIconContainer,
                          { backgroundColor: theme.colors.errorColor + "33" }, // 20% opacity
                        ]}
                      >
                        <Ionicons
                          name="heart"
                          size={24}
                          color={theme.colors.errorColor}
                        />
                      </View>
                    </View>
                  </LinearGradient>
                </View>

                <SongsList
                  addToPlaylist={addToPlaylist}
                  data={favorites}
                  isFavorite={isFavorite}
                  playSong={playFavoriteSong}
                  toggleFavorite={handletoggleFavorite}
                />
              </View>
            )}
            {showModal && (
              <PlayListModal
                selectedSong={selectedSong}
                setSelectedSong={setSelectedSong}
                setShowModal={setShowModal}
                showModal={showModal}
              />
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default Favorites;

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
  contentContainer: {
    flex: 1,
    paddingVertical: 20,
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
  emptyTip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    maxWidth: 280,
  },
  tipIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.8,
  },
  songsContainer: {
    flex: 1,
  },
  statsCard: {
    borderRadius: 20,
    marginBottom: 24,
    overflow: "hidden",
    borderWidth: 1,
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
