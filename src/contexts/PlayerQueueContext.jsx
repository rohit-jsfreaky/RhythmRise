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

function extractYouTubeVideoId(apiUrl) {
  try {
    const urlObj = new URL(apiUrl);
    const ytUrlEncoded = urlObj.searchParams.get("url");

    if (!ytUrlEncoded) {
      throw new Error("No YouTube URL found in the API URL.");
    }

    // Decode the URL
    const ytUrl = decodeURIComponent(ytUrlEncoded);

    // Extract the video ID
    const ytUrlObj = new URL(ytUrl);
    const videoId = ytUrlObj.searchParams.get("v");

    if (!videoId) {
      throw new Error("No video ID found in the YouTube URL.");
    }

    return videoId;
  } catch (err) {
    console.error("Error extracting video ID:", err.message);
    return null;
  }
}

const fetchYotubeRelated = async (song) => {
  try {
    const videoId = extractYouTubeVideoId(song.url);
    if (!videoId) {
      console.log("No valid YouTube video ID found for song:", song);
      return [];
    }
    
    const response = await fetch(
      `${apiBaseUrl}related-songs?videoId=${videoId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch related songs from YouTube");
    }
    
    const data = await response.json();
    if (!data || !data.relatedSongs || !Array.isArray(data.relatedSongs)) {
      console.log("No related songs found for YouTube video ID:", videoId);
      return [];
    }

    console.log("Related songs from YouTube: Fetched", data.relatedSongs.length, "songs");

    // Transform the YouTube related songs to match our format
    const transformedSongs = data.relatedSongs.map((song) => ({
      id: song.url, // Use the full YouTube URL as ID
      url: song.url,
      title: song.title,
      artist: song.author || "Unknown Artist",
      uploader: song.author || "Unknown Artist",
      thumbnail: song.thumbnail,
      duration: song.duration,
      source: "youtube",
    }));

    return transformedSongs;
  } catch (error) {
    console.log("Error fetching related songs from YouTube:", error);
    return [];
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
  const queue = await TrackPlayer.getQueue();
  const existingIds = new Set(queue.map((song) => song.id));

  // Filter out songs that are already in the queue
  const songsToAdd = songs.filter((song) => !existingIds.has(song.id || song.url));

  console.log(`Adding ${songsToAdd.length} new related songs to queue`);

  try {
    for (const song of songsToAdd.slice(0, 5)) {
      const trackToAdd = {
        id: song.url || song.id,
        url: decideSingleSongUrl(song),
        title: song.title,
        artist: song.uploader || song.artist || "Unknown Artist",
        artwork: song.thumbnail,
        duration: 
          song.duration && typeof song.duration === "string"
            ? getSecondsFromDuration(song.duration)
            : song.duration || 0,
      };

      console.log("Adding song to queue:", trackToAdd.title);
      await TrackPlayer.add(trackToAdd);
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
              let relatedSongs = [];
              
              if (relatedApiMode === "youtube") {
                console.log("Fetching YouTube related songs");
                relatedSongs = await fetchYotubeRelated(activeTrack);
              } else if (relatedApiMode === "savan") {
                console.log("Fetching JioSaavan related songs");
                relatedSongs = await fetchSavanRelated(activeTrack);
              }

              if (relatedSongs && relatedSongs.length > 0) {
                await addToQueue(relatedSongs);
                
                // Update queue state after adding songs
                const updatedQueue = await TrackPlayer.getQueue();
                console.log("Updated queue length:", updatedQueue.length);
                setQueue(updatedQueue);
              } else {
                console.log("No related songs found to add");
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
