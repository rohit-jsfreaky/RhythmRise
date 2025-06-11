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
import NoTrackPlayer from "../../Components/NoTrackPlayer";

const { width } = Dimensions.get("window");
const ARTWORK_SIZE = width * 0.75;

const PlayerScreen = () => {
  const { position, duration } = useProgress();
  const track = useActiveTrack();
  const playbackState = usePlaybackState();
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off"); // "off" | "track" | "queue"
  const [isPreparing, setIsPreparing] = useState(false);
  const { state } = playbackState;

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

  if (!track) {
    return <NoTrackPlayer />;
  }

  return (
    <LinearGradient
      colors={["rgba(123, 77, 255, 0.15)", "#080B38"]}
      style={styles.container}
    >
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="chevron-down" size={28} color="#F8F9FE" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Now Playing</Text>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="#F8F9FE" />
          </TouchableOpacity>
        </View>

        <View style={styles.artworkContainer}>
          <View style={styles.artworkShadow}>
            <Image source={{ uri: track.artwork }} style={styles.artwork} />
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {track.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
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
            minimumTrackTintColor="#7B4DFF"
            maximumTrackTintColor="rgba(248, 249, 254, 0.2)"
            thumbTintColor="#18B5FF"
          />

          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
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
              color={isShuffling ? "#18B5FF" : "rgba(248, 249, 254, 0.5)"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={skipToPrevious}
            activeOpacity={0.7}
          >
            <Ionicons name="play-skip-back" size={28} color="#F8F9FE" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playButton}
            onPress={togglePlayback}
            disabled={isPreparing}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#18B5FF", "#7B4DFF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.playButtonGradient}
            >
              {isPreparing ? (
                <ActivityIndicator color="#fff" size={32} />
              ) : (
                <Ionicons
                  name={isPlaying ? "pause" : "play"}
                  size={36}
                  color="#F8F9FE"
                />
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={skipToNext}
            activeOpacity={0.7}
          >
            <Ionicons name="play-skip-forward" size={28} color="#F8F9FE" />
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
                repeatMode !== "off" ? "#18B5FF" : "rgba(248, 249, 254, 0.5)"
              }
            />
          </TouchableOpacity>
        </View>

        <View style={styles.additionalControls}>
          <TouchableOpacity style={styles.additionalButton}>
            <Ionicons
              name="heart-outline"
              size={22}
              color="rgba(248, 249, 254, 0.7)"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.additionalButton}>
            <Ionicons name="list" size={22} color="rgba(248, 249, 254, 0.7)" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080B38",
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
    color: "#F8F9FE",
    letterSpacing: 0.3,
  },
  artworkContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  artworkShadow: {
    shadowColor: "#7B4DFF",
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
    backgroundColor: "#36195B",
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#F8F9FE",
    textAlign: "center",
    marginBottom: 8,
  },
  artist: {
    fontSize: 16,
    color: "#A0A6B1",
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
    color: "#A0A6B1",
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
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#7B4DFF",
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
