import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import TrackPlayer from "react-native-track-player";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
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

  const playAllSongs = async () => {
    if (songs.length === 0) return;

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
      await TrackPlayer.play();
      navigation.navigate("Player");
    } catch (e) {
      console.log("Error playing all songs:", e);
    }
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

          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={26} color="#F8F9FE" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              <Text style={styles.songCount}>
                {songs.length} {songs.length === 1 ? "song" : "songs"}
              </Text>
            </View>
          </View>

          {songs.length > 0 && (
            <View style={styles.actionBar}>
              <TouchableOpacity
                style={styles.playAllButton}
                onPress={playAllSongs}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#18B5FF", "#7B4DFF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.playAllGradient}
                >
                  <Ionicons name="play" size={18} color="#F8F9FE" />
                  <Text style={styles.playAllText}>Play All</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.contentContainer}>
            {songs.length === 0 ? (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                  <Ionicons name="musical-notes" size={48} color="#7B4DFF" />
                </View>
                <Text style={styles.emptyTitle}>Playlist is empty</Text>
                <Text style={styles.emptySubtitle}>
                  Add songs from the search tab
                </Text>
              </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F8F9FE",
    marginBottom: 4,
  },
  songCount: {
    fontSize: 14,
    color: "#A0A6B1",
    marginBottom: 4,
  },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  playAllButton: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#7B4DFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  playAllGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  playAllText: {
    color: "#F8F9FE",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 6,
  },
  contentContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
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
