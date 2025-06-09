import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import TopTitle from "../../Components/TopTitle";
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
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" backgroundColor="#fff" />
      <TopTitle title="Favorites" />

      <View
        style={{
          flex: 1,
          paddingVertical: 20,
          ...(favorites.length === 0
            ? { justifyContent: "center", alignItems: "center" }
            : {}),
        }}
      >
        {favorites.length === 0 ? (
          <Text
            style={{
              color: "#888",
              marginTop: 20,
              fontWeight: "bold",
              fontSize: 30,
            }}
          >
            No favorites yet.
          </Text>
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
  );
};

export default Favorites;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
});
