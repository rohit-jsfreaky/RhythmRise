import React, { createContext, useEffect, useState } from "react";
import TrackPlayer, { Event } from "react-native-track-player";
import { apiBaseUrl } from "../utils/apiAddress";
import { decideSingleSongUrl, getSecondsFromDuration } from "../utils/songs";

export const PlayerQueueContext = createContext();

export const decideRelatedApiMode = (song) => {
  if (
    (song.url && song.url.includes("youtube.com")) ||
    song.url.includes("youtu.be")
  ) {
    return "youtube";
  } else {
    return "savan";
  }
};

const fetchYotubeRelated = async (song) => {
  try {
    const response = await fetch(
      `${apiBaseUrl}related-songs?videoId=${song.id}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch related songs from YouTube");
    }
    const data = await response.json();

    console.log("Related songs from YouTube:", data);
  } catch (error) {
    console.log("Error fetching related songs from YouTube:", error);
  }
};

const fetchSavanRelated = async (song) => {
  try {

    console.log("Fetching related songs from JioSaavan for song ID:", song.id);
    const response = await fetch(
      `${apiBaseUrl}related-songs-jio-savan/${song.id}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch related songs from savan");
    }
    const data = await response.json();
    console.log("Related songs from Savan: Fetched", data.length, "songs");

    // Transform the data to match our format for player consumption
    const transformedSongs = data.map((song) => ({
      id: song.id,
      url: song.id, // Use ID as identifier for JioSaavan
      title: song.title,
      artist: song.author || "Unknown Artist",
      uploader: song.author || "Unknown Artist",
      thumbnail: song.thumbnail,
      duration: song.duration,
      downloadUrls: Object.entries(song.downloadUrl).map(([quality, url]) => ({
        quality: quality.replace("kbps", ""),
        url,
      })),
      source: "jiosavan",
    }));

    return transformedSongs;
  } catch (error) {
    console.log("Error fetching related songs from Savan:", error);
    return [];
  }
};

const addToQueue = async (songs) => {
  if (!Array.isArray(songs) || songs.length === 0) {
    console.log("No valid songs to add to queue");
    return;
  }

  // Limit to 5 related songs to prevent queue overloading
  const songsToAdd = songs.slice(0, 5);
  console.log(`Adding ${songsToAdd.length} related songs to queue`);

  try {
    for (const song of songsToAdd) {
      await TrackPlayer.add({
        id: song.id,
        url: decideSingleSongUrl(song),
        title: song.title,
        artist: song.uploader || song.artist || "Unknown Artist",
        artwork: song.thumbnail,
        duration: song.duration || 0,
      });
    }
    console.log("Successfully added related songs to queue");
  } catch (error) {
    console.log("Error adding songs to queue:", error);
  }
};

export const PlayerQueueProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);

  useEffect(() => {
    const loadInitialQueue = async () => {
      try {
        const currentQueue = await TrackPlayer.getQueue();
        setQueue(currentQueue);
      } catch (error) {
        console.log("Error loading initial queue:", error);
      }
    };

    loadInitialQueue();

    const onTrackChange = TrackPlayer.addEventListener(
      Event.PlaybackActiveTrackChanged,
      async (event) => {
        // .index is the newly active track's index
        const currentIndex = event.index;
        const currentQueue = await TrackPlayer.getQueue();
        setQueue(currentQueue);
        console.log("Current queue length:", currentQueue.length);

        if (typeof currentIndex === "number") {
          const remaining = currentQueue.length - (currentIndex + 1);
          console.log("Remaining songs in queue:", remaining);

          if (remaining <= 2) {
            const activeTrack = currentQueue[currentIndex];
            const relatedApiMode = decideRelatedApiMode(activeTrack);
            console.log(
              "Finding related songs for:",
              activeTrack.title,
              "via",
              relatedApiMode
            );

            setIsLoadingRelated(true);
            try {
              if (relatedApiMode === "youtube") {
                fetchYotubeRelated(activeTrack);
              } else if (relatedApiMode === "savan") {
                console.log("Fetching JioSaavan related songs");
                const relatedSongs = await fetchSavanRelated(activeTrack);
                await addToQueue(relatedSongs);

                // Update queue state after adding songs
                const updatedQueue = await TrackPlayer.getQueue();
                console.log("Updated queue length:", updatedQueue.length);
                setQueue(updatedQueue);
              }
            } catch (error) {
              console.log("Error handling related songs:", error);
            } finally {
              setIsLoadingRelated(false);
            }
          }
        }
      }
    );

    // Listen for queue changes
    const onQueueChange = TrackPlayer.addEventListener(
      Event.PlaybackQueueChanged,
      async () => {
        const updatedQueue = await TrackPlayer.getQueue();
        console.log("Queue changed event, new length:", updatedQueue.length);
        setQueue(updatedQueue);
      }
    );

    return () => {
      onTrackChange.remove();
      onQueueChange.remove();
    };
  }, []);

  return (
    <PlayerQueueContext.Provider value={{ queue, isLoadingRelated }}>
      {children}
    </PlayerQueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = React.useContext(PlayerQueueContext);
  if (!context) {
    throw new Error("useQueue must be used within a PlayerQueueProvider");
  }
  return context;
};
