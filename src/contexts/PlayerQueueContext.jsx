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
    const resposne = await fetch(
      `${apiBaseUrl}related-songs?videoId=${song.id}`
    );

    if (!resposne.ok) {
      throw new Error("Failed to fetch related songs from YouTube");
    }
    const data = await resposne.json();

    console.log("Related songs from YouTube:", data);
  } catch (error) {
    console.log("Error fetching related songs from YouTube:", error);
  }
};

const fetchSavanRelated = async (song) => {
  try {
    const response = await fetch(
      `${apiBaseUrl}related-songs-jio-savan/${song.id}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch related songs from savan");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.log("Error fetching related songs from Savan:", error);
    return [];
  }
};

const addToQueue = async (songs) => {
  if (!Array.isArray(songs) || songs.length === 0) {
    console.log("No related songs to add to queue");
    return;
  }

  // Limit to 5 related songs
  const songsToAdd = songs.slice(0, 5);
  console.log(`Adding ${songsToAdd.length} related songs to queue`);

  try {
    for (const song of songsToAdd) {
      await TrackPlayer.add({
        id: song.url || song.id,
        url: decideSingleSongUrl(song),
        title: song.title,
        artist: song.uploader || song.artist || "Unknown Artist",
        artwork: song.thumbnail,
        duration:
          song.duration && typeof song.duration === "string"
            ? getSecondsFromDuration(song.duration)
            : song.duration || 0,
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
    const loadQueue = async () => {
      try {
        const currentQueue = await TrackPlayer.getQueue();
        setQueue(currentQueue);
      } catch (error) {
        console.log("Error loading initial queue:", error);
      }
    };

    loadQueue();

    const onTrackChange = TrackPlayer.addEventListener(
      Event.PlaybackActiveTrackChanged,
      async (event) => {
        // .index is the newly active track's index
        const currentIndex = event.index;
        const currentQueue = await TrackPlayer.getQueue();
        setQueue(currentQueue);

        if (typeof currentIndex === "number") {
          const remaining = currentQueue.length - (currentIndex + 1);

          if (remaining <= 2) {
            const activeTrack = currentQueue[currentIndex];
            const relatedApiMode = decideRelatedApiMode(activeTrack);

            setIsLoadingRelated(true);
            try {
              if (relatedApiMode === "youtube") {
                // YouTube implementation left as is
                fetchYotubeRelated(activeTrack);
              } else if (relatedApiMode === "savan") {
                console.log(
                  "Fetching related JioSaavan songs for:",
                  activeTrack.title
                );
                const relatedSongs = await fetchSavanRelated(activeTrack);
                await addToQueue(relatedSongs);

                // Update queue after adding songs
                const updatedQueue = await TrackPlayer.getQueue();
                setQueue(updatedQueue);
              }
            } catch (error) {
              console.log("Error processing related songs:", error);
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
