import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Slider from "@react-native-community/slider";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import NoTrackPlayer from "../../Components/NoTrackPlayer";
import PlayListModal from "../../Components/PlayListModal";
import PlayerMenu from "../../Components/PlayerMenu";
import RemovePlaylistModal from "../../Components/RemovePlaylistModal";
import QueueActionSheet from "../../Components/QueueActionSheet";
import { useplayer } from "./usePlayer";

const { width } = Dimensions.get("window");
const ARTWORK_SIZE = width * 0.75;

const PlayerScreen = () => {
  const {
    position,
    duration,
    track,
    playbackState: state,
    isShuffling,
    setIsShuffling,
    repeatMode,
    setRepeatMode,
    isPreparing,
    setIsPreparing,
    showMenu,
    setShowMenu,
    showPlaylistModal,
    setShowPlaylistModal,
    showRemoveModal,
    setShowRemoveModal,
    trackInPlaylists,
    setTrackInPlaylists,
    selectedSong,
    setSelectedSong,
    queue,
    setQueue,
    currentTrackIndex,
    setCurrentTrackIndex,
    actionSheetRef,
    navigation,
    theme,
    checkTrackInPlaylists,
    togglePlayback,
    skipToNext,
    skipToPrevious,
    toggleShuffle,
    toggleRepeat,
    openMenu,
    closeMenu,
    handleListPress,
    handleQueueItemPress,
    handleRemoveFromQueue,
    handleAddToPlaylist,
    handleRemoveFromPlaylist,
    confirmRemoveFromPlaylist,
    formatTime,
    isPlaying
  } = useplayer();

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
            <RemovePlaylistModal
              confirmRemoveFromPlaylist={confirmRemoveFromPlaylist}
              showRemoveModal={showRemoveModal}
              setShowRemoveModal={setShowRemoveModal}
              theme={theme}
            />
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
      <QueueActionSheet
        ref={actionSheetRef}
        queue={queue}
        currentTrackIndex={currentTrackIndex}
        onClose={() => actionSheetRef.current?.hide()}
        handleQueueItemPress={handleQueueItemPress}
        handleRemoveFromQueue={handleRemoveFromQueue}
        theme={theme}
      />
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
});

export default PlayerScreen;
