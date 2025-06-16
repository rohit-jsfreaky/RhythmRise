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
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../contexts/ThemeContext";
import { addToPlayList } from "../utils/playlist";

const PlayListModal = ({
  showModal,
  setShowModal,
  setSelectedSong,
  selectedSong,
}) => {
  const [playlists, setPlaylists] = useState([]);
  const { theme } = useTheme();

  const handleAddToPlaylist = async (playlistTitle) => {
    await addToPlayList(
      playlistTitle,
      selectedSong,
      setShowModal,
      setSelectedSong
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
        style={[
          styles.modalOverlay,
          { backgroundColor: theme.colors.background + "D9" }, // 85% opacity
        ]}
        onPress={() => setShowModal(false)}
      >
        <View
          style={[styles.modalCard, { backgroundColor: theme.colors.surface }]}
        >
          <View style={styles.modalHeader}>
            {selectedSong?.thumbnail && (
              <Image
                source={{ uri: selectedSong.thumbnail }}
                style={[
                  styles.songThumbnail,
                  { backgroundColor: theme.colors.secondary + "30" },
                ]}
              />
            )}
            <View style={styles.modalHeaderText}>
              <Text
                style={[styles.modalTitle, { color: theme.colors.textPrimary }]}
              >
                Add to Playlist
              </Text>
              <Text
                style={[
                  styles.songTitle,
                  { color: theme.colors.textSecondary },
                ]}
                numberOfLines={1}
              >
                {selectedSong?.title}
              </Text>
            </View>
          </View>

          <View
            style={[styles.divider, { backgroundColor: theme.colors.border }]}
          />

          {playlists.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="musical-notes"
                size={36}
                color={theme.colors.textSecondary}
              />
              <Text
                style={[
                  styles.modalEmpty,
                  { color: theme.colors.textSecondary },
                ]}
              >
                No playlists found.
              </Text>
              <Text
                style={[
                  styles.emptySubtext,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Create a playlist in the Library tab
              </Text>
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
                    colors={[theme.colors.accent, theme.colors.primary + "80"]} // 50% opacity
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.playlistIconBg}
                  >
                    <Ionicons
                      name="musical-notes"
                      size={20}
                      color={theme.colors.textPrimary}
                    />
                  </LinearGradient>
                  <Text
                    style={[
                      styles.modalPlaylistText,
                      { color: theme.colors.textPrimary },
                    ]}
                  >
                    {pl.title}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity
            onPress={() => setShowModal(false)}
            style={[
              styles.modalCancelBtn,
              { backgroundColor: theme.colors.accent },
            ]}
          >
            <Text
              style={[
                styles.modalCancelText,
                { color: theme.colors.textPrimary },
              ]}
            >
              Cancel
            </Text>
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
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    borderRadius: 20,
    width: "85%",
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
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
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
    marginBottom: 4,
  },
  songTitle: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    width: "100%",
    marginBottom: 16,
  },
  emptyState: {
    padding: 24,
    alignItems: "center",
  },
  modalEmpty: {
    fontSize: 15,
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    opacity: 0.7,
  },
  playlistsContainer: {
    width: "100%",
    paddingHorizontal: 12,
    maxHeight: 300,
  },
  modalPlaylistBtn: {
    flexDirection: "row",
    alignItems: "center",
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
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  modalPlaylistText: {
    flex: 1,
    fontWeight: "500",
    fontSize: 15,
  },
  modalCancelBtn: {
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    width: "85%",
    alignItems: "center",
  },
  modalCancelText: {
    fontWeight: "600",
    fontSize: 15,
  },
});
