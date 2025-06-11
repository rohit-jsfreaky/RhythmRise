import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

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
          <View style={styles.iconContainer}>
            <Ionicons name="trash" size={32} color="#e74c3c" />
          </View>

          <Text style={styles.modalTitle}>Delete Playlist?</Text>

          <Text style={styles.modalText}>
            Are you sure you want to delete "{playlistToDelete}"? This cannot be
            undone.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowDeleteModal(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeletePlaylist}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#e74c3c", "#c0392b"]}
                style={styles.deleteGradient}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </LinearGradient>
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
    backgroundColor: "rgba(231, 76, 60, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#F8F9FE",
  },
  modalText: {
    fontSize: 15,
    color: "#A0A6B1",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
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
  deleteButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  deleteGradient: {
    padding: 14,
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
