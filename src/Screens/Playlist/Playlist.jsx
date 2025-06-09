import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import TrackPlayer from "react-native-track-player";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import SongsList from "../../Components/SongsList";
import PlayListModal from "../../Components/PlayListModal";

const Playlist = () => {
  const [favorites, setFavorites] = useState([]);
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const route = useRoute();
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const { title } = route.params;

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

  const getSecondsFromDuration = (timeStr) => {
    if (!timeStr) return 0;
    const [mins, secs] = timeStr.split(":").map(Number);
    return mins * 60 + secs;
  };

  const playPlaylistSong = async (song) => {
    try {
      await TrackPlayer.reset();
      for (const s of songs) {
        await TrackPlayer.add({
          id: s.url,
          url: `https://rhythm-rise-backend.vercel.app/api/music/get-audio-stream?url=${encodeURIComponent(
            s.url
          )}&quality=high`,
          title: s.title,
          artist: s.uploader,
          artwork: s.thumbnail,
          duration: getSecondsFromDuration(s.duration),
        });
      }
      const idx = songs.findIndex((s) => s.url === song.url);
      if (idx > 0) await TrackPlayer.skip(idx);
      await TrackPlayer.play();
      navigation.navigate("Player");
    } catch (e) {
      console.log("Error playing playlist:", e);
    }
  };

  const addToPlaylist = (song) => {
    setSelectedSong(song);
    setShowModal(true);
  };

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

  const handleRemoveSong = async (song) => {
    const stored = await SecureStore.getItemAsync("playlists");
    let playlistsArr = stored ? JSON.parse(stored) : [];
    playlistsArr = playlistsArr.map((pl) =>
      pl.title === title
        ? { ...pl, songs: pl.songs.filter((s) => s.url !== song.url) }
        : pl
    );
    await SecureStore.setItemAsync("playlists", JSON.stringify(playlistsArr));
    setSongs((prev) => prev.filter((s) => s.url !== song.url));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 16 }}>
        {title}
      </Text>
      {songs.length === 0 ? (
        <Text style={{ color: "#888" }}>No songs in this playlist yet.</Text>
      ) : (
        <SongsList
          addToPlaylist={addToPlaylist}
          data={songs}
          isFavorite={isFavorite}
          playSong={playPlaylistSong}
          toggleFavorite={toggleFavorite}
          onRemove={handleRemoveSong}
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
    </SafeAreaView>
  );
};

export default Playlist;

const styles = StyleSheet.create({});
