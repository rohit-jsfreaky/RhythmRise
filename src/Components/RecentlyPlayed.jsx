import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ToastAndroid,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import PlayListModal from "./PlayListModal";

const RecentlyPlayed = ({ playRecentSong, columns }) => {
  const [favorites, setFavorites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    (async () => {
      const stored = await SecureStore.getItemAsync("favorites");
      if (stored) setFavorites(JSON.parse(stored));
    })();
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

  const addToPlaylist = (song) => {
    setSelectedSong(song);
    setShowModal(true);
  };

  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>
        Recently Played
      </Text>
      <View style={{ flexDirection: "row" }}>
        <FlatList
          data={columns}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, idx) => "col" + idx}
          renderItem={({ item: col }) => (
            <View style={{ marginRight: 16 }}>
              {col.map((song) => (
                <View
                  style={{ flexDirection: "row", alignItems: "center" }}
                  key={song.url}
                >
                  <TouchableOpacity
                    onPress={() => playRecentSong(song)}
                    style={styles.recentSongItem}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: song.thumbnail }}
                      style={styles.recentArtwork}
                    />
                    <View style={styles.songInfo}>
                      <Text style={styles.recentTitle} numberOfLines={1}>
                        {song.title}
                      </Text>
                      <Text style={styles.recentArtist} numberOfLines={1}>
                        {song.uploader}
                      </Text>
                      <Text style={styles.recentDuration}>{song.duration}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => toggleFavorite(song)}
                      style={{ marginLeft: 8 }}
                    >
                      <Ionicons
                        name={isFavorite(song) ? "heart" : "heart-outline"}
                        size={22}
                        color={isFavorite(song) ? "#e74c3c" : "#aaa"}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => addToPlaylist(song)}
                      style={{ marginLeft: 8, padding: 4 }}
                    >
                      <Ionicons
                        name="ellipsis-vertical"
                        size={22}
                        color="#888"
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        />
      </View>
      {showModal && (
        <PlayListModal
          selectedSong={selectedSong}
          setSelectedSong={setSelectedSong}
          setShowModal={setShowModal}
          showModal={showModal}
        />
      )}
    </View>
  );
};

export default RecentlyPlayed;

const styles = StyleSheet.create({
  recentSongItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    width: 240,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  recentArtwork: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  songInfo: {
    flex: 1,
    justifyContent: "center",
  },
  recentTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 2,
  },
  recentArtist: {
    fontSize: 13,
    color: "#888",
    marginBottom: 2,
  },
  recentDuration: {
    fontSize: 12,
    color: "#aaa",
  },
});
