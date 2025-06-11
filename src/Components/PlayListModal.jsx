import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

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
          <View style={styles.modalHeader}>
            {selectedSong?.thumbnail && (
              <Image 
                source={{uri: selectedSong.thumbnail}} 
                style={styles.songThumbnail}
              />
            )}
            <View style={styles.modalHeaderText}>
              <Text style={styles.modalTitle}>Add to Playlist</Text>
              <Text style={styles.songTitle} numberOfLines={1}>
                {selectedSong?.title}
              </Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          {playlists.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="musical-notes" size={36} color="#A0A6B1" />
              <Text style={styles.modalEmpty}>No playlists found.</Text>
              <Text style={styles.emptySubtext}>Create a playlist in the Library tab</Text>
            </View>
          ) : (
            <View style={styles.playlistsContainer}>
              {playlists.map((pl) => (
                <TouchableOpacity
                  key={pl.title}
                  style={styles.modalPlaylistBtn}
                  onPress={() => handleAddToPlaylist(pl.title)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#36195B', '#522377']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.playlistIconBg}
                  >
                    <Ionicons name="musical-notes" size={20} color="#F8F9FE" />
                  </LinearGradient>
                  <Text style={styles.modalPlaylistText}>{pl.title}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#A0A6B1" />
                </TouchableOpacity>
              ))}
            </View>
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
    backgroundColor: "rgba(8, 11, 56, 0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#10133E",
    borderRadius: 20,
    width: '85%',
    maxWidth: 340,
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  songThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 16,
  },
  modalHeaderText: {
    flex: 1,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#F8F9FE",
    marginBottom: 4,
  },
  songTitle: {
    fontSize: 14,
    color: "#A0A6B1",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(160, 166, 177, 0.2)",
    width: '100%',
    marginBottom: 16,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  modalEmpty: {
    color: "#A0A6B1",
    fontSize: 15,
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    color: "#A0A6B1",
    fontSize: 13,
    opacity: 0.7,
  },
  playlistsContainer: {
    width: '100%',
    paddingHorizontal: 12,
    maxHeight: 300,
  },
  modalPlaylistBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    width: "100%",
  },
  playlistIconBg: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalPlaylistText: {
    flex: 1,
    color: "#F8F9FE",
    fontWeight: "500",
    fontSize: 15,
  },
  modalCancelBtn: {
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#36195B",
    width: "85%",
    alignItems: "center",
  },
  modalCancelText: {
    color: "#F8F9FE",
    fontWeight: "600",
    fontSize: 15,
  },
});
