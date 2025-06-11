import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StatusBar as RNStatusBar,
  Modal,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import TrackPlayer, {
  useProgress,
  useActiveTrack,
  usePlaybackState,
} from "react-native-track-player";
import Slider from "@react-native-community/slider";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";
import * as SecureStore from "expo-secure-store";
import NoTrackPlayer from "../../Components/NoTrackPlayer";
import PlayListModal from "../../Components/PlayListModal";
import PlayerMenu from "../../Components/PlayerMenu";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../contexts/ThemeContext";

const { width } = Dimensions.get("window");
const ARTWORK_SIZE = width * 0.75;

const PlayerScreen = () => {
  const { position, duration } = useProgress();
  const track = useActiveTrack();
  const playbackState = usePlaybackState();
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off");
  const [isPreparing, setIsPreparing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [trackInPlaylists, setTrackInPlaylists] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const { state } = playbackState;
  const navigation = useNavigation();
  const { theme } = useTheme();

  // Check if current track is in any playlists
  const checkTrackInPlaylists = async () => {
    if (!track) return;

    try {
      const stored = await SecureStore.getItemAsync("playlists");
      if (stored) {
        const playlists = JSON.parse(stored);
        const playlistsWithTrack = playlists.filter((playlist) =>
          playlist.songs.some((song) => song.url === track.id)
        );
        setTrackInPlaylists(playlistsWithTrack);
      }
    } catch (error) {
      console.log("Error checking playlists:", error);
    }
  };

  useEffect(() => {
    checkTrackInPlaylists();
  }, [track]);

  // Detect loading state
  useEffect(() => {
    if (
      state === "loading" ||
      state === "buffering" ||
      state === "connecting"
    ) {
      setIsPreparing(true);
    } else {
      setIsPreparing(false);
    }
  }, [state]);

  const isPlaying = state === "playing";

  const formatTime = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  const togglePlayback = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const skipToNext = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await TrackPlayer.skipToNext();
    } catch {}
  };

  const skipToPrevious = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await TrackPlayer.skipToPrevious();
    } catch {}
  };

  const toggleShuffle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsShuffling((prev) => !prev);
  };

  const toggleRepeat = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRepeatMode((prev) =>
      prev === "off" ? "track" : prev === "track" ? "queue" : "off"
    );
  };

  const openMenu = () => {
    setShowMenu(true);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  const handleAddToPlaylist = () => {
    closeMenu();
    setSelectedSong({
      title: track.title,
      artist: track.artist,
      thumbnail: track.artwork,
      url: track.id,
      duration: formatTime(duration),
      uploader: track.artist,
    });
    setShowPlaylistModal(true);
  };

  const handleRemoveFromPlaylist = () => {
    closeMenu();
    setShowRemoveModal(true);
  };

  const confirmRemoveFromPlaylist = async () => {
    try {
      const stored = await SecureStore.getItemAsync("playlists");
      let playlistsArr = stored ? JSON.parse(stored) : [];

      // Remove track from all playlists
      playlistsArr = playlistsArr.map((playlist) => ({
        ...playlist,
        songs: playlist.songs.filter((song) => song.url !== track.id),
      }));

      await SecureStore.setItemAsync("playlists", JSON.stringify(playlistsArr));
      setShowRemoveModal(false);
      checkTrackInPlaylists(); // Refresh the playlist status

      // Show success message (you can use ToastAndroid on Android)
      console.log("Removed from all playlists");
    } catch (error) {
      console.log("Error removing from playlists:", error);
    }
  };

  if (!track) {
    return <NoTrackPlayer />;
  }

  return (
    <LinearGradient
      colors={theme.colors.gradient}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            style={styles.headerButton}
          >
            <Ionicons name="arrow-back" size={28} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
            Now Playing
          </Text>
          <View style={styles.menuWrapper}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={showMenu ? closeMenu : openMenu}
            >
              <Ionicons name="ellipsis-vertical" size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>

            {/* Player Menu Component */}
            <PlayerMenu
              showMenu={showMenu}
              closeMenu={closeMenu}
              trackInPlaylists={trackInPlaylists}
              handleAddToPlaylist={handleAddToPlaylist}
              handleRemoveFromPlaylist={handleRemoveFromPlaylist}
            />
          </View>
        </View>

        <View style={styles.artworkContainer}>
          <View style={[styles.artworkShadow, { shadowColor: theme.colors.shadowColor }]}>
            <Image 
              source={{ uri: track.artwork }} 
              style={[styles.artwork, { backgroundColor: theme.colors.accent }]} 
            />
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]} numberOfLines={1}>
            {track.title}
          </Text>
          <Text style={[styles.artist, { color: theme.colors.textSecondary }]} numberOfLines={1}>
            {track.artist}
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration > 0 ? duration : 0.001}
            value={position}
            onSlidingComplete={async (value) => await TrackPlayer.seekTo(value)}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.textPrimary + "33"} // 20% opacity
            thumbTintColor={theme.colors.secondary}
          />

          <View style={styles.timeContainer}>
            <Text style={[styles.timeText, { color: theme.colors.textSecondary }]}>
              {formatTime(position)}
            </Text>
            <Text style={[styles.timeText, { color: theme.colors.textSecondary }]}>
              {formatTime(duration)}
            </Text>
          </View>
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={styles.sideButton}
            onPress={toggleShuffle}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="shuffle"
              size={28}
              color={isShuffling ? theme.colors.secondary : theme.colors.textPrimary + "80"} // 50% opacity
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: theme.colors.glassBackground }]}
            onPress={skipToPrevious}
            activeOpacity={0.7}
          >
            <Ionicons name="play-skip-back" size={28} color={theme.colors.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.playButton,
              {
                shadowColor: theme.colors.shadowColor,
              }
            ]}
            onPress={togglePlayback}
            disabled={isPreparing}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={theme.colors.activeGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.playButtonGradient}
            >
              {isPreparing ? (
                <ActivityIndicator color={theme.colors.textPrimary} size={32} />
              ) : (
                <Ionicons
                  name={isPlaying ? "pause" : "play"}
                  size={36}
                  color={theme.colors.textPrimary}
                />
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: theme.colors.glassBackground }]}
            onPress={skipToNext}
            activeOpacity={0.7}
          >
            <Ionicons name="play-skip-forward" size={28} color={theme.colors.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sideButton}
            onPress={toggleRepeat}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={
                repeatMode === "off"
                  ? "repeat"
                  : repeatMode === "track"
                  ? "repeat-one"
                  : "repeat"
              }
              size={28}
              color={
                repeatMode !== "off" ? theme.colors.secondary : theme.colors.textPrimary + "80"
              }
            />
          </TouchableOpacity>
        </View>

        <View style={styles.additionalControls}>
          <TouchableOpacity style={styles.additionalButton}>
            <Ionicons
              name="heart-outline"
              size={22}
              color={theme.colors.textPrimary + "B3"} // 70% opacity
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.additionalButton}>
            <Ionicons 
              name="list" 
              size={22} 
              color={theme.colors.textPrimary + "B3"} // 70% opacity
            />
          </TouchableOpacity>
        </View>

        {/* Remove Confirmation Modal */}
        {showRemoveModal && (
          <Modal
            transparent
            visible={showRemoveModal}
            onRequestClose={() => setShowRemoveModal(false)}
          >
            <Pressable
              style={[
                styles.modalOverlay,
                { backgroundColor: theme.colors.background + "D9" } // 85% opacity
              ]}
              onPress={() => setShowRemoveModal(false)}
            >
              <View style={[styles.confirmModal, { backgroundColor: theme.colors.surface }]}>
                <View style={[
                  styles.confirmIconContainer,
                  { backgroundColor: theme.colors.errorColor + "1A" } // 10% opacity
                ]}>
                  <Ionicons name="warning" size={32} color={theme.colors.errorColor} />
                </View>
                <Text style={[styles.confirmTitle, { color: theme.colors.textPrimary }]}>
                  Remove from Playlist?
                </Text>
                <Text style={[styles.confirmMessage, { color: theme.colors.textSecondary }]}>
                  This will remove "{track.title}" from all playlists containing it.
                </Text>

                <View style={styles.confirmButtons}>
                  <TouchableOpacity
                    style={[
                      styles.confirmButton,
                      styles.cancelButton,
                      { backgroundColor: theme.colors.textSecondary + "1A" } // 10% opacity
                    ]}
                    onPress={() => setShowRemoveModal(false)}
                  >
                    <Text style={[styles.cancelButtonText, { color: theme.colors.textSecondary }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.confirmButton,
                      styles.removeButton,
                      { backgroundColor: theme.colors.errorColor }
                    ]}
                    onPress={confirmRemoveFromPlaylist}
                  >
                    <Text style={[styles.removeButtonText, { color: theme.colors.textPrimary }]}>
                      Remove
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Pressable>
          </Modal>
        )}

        {/* Playlist Modal */}
        {showPlaylistModal && (
          <PlayListModal
            selectedSong={selectedSong}
            setSelectedSong={setSelectedSong}
            setShowModal={setShowPlaylistModal}
            showModal={showPlaylistModal}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  menuWrapper: {
    position: "relative",
    zIndex: 1000,
  },
  artworkContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  artworkShadow: {
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    borderRadius: 24,
  },
  artwork: {
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
    borderRadius: 24,
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  artist: {
    fontSize: 16,
    textAlign: "center",
  },
  progressContainer: {
    width: "100%",
    marginBottom: 30,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: -10,
  },
  timeText: {
    fontSize: 12,
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30,
  },
  sideButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  playButtonGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  additionalControls: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  additionalButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 15,
  },
  // Confirmation Modal Styles
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

export default PlayerScreen;
