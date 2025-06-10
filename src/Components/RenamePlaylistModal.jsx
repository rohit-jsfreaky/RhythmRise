import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import React from "react";

const RenamePlaylistModal = ({
  showRenameModal,
  renameValue,
  setRenameValue,
  playlists,
  playlistToDelete,
  setPlaylists,
  setShowRenameModal,
  setPlaylistToDelete,
}) => {
  return (
    showRenameModal && (
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Rename Playlist</Text>
          <TextInput
            style={[styles.input, { marginBottom: 16, width: "100%" }]}
            value={renameValue}
            onChangeText={setRenameValue}
            placeholder="New playlist name"
          />
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: "#1DB954" }]}
              onPress={async () => {
                if (!renameValue.trim()) return;
                const updated = playlists.map((pl) =>
                  pl.title === playlistToDelete
                    ? { ...pl, title: renameValue }
                    : pl
                );
                setPlaylists(updated);
                await SecureStore.setItemAsync(
                  "playlists",
                  JSON.stringify(updated)
                );
                setShowRenameModal(false);
                setPlaylistToDelete(null);
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Rename</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalBtn,
                { backgroundColor: "#eee", marginLeft: 10 },
              ]}
              onPress={() => setShowRenameModal(false)}
            >
              <Text style={{ color: "#222", fontWeight: "bold" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  );
};

export default RenamePlaylistModal;

const styles = StyleSheet.create({
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#f7f7f7",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#222",
  },
  modalText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  modalBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
