import { StyleSheet, Text, TouchableOpacity, View, Modal, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useTheme } from "../contexts/ThemeContext";

const DeletePlaylistModal = ({
  showDeleteModal,
  playlistToDelete,
  handleDeletePlaylist,
  setShowDeleteModal,
}) => {
  const { theme } = useTheme();

  return (
    <Modal
      transparent
      visible={showDeleteModal}
      animationType="fade"
      onRequestClose={() => setShowDeleteModal(false)}
    >
      <Pressable
        style={[
          styles.modalOverlay,
          { backgroundColor: theme.colors.background + "E6" } // 90% opacity
        ]}
        onPress={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalContainer}>
          {/* Modern glassmorphism card */}
          <BlurView intensity={80} tint="dark" style={styles.blurCard}>
            <LinearGradient
              colors={[
                theme.colors.surface + "E6", // 90% opacity
                theme.colors.surface + "CC", // 80% opacity
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.modalCard,
                {
                  borderColor: theme.colors.border,
                  shadowColor: theme.colors.shadowColor,
                }
              ]}
            >
              {/* Animated warning icon */}
              <View style={[
                styles.iconContainer,
                { backgroundColor: theme.colors.errorColor + "1A" } // 10% opacity
              ]}>
                <LinearGradient
                  colors={[theme.colors.errorColor + "40", theme.colors.errorColor + "20"]} // 25%, 12% opacity
                  style={styles.iconGradient}
                >
                  <Ionicons name="warning" size={36} color={theme.colors.errorColor} />
                </LinearGradient>
              </View>

              {/* Content */}
              <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
                Delete Playlist?
              </Text>

              <Text style={[styles.modalText, { color: theme.colors.textSecondary }]}>
                Are you sure you want to delete{" "}
                <Text style={[styles.playlistName, { color: theme.colors.textPrimary }]}>
                  "{playlistToDelete}"
                </Text>
                ? This action cannot be undone.
              </Text>

              {/* Action buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.cancelButton,
                    { backgroundColor: theme.colors.glassBackground }
                  ]}
                  onPress={() => setShowDeleteModal(false)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.cancelText, { color: theme.colors.textSecondary }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.deleteButton,
                    {
                      shadowColor: theme.colors.errorColor,
                    }
                  ]}
                  onPress={handleDeletePlaylist}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[theme.colors.errorColor, theme.colors.errorColor + "CC"]} // 100%, 80% opacity
                    style={styles.deleteGradient}
                  >
                    <Ionicons name="trash" size={18} color={theme.colors.textPrimary} style={styles.deleteIcon} />
                    <Text style={[styles.deleteText, { color: theme.colors.textPrimary }]}>
                      Delete
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </BlurView>
        </View>
      </Pressable>
    </Modal>
  );
};

export default DeletePlaylistModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "88%",
    maxWidth: 360,
  },
  blurCard: {
    borderRadius: 24,
    overflow: "hidden",
  },
  modalCard: {
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 15,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  iconGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  modalText: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  playlistName: {
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    fontWeight: "600",
    fontSize: 16,
  },
  deleteButton: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  deleteGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  deleteIcon: {
    marginRight: 8,
  },
  deleteText: {
    fontWeight: "600",
    fontSize: 16,
  },
});
