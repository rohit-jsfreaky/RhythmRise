import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import TopTitle from "../../Components/TopTitle";
import { Ionicons } from "@expo/vector-icons";
import TrackPlayer from "react-native-track-player";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import PlayListModal from "../../Components/PlayListModal";
import SongsList from "../../Components/SongsList";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadFavorites = async () => {
      const stored = await SecureStore.getItemAsync("favorites");
      if (stored) setFavorites(JSON.parse(stored));
    };
    loadFavorites();
  }, []);

  const isFavorite = (song) => favorites.some((fav) => fav.url === song.url);

  const toggleFavorite = async (song) => {
    let updated;
    if (isFavorite(song)) {
      updated = favorites.filter((fav) => fav.url !== song.url);
    } else {
      updated = [song, ...favorites.filter((fav) => fav.url !== song.url)];
    }
    setFavorites(updated);
    await SecureStore.setItemAsync("favorites", JSON.stringify(updated));
  };

  // Play all favorites, start from pressed song
  const playFavoriteSong = async (song) => {
    try {
      await TrackPlayer.reset();
      // Add all favorites to queue
      for (const fav of favorites) {
        await TrackPlayer.add({
          id: fav.url,
          url: `https://rhythm-rise-backend.vercel.app/api/music/get-audio-stream?url=${encodeURIComponent(
            fav.url
          )}&quality=high`,
          title: fav.title,
          artist: fav.uploader,
          artwork: fav.thumbnail,
          duration:
            fav.duration && typeof fav.duration === "string"
              ? getSecondsFromDuration(fav.duration)
              : fav.duration || 0,
        });
      }
      // Find index of pressed song
      const idx = favorites.findIndex((f) => f.url === song.url);
      if (idx > 0) await TrackPlayer.skip(idx);
      await TrackPlayer.play();
      navigation.replace("Tabs", { screen: "Player" });
    } catch (e) {
      console.log("Error playing favorite:", e);
    }
  };

  const getSecondsFromDuration = (timeStr) => {
    if (!timeStr) return 0;
    const [mins, secs] = timeStr.split(":").map(Number);
    return mins * 60 + secs;
  };

  const addToPlaylist = (song) => {
    setSelectedSong(song);
    setShowModal(true);
  };

  return (
    <View style={styles.scrollView}>
      <LinearGradient
        colors={["rgba(123, 77, 255, 0.15)", "#080B38"]}
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
                <View style={styles.emptyIconContainer}>
                  <Ionicons name="heart" size={48} color="#7B4DFF" />
                </View>
                <Text style={styles.emptyTitle}>No favorites yet</Text>
                <Text style={styles.emptySubtitle}>
                  Songs you love will appear here
                </Text>
              </View>
            ) : (
              <SongsList
                addToPlaylist={addToPlaylist}
                data={favorites}
                isFavorite={isFavorite}
                playSong={playFavoriteSong}
                toggleFavorite={toggleFavorite}
              />
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
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(123, 77, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F8F9FE",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#A0A6B1",
  },
});
