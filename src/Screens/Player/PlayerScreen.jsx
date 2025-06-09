import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import TrackPlayer, {
  useProgress,
  useActiveTrack,
  usePlaybackState,
} from "react-native-track-player";
import Slider from "@react-native-community/slider";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const PlayerScreen = () => {
  const { position, duration } = useProgress();
  const track = useActiveTrack();
  const playbackState = usePlaybackState();
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off"); // "off" | "track" | "queue"
  const [isPreparing, setIsPreparing] = useState(false);
  const {state} = playbackState

  // Detect loading state
  useEffect(() => {
    if (state === "loading" || state === "buffering" || state === "connecting") {
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
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const skipToNext = async () => {
    try {
      await TrackPlayer.skipToNext();
    } catch {}
  };

  const skipToPrevious = async () => {
    try {
      await TrackPlayer.skipToPrevious();
    } catch {}
  };

  const toggleShuffle = () => {
    setIsShuffling((prev) => !prev);
  };

  const toggleRepeat = () => {
    setRepeatMode((prev) =>
      prev === "off" ? "track" : prev === "track" ? "queue" : "off"
    );
  };

  if (!track) {
    return (
      <View style={styles.container}>
        <View style={styles.artworkShadow}>
          <View style={[styles.artwork, { alignItems: "center", justifyContent: "center" }]}>
            <Text style={{ color: "#888", fontSize: 18, fontWeight: "bold" }}>Play any song</Text>
          </View>
        </View>
        <View style={styles.infoContainer}>
          <View style={[styles.skeletonTitle, styles.skeleton]} />
          <View style={[styles.skeletonArtist, styles.skeleton]} />
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={0}
          disabled
          minimumTrackTintColor="#e0e0e0"
          maximumTrackTintColor="#e0e0e0"
          thumbTintColor="#e0e0e0"
        />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>0:00</Text>
          <Text style={styles.timeText}>0:00</Text>
        </View>
        <View style={styles.controlsRow}>
          <View style={[styles.skeletonControl, styles.skeleton]} />
          <View style={[styles.skeletonControl, styles.skeleton]} />
          <View style={[styles.skeletonPlay, styles.skeleton]} />
          <View style={[styles.skeletonControl, styles.skeleton]} />
          <View style={[styles.skeletonControl, styles.skeleton]} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.artworkShadow}>
        <Image source={{ uri: track.artwork }} style={styles.artwork} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {track.title}
        </Text>
        <Text style={styles.artist}>{track.artist}</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration > 0 ? duration : 0.001}
        value={position}
        onSlidingComplete={async (value) => await TrackPlayer.seekTo(value)}
        minimumTrackTintColor="#1DB954"
        maximumTrackTintColor="#D3D3D3"
        thumbTintColor="#1DB954"
      />
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>
      <View style={styles.controlsRow}>
        <TouchableOpacity onPress={toggleShuffle}>
          <MaterialIcons
            name="shuffle"
            size={28}
            color={isShuffling ? "#1DB954" : "#888"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={skipToPrevious}>
          <Ionicons name="play-skip-back" size={32} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.playButton} onPress={togglePlayback} disabled={isPreparing}>
          {isPreparing ? (
            <ActivityIndicator color="#fff" size={32} />
          ) : (
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={40}
              color="#fff"
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={skipToNext}>
          <Ionicons name="play-skip-forward" size={32} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleRepeat}>
          <MaterialIcons
            name={
              repeatMode === "off"
                ? "repeat"
                : repeatMode === "track"
                ? "repeat-one"
                : "repeat"
            }
            size={28}
            color={repeatMode !== "off" ? "#1DB954" : "#888"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  artworkShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderRadius: 24,
    backgroundColor: "#fff",
    marginTop: 40,
    marginBottom: 24,
  },
  artwork: {
    width: 300,
    height: 300,
    borderRadius: 24,
    backgroundColor: "#eee",
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
  },
  artist: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  slider: {
    width: "100%",
    height: 40,
    marginTop: 8,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 8,
    marginTop: -10,
  },
  timeText: {
    fontSize: 12,
    color: "#666",
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 30,
  },
  playButton: {
    backgroundColor: "#1DB954",
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    shadowColor: "#1DB954",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  skeleton: {
    backgroundColor: "#e0e0e0",
  },
  skeletonTitle: {
    width: 180,
    height: 22,
    borderRadius: 6,
    marginBottom: 10,
  },
  skeletonArtist: {
    width: 100,
    height: 16,
    borderRadius: 6,
  },
  skeletonControl: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  skeletonPlay: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginHorizontal: 20,
  },
});

export default PlayerScreen;
