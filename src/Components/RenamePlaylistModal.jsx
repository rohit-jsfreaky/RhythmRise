import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

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
          <View style={styles.iconContainer}>
            <Ionicons name="create" size={28} color="#7B4DFF" />
          </View>

          <Text style={styles.modalTitle}>Rename Playlist</Text>

          <TextInput
            style={styles.input}
            value={renameValue}
            onChangeText={setRenameValue}
            placeholder="New playlist name"
            placeholderTextColor="#A0A6B1"
            selectionColor="#7B4DFF"
            color="#F8F9FE"
            autoFocus
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowRenameModal(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.renameButton}
              activeOpacity={0.8}
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
              <LinearGradient
                colors={["#18B5FF", "#7B4DFF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.renameGradient}
              >
                <Text style={styles.renameText}>Rename</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  );
};

export default RenamePlaylistModal;

const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(8, 11, 56, 0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "85%",
    backgroundColor: "#10133E",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(123, 77, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#F8F9FE",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(248, 249, 254, 0.15)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    fontSize: 15,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
  },
  cancelText: {
    color: "#F8F9FE",
    fontWeight: "600",
    fontSize: 15,
  },
  renameButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  renameGradient: {
    padding: 14,
    alignItems: "center",
  },
  renameText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
