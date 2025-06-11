import React, { useState, useEffect, useRef } from "react";
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
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import TrackPlayer, {
  useProgress,
  useActiveTrack,
  usePlaybackState,
  Event,
} from "react-native-track-player";
import Slider from "@react-native-community/slider";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";
import * as SecureStore from "expo-secure-store";
import ActionSheet from "react-native-actions-sheet";
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
  const [queue, setQueue] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const { state } = playbackState;
  const navigation = useNavigation();
  const { theme } = useTheme();

  // ActionSheet ref
  const actionSheetRef = useRef(null);

  // Load queue when component mounts and when track changes
  useEffect(() => {
    loadQueue();
    getCurrentTrackIndex();
  }, [track]);

  // Listen for queue updates
  useEffect(() => {
    const subscription = TrackPlayer.addEventListener(
      Event.PlaybackQueueEnded,
      () => {
        loadQueue();
      }
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  const loadQueue = async () => {
    try {
      const tracks = await TrackPlayer.getQueue();
      setQueue(tracks);
    } catch (error) {
      console.log("Error loading queue:", error);
      setQueue([]);
    }
  };

  const getCurrentTrackIndex = async () => {
    try {
      const index = await TrackPlayer.getActiveTrackIndex();
      setCurrentTrackIndex(index ?? 0);
    } catch (error) {
      console.log("Error getting current track index:", error);
      setCurrentTrackIndex(0);
    }
  };

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
      await getCurrentTrackIndex();
    } catch {}
  };

  const skipToPrevious = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await TrackPlayer.skipToPrevious();
      await getCurrentTrackIndex();
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

  // Handle Queue/List button press
  const handleListPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    loadQueue(); // Refresh queue before showing
    actionSheetRef.current?.show();
  };

  // Handle queue item press
  const handleQueueItemPress = async (item, index) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await TrackPlayer.skip(index);
      await TrackPlayer.play();
      await getCurrentTrackIndex();
      actionSheetRef.current?.hide();
    } catch (error) {
      console.log("Error playing queue item:", error);
    }
  };

  // Remove item from queue
  const handleRemoveFromQueue = async (index) => {
    try {
      if (queue.length <= 1) {
        // Don't remove if it's the last song
        return;
      }

      await TrackPlayer.remove(index);
      await loadQueue();
      await getCurrentTrackIndex();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.log("Error removing from queue:", error);
    }
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

  // Queue Item Component
  const QueueItem = ({ item, index, isCurrentTrack }) => (
    <TouchableOpacity
      style={[
        styles.queueItem,
        isCurrentTrack && {
          backgroundColor: theme.colors.primary + "20",
          borderColor: theme.colors.primary + "40",
          borderWidth: 1,
        },
      ]}
      onPress={() => handleQueueItemPress(item, index)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.artwork }}
        style={[
          styles.queueItemImage,
          { backgroundColor: theme.colors.accent + "40" },
        ]}
      />

      <View style={styles.queueItemInfo}>
        <Text
          style={[
            styles.queueItemTitle,
            {
              color: isCurrentTrack
                ? theme.colors.textPrimary
                : theme.colors.textPrimary,
            },
          ]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text
          style={[
            styles.queueItemArtist,
            { color: theme.colors.textSecondary },
          ]}
          numberOfLines={1}
        >
          {item.artist}
        </Text>
      </View>

      <View style={styles.queueItemActions}>
        {isCurrentTrack && (
          <View
            style={[
              styles.nowPlayingIndicator,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            <Ionicons name="musical-note" size={12} color="#FFFFFF" />
          </View>
        )}

        {queue.length > 1 && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveFromQueue(index)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="close"
              size={18}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  if (!track) {
    return <NoTrackPlayer />;
  }

  return (
    <>
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
              <Ionicons
                name="arrow-back"
                size={28}
                color={theme.colors.textPrimary}
              />
            </TouchableOpacity>
            <Text
              style={[styles.headerTitle, { color: theme.colors.textPrimary }]}
            >
              Now Playing
            </Text>
            <View style={styles.menuWrapper}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={showMenu ? closeMenu : openMenu}
              >
                <Ionicons
                  name="ellipsis-vertical"
                  size={24}
                  color={theme.colors.textPrimary}
                />
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
            <View
              style={[
                styles.artworkShadow,
                { shadowColor: theme.colors.shadowColor },
              ]}
            >
              <Image
                source={{ uri: track.artwork }}
                style={[
                  styles.artwork,
                  { backgroundColor: theme.colors.accent },
                ]}
              />
            </View>
          </View>

          <View style={styles.infoContainer}>
            <Text
              style={[styles.title, { color: theme.colors.textPrimary }]}
              numberOfLines={1}
            >
              {track.title}
            </Text>
            <Text
              style={[styles.artist, { color: theme.colors.textSecondary }]}
              numberOfLines={1}
            >
              {track.artist}
            </Text>
          </View>

          <View style={styles.progressContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={duration > 0 ? duration : 0.001}
              value={position}
              onSlidingComplete={async (value) =>
                await TrackPlayer.seekTo(value)
              }
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.textPrimary + "33"}
              thumbTintColor={theme.colors.secondary}
            />

            <View style={styles.timeContainer}>
              <Text
                style={[styles.timeText, { color: theme.colors.textSecondary }]}
              >
                {formatTime(position)}
              </Text>
              <Text
                style={[styles.timeText, { color: theme.colors.textSecondary }]}
              >
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
                color={
                  isShuffling
                    ? theme.colors.secondary
                    : theme.colors.textPrimary + "80"
                }
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.secondaryButton,
                { backgroundColor: theme.colors.glassBackground },
              ]}
              onPress={skipToPrevious}
              activeOpacity={0.7}
            >
              <Ionicons
                name="play-skip-back"
                size={28}
                color={theme.colors.textPrimary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.playButton,
                {
                  shadowColor: theme.colors.shadowColor,
                },
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
                  <ActivityIndicator
                    color={theme.colors.textPrimary}
                    size={32}
                  />
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
              style={[
                styles.secondaryButton,
                { backgroundColor: theme.colors.glassBackground },
              ]}
              onPress={skipToNext}
              activeOpacity={0.7}
            >
              <Ionicons
                name="play-skip-forward"
                size={28}
                color={theme.colors.textPrimary}
              />
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
                  repeatMode !== "off"
                    ? theme.colors.secondary
                    : theme.colors.textPrimary + "80"
                }
              />
            </TouchableOpacity>
          </View>

          <View style={styles.additionalControls}>
            <TouchableOpacity style={styles.additionalButton}>
              <Ionicons
                name="heart-outline"
                size={22}
                color={theme.colors.textPrimary + "B3"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.additionalButton}
              onPress={handleListPress}
            >
              <Ionicons
                name="list"
                size={22}
                color={theme.colors.textPrimary + "B3"}
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
                    style={[
                      styles.confirmTitle,
                      { color: theme.colors.textPrimary },
                    ]}
                  >
                    Remove from Playlist?
                  </Text>
                  <Text
                    style={[
                      styles.confirmMessage,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    This will remove "{track.title}" from all playlists
                    containing it.
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

      {/* Action Sheet with Queue */}
      <ActionSheet
        ref={actionSheetRef}
        containerStyle={{
          backgroundColor: theme.colors.surface,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
        indicatorStyle={{
          backgroundColor: theme.colors.textSecondary,
          width: 40,
          height: 4,
        }}
        gestureEnabled={true}
        statusBarTranslucent
        drawUnderStatusbar={false}
        defaultOverlayOpacity={0.3}
      >
        <View
          style={[
            styles.actionSheetContent,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          {/* Action Sheet Header */}
          <View
            style={[
              styles.actionSheetHeader,
              { borderBottomColor: theme.colors.border },
            ]}
          >
            <View>
              <Text
                style={[
                  styles.actionSheetTitle,
                  { color: theme.colors.textPrimary },
                ]}
              >
                Queue
              </Text>
              <Text
                style={[
                  styles.actionSheetSubtitle,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {queue.length} {queue.length === 1 ? "song" : "songs"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => actionSheetRef.current?.hide()}
              style={[
                styles.actionSheetCloseButton,
                { backgroundColor: theme.colors.glassBackground },
              ]}
            >
              <Ionicons
                name="close"
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Queue List */}
          <View style={styles.actionSheetBody}>
            {queue.length === 0 ? (
              <View
                style={[
                  styles.emptyStateContainer,
                  { backgroundColor: theme.colors.glassBackground },
                ]}
              >
                <Ionicons
                  name="musical-notes"
                  size={48}
                  color={theme.colors.textSecondary}
                />
                <Text
                  style={[
                    styles.emptyStateTitle,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  Queue is Empty
                </Text>
                <Text
                  style={[
                    styles.emptyStateSubtitle,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Add songs to see them here
                </Text>
              </View>
            ) : (
              <FlatList
                data={queue}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={({ item, index }) => (
                  <QueueItem
                    item={item}
                    index={index}
                    isCurrentTrack={index === currentTrackIndex}
                  />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.queueList}
              />
            )}
          </View>
        </View>
      </ActionSheet>
    </>
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
  // Action Sheet Styles
  actionSheetContent: {
    minHeight: 400,
    maxHeight: "80%",
  },
  actionSheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  actionSheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  actionSheetSubtitle: {
    fontSize: 13,
    opacity: 0.8,
  },
  actionSheetCloseButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  actionSheetBody: {
    flex: 1,
  },
  queueList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  queueItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
    marginTop: 4,
  },
  queueItemImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  queueItemInfo: {
    flex: 1,
    marginRight: 12,
  },
  queueItemTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  queueItemArtist: {
    fontSize: 13,
    opacity: 0.8,
  },
  queueItemActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  nowPlayingIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  removeButton: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    padding: 40,
    margin: 20,
    minHeight: 200,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.7,
  },
});

export default PlayerScreen;
