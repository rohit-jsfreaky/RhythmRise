import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

const PlayListModal = ({
  showModal,
  setShowModal,
  setSelectedSong,
  selectedSong,
}) => {
  const [playlists, setPlaylists] = useState([]);
  const handleAddToPlaylist = async (playlistTitle) => {
    const stored = await SecureStore.getItemAsync("playlists");
    let playlistsArr = stored ? JSON.parse(stored) : [];
    playlistsArr = playlistsArr.map((pl) =>
      pl.title === playlistTitle
        ? {
            ...pl,
            songs: [
              selectedSong,
              ...pl.songs.filter((s) => s.url !== selectedSong.url),
            ],
          }
        : pl
    );
    await SecureStore.setItemAsync("playlists", JSON.stringify(playlistsArr));
    setShowModal(false);
    setSelectedSong(null);
    ToastAndroid.show(
      `Added to playlist "${playlistTitle}"`,
      ToastAndroid.SHORT
    );
  };

  useEffect(() => {
    (async () => {
      const stored = await SecureStore.getItemAsync("playlists");
      if (stored) setPlaylists(JSON.parse(stored));
    })();
  }, []);

  return (
    <Modal
      transparent
      animationType="fade"
      visible={showModal}
      onRequestClose={() => setShowModal(false)}
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={() => setShowModal(false)}
      >
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Add to Playlist</Text>
          {playlists.length === 0 ? (
            <Text style={styles.modalEmpty}>No playlists found.</Text>
          ) : (
            playlists.map((pl) => (
              <TouchableOpacity
                key={pl.title}
                style={styles.modalPlaylistBtn}
                onPress={() => handleAddToPlaylist(pl.title)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalPlaylistText}>{pl.title}</Text>
              </TouchableOpacity>
            ))
          )}
          <TouchableOpacity
            onPress={() => setShowModal(false)}
            style={styles.modalCancelBtn}
          >
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

export default PlayListModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 28,
    width: 300,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 18,
    color: "#222",
  },
  modalEmpty: {
    color: "#888",
    marginBottom: 10,
    fontSize: 15,
  },
  modalPlaylistBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#f3f3f3",
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  modalPlaylistText: {
    color: "#222",
    fontWeight: "500",
    fontSize: 16,
  },
  modalCancelBtn: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#ffeaea",
    width: "100%",
    alignItems: "center",
  },
  modalCancelText: {
    color: "#e74c3c",
    fontWeight: "bold",
    fontSize: 15,
  },
});
