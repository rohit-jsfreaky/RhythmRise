import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

const DeletePlaylistModal = ({
  showDeleteModal,
  playlistToDelete,
  handleDeletePlaylist,
  setShowDeleteModal,
}) => {
  return (
    showDeleteModal && (
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Delete Playlist?</Text>
          <Text style={styles.modalText}>
            Are you sure you want to delete "{playlistToDelete}"? This cannot be
            undone.
          </Text>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: "#e74c3c" }]}
              onPress={handleDeletePlaylist}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalBtn,
                { backgroundColor: "#eee", marginLeft: 10 },
              ]}
              onPress={() => setShowDeleteModal(false)}
            >
              <Text style={{ color: "#222", fontWeight: "bold" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  );
};

export default DeletePlaylistModal;

const styles = StyleSheet.create({
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
