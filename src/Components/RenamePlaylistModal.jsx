import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useTheme } from "../contexts/ThemeContext";

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
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleRename = async () => {
    if (!renameValue.trim()) return;

    const updated = playlists.map((pl) =>
      pl.title === playlistToDelete
        ? { ...pl, title: renameValue.trim() }
        : pl
    );

    setPlaylists(updated);
    await SecureStore.setItemAsync("playlists", JSON.stringify(updated));
    setShowRenameModal(false);
    setPlaylistToDelete(null);
  };

  return (
    <Modal
      transparent
      visible={showRenameModal}
      animationType="fade"
      onRequestClose={() => setShowRenameModal(false)}
    >
      <Pressable
        style={[
          styles.modalOverlay,
          { backgroundColor: theme.colors.background + "E6" }, // 90% opacity
        ]}
        onPress={() => setShowRenameModal(false)}
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
                },
              ]}
            >
              {/* Edit icon */}
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: theme.colors.primary + "1A" }, // 10% opacity
                ]}
              >
                <LinearGradient
                  colors={[
                    theme.colors.primary + "40",
                    theme.colors.secondary + "30", // 25%, 19% opacity
                  ]}
                  style={styles.iconGradient}
                >
                  <Ionicons
                    name="create"
                    size={32}
                    color={theme.colors.textPrimary}
                  />
                </LinearGradient>
              </View>

              {/* Content */}
              <Text
                style={[
                  styles.modalTitle,
                  { color: theme.colors.textPrimary },
                ]}
              >
                Rename Playlist
              </Text>

              <Text
                style={[
                  styles.modalSubtitle,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Enter a new name for your playlist
              </Text>

              {/* Modern input field */}
              <View
                style={[
                  styles.inputContainer,
                  {
                    borderColor: isFocused
                      ? theme.colors.primary
                      : theme.colors.border,
                    backgroundColor: theme.colors.glassBackground,
                  },
                ]}
              >
                <Ionicons
                  name="musical-notes"
                  size={20}
                  color={theme.colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.input,
                    { color: theme.colors.textPrimary },
                  ]}
                  value={renameValue}
                  onChangeText={setRenameValue}
                  placeholder="Enter playlist name"
                  placeholderTextColor={
                    theme.colors.textSecondary + "80" // 50% opacity
                  }
                  selectionColor={theme.colors.primary}
                  autoFocus
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onSubmitEditing={handleRename}
                  returnKeyType="done"
                />
                {renameValue.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setRenameValue("")}
                    style={styles.clearButton}
                  >
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color={theme.colors.textSecondary}
                    />
                  </TouchableOpacity>
                )}
              </View>

              {/* Character count */}
              <Text
                style={[
                  styles.characterCount,
                  {
                    color:
                      renameValue.length > 30
                        ? theme.colors.errorColor
                        : theme.colors.textSecondary + "80", // 50% opacity
                  },
                ]}
              >
                {renameValue.length}/30 characters
              </Text>

              {/* Action buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.cancelButton,
                    { backgroundColor: theme.colors.glassBackground },
                  ]}
                  onPress={() => setShowRenameModal(false)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.cancelText,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.renameButton,
                    {
                      shadowColor: theme.colors.primary,
                      opacity: renameValue.trim().length > 0 ? 1 : 0.5,
                    },
                  ]}
                  activeOpacity={0.8}
                  onPress={handleRename}
                  disabled={!renameValue.trim()}
                >
                  <LinearGradient
                    colors={theme.colors.activeGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.renameGradient}
                  >
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={theme.colors.textPrimary}
                      style={styles.renameIcon}
                    />
                    <Text
                      style={[
                        styles.renameText,
                        { color: theme.colors.textPrimary },
                      ]}
                    >
                      Rename
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

export default RenamePlaylistModal;

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
    marginBottom: 20,
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
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    opacity: 0.8,
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 8,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    fontWeight: "500",
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  characterCount: {
    fontSize: 12,
    alignSelf: "flex-end",
    marginBottom: 24,
    marginRight: 4,
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
  renameButton: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  renameGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  renameIcon: {
    marginRight: 8,
  },
  renameText: {
    fontWeight: "600",
    fontSize: 16,
  },
});
