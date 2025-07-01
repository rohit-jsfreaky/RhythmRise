import React, { useState, useEffect, useRef } from "react";
import TrackPlayer, {
  useProgress,
  useActiveTrack,
  usePlaybackState,
  Event,
  RepeatMode,
} from "react-native-track-player";
import * as Haptics from "expo-haptics";
import * as SecureStore from "expo-secure-store";

import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "../../contexts/ThemeContext";
import { isFavorite, mmkvStorage, toggleFavorite } from "../../utils/Favorite";
import { useQueue } from "../../contexts/PlayerQueueContext";
import { apiBaseUrl } from "../../utils/apiAddress";
import { getSecondsFromDuration } from "../../utils/songs";

export const useplayer = () => {
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
  const [trackInFavorites, setTrackInFavorites] = useState(false);

  const [currentSong, setCurrentSong] = useState(null);
  const route = useRoute();

  const { song } = route.params || {};

  function formatSeconds(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  function extractYouTubeUrl(fullUrl) {
    const urlObj = new URL(fullUrl);
    const youtubeUrlEncoded = urlObj.searchParams.get("url");
    return decodeURIComponent(youtubeUrlEncoded);
  }

  const getSongsDetailsYoutube = async (song) => {
    try {
      const youtubeUrl = extractYouTubeUrl(song.url);
      const response = await fetch(
        `${apiBaseUrl}get-audio-details?url=${encodeURIComponent(youtubeUrl)}`
      );
      const data = await response.json();

      if (!data) {
        return null;
      }
      return data;
    } catch (error) {
      console.log("Error fetching song details:", error);
      return null;
    }
  };

  const getSongsDetailsJioSavan = async (song) => {
    try {
      const response = await fetch(
        `${apiBaseUrl}/get-songs-details-jio-savan/${song.id}`
      );
      const data = await response.json();
      if (!data.data) {
        return null;
      }

      const transformedSong = {
        artist: data.data.author,
        uploader: data.data.author,
        duration: formatSeconds(data.data.duration),
        id: data.data.id,
        title: data.data.title,
        source: "jiosavan",
        thumbnail: data.data.thumbnail,
        url: data.data.id,
        downloadUrls: data.data.downloadUrl,
      };

      return transformedSong;
    } catch (error) {
      console.log("Error fetching song details:", error);
      return null;
    }
  };

  useEffect(() => {
    const listenTrackChange = TrackPlayer.addEventListener(
      Event.PlaybackActiveTrackChanged,
      async (event) => {
        // .index is the newly active track's index
        const currentTrackPlaying = event.track;
        if (
          (currentTrackPlaying &&
            currentTrackPlaying.url.includes("youtube")) ||
          currentTrackPlaying.url.includes("youtu.be")
        ) {
          const fetchedSong = await getSongsDetailsYoutube(currentTrackPlaying);
          if (!fetchedSong) {
            return;
          }
          setCurrentSong(fetchedSong);
          return;
        } else {
          const fetchedSong = await getSongsDetailsJioSavan(
            currentTrackPlaying
          );

          if (!fetchedSong) {
            return;
          }
          setCurrentSong(fetchedSong);
        }
      }
    );
    return () => {
      listenTrackChange?.remove();
    };
  }, []);

  useEffect(() => {
    if (currentSong) {
      checkTrackInFavorites();
    }
  }, [currentSong]);

  const actionSheetRef = useRef(null);

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

  // Check if current track is in any playlists
  const checkTrackInPlaylists = async () => {
    if (!track) return;

    try {
      const stored = mmkvStorage.getString("playlists");
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

  const checkTrackInFavorites = async () => {
    // console.log("Checking favorites for track:", currentSong);
    if (!currentSong) return;

    const stored = mmkvStorage.getString("favorites");
    const favorites = stored ? JSON.parse(stored) : [];

    const favoriteTrack = await isFavorite(currentSong, favorites);

    setTrackInFavorites(favoriteTrack);
  };

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

    setTimeout(() => {
      TrackPlayer.setRepeatMode(
        repeatMode === "off"
          ? RepeatMode.Track
          : repeatMode === "track"
          ? RepeatMode.Queue
          : RepeatMode.Off
      );
    }, 0);
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

  const toggleTrackInFavorites = async (song) => {
    if (!currentSong) return;

    console.log("Toggling favorite for track:", currentSong);

    const stored = mmkvStorage.getString("favorites");
    let favorites = stored ? JSON.parse(stored) : [];

    await toggleFavorite(currentSong, favorites, () => {});
    setTrackInFavorites(!trackInFavorites);
  };

  return {
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
    isPlaying,
    checkTrackInFavorites,
    trackInFavorites,
    toggleTrackInFavorites,
    currentSong,
  };
};
