import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const RemovePlaylistModal = ({
  showRemoveModal,
  setShowRemoveModal,
  theme,
  track,
  confirmRemoveFromPlaylist,
}) => {
  if (!track) return null;
  return (
    <Modal
      transparent
      visible={showRemoveModal}
      onRequestClose={() => setShowRemoveModal(false)}
    >
      <Pressable
        style={[
          styles.modalOverlay,
          { backgroundColor: theme.colors.background + "D9" },
        ]}
        onPress={() => setShowRemoveModal(false)}
      >
        <View
          style={[
            styles.confirmModal,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <View
            style={[
              styles.confirmIconContainer,
              { backgroundColor: theme.colors.errorColor + "1A" },
            ]}
          >
            <Ionicons
              name="warning"
              size={32}
              color={theme.colors.errorColor}
            />
          </View>
          <Text
            style={[styles.confirmTitle, { color: theme.colors.textPrimary }]}
          >
            Remove from Playlist?
          </Text>
          <Text
            style={[
              styles.confirmMessage,
              { color: theme.colors.textSecondary },
            ]}
          >
            This will remove "{track.title}" from all playlists containing it.
          </Text>

          <View style={styles.confirmButtons}>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                styles.cancelButton,
                { backgroundColor: theme.colors.textSecondary + "1A" },
              ]}
              onPress={() => setShowRemoveModal(false)}
            >
              <Text
                style={[
                  styles.cancelButtonText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.confirmButton,
                styles.removeButton,
                { backgroundColor: theme.colors.errorColor },
              ]}
              onPress={confirmRemoveFromPlaylist}
            >
              <Text
                style={[
                  styles.removeButtonText,
                  { color: theme.colors.textPrimary },
                ]}
              >
                Remove
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default RemovePlaylistModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmModal: {
    borderRadius: 20,
    width: "85%",
    maxWidth: 340,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  confirmIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  confirmMessage: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  confirmButtons: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    marginRight: 8,
  },
  removeButton: {
    marginLeft: 8,
  },
  cancelButtonText: {
    fontWeight: "600",
    fontSize: 15,
  },
  removeButtonText: {
    fontWeight: "600",
    fontSize: 15,
  },
});