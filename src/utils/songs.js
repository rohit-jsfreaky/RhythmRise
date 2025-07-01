import TrackPlayer from "react-native-track-player";
import { apiBaseUrl } from "./apiAddress";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

export const getSecondsFromDuration = (timeStr) => {
  if (!timeStr) return 0;
  const [mins, secs] = timeStr.split(":").map(Number);
  return mins * 60 + secs;
};



export const getBestQualityUrl = (downloadUrls) => {
  const qualityPriority = ["320kbps", "160kbps", "96kbps", "48kbps", "12kbps"];

  const found = downloadUrls.find(
    (item) => item.quality === "320" || item.quality === "320kbps"
  );
  // console.log("Found 320kbps URL:", found);
  if (found) return found.url;

  // console.log("returning first url", downloadUrls[0]);
  // Fallback to first available URL
  return downloadUrls[0]?.url || "";
};

export const decideSingleSongUrl = (song) => {
  if (
    (song.url && song.url.includes("youtube.com")) ||
    song.url.includes("youtu.be")
  ) {
    return `https://rhythm-rise-backend.vercel.app/api/music/get-audio-stream?url=${encodeURIComponent(
      song.url
    )}&quality=high`;
  } else if (typeof song.url === "string" && !song.downloadUrls) {
    console.log("Using provided song URL:", song.url);
    return song.url;
  } else {
    // console.log("Using best quality URL from downloadUrls", song.downloadUrls);
    const bestQualityUrl = getBestQualityUrl(song.downloadUrls);
    return bestQualityUrl;
  }
};

const storeRecentlyPlayed = async (song) => {
  let recent = [];

  const stored = storage.getString("recentlyPlayed");
  if (stored) recent = JSON.parse(stored);

  // Remove if already exists, then add to front
  recent = [
    song,
    ...recent.filter((s) => s.url !== song.url && s.id !== song.id),
  ];

  if (recent.length > 20) recent = recent.slice(0, 20); // Limit to 20

  storage.set("recentlyPlayed", JSON.stringify(recent));
};

export const playSong = async (song, navigation) => {
  try {
    await TrackPlayer.reset();
    await TrackPlayer.add({
      id: song.id,
      url: decideSingleSongUrl(song),
      title: song.title,
      artist: song.uploader || song.artist || "Unknown Artist",
      artwork: song.thumbnail,
      duration: getSecondsFromDuration(song.duration),
    });
    await TrackPlayer.play();
    storeRecentlyPlayed(song);
    navigation.navigate("Player", { song: song });
  } catch (error) {
    console.log("Error playing song:", error);
  }
};

export const playAllSongs = async (song, navigation, songs) => {
  try {
    await TrackPlayer.reset();
    // Add all favorites to queue
    for (const s of songs) {
      await TrackPlayer.add({
        id: s.id,
        url: decideSingleSongUrl(s),
        title: s.title,
        artist: s.uploader || s.artist || "Unknown Artist",
        artwork: s.thumbnail,
        duration:
          s.duration && typeof s.duration === "string"
            ? getSecondsFromDuration(s.duration)
            : s.duration || 0,
      });
    }

    if (song) {
      const idx = songs.findIndex((f) => f.url === song.url);
      if (idx > 0) await TrackPlayer.skip(idx);
    }
    await TrackPlayer.play();
    navigation.replace("Tabs", { screen: "Player" }, { song: song });
  } catch (e) {
    console.log("Error playing favorite:", e);
  }
};

export const handleFetchSognsYoutube = async (
  search,
  setIsLoadingYoutube,
  setYoutubeResults
) => {
  try {
    setIsLoadingYoutube(true);
    const response = await fetch(
      `${apiBaseUrl}search-songs?q=${encodeURIComponent(search)}`
    );
    if (!response.ok) {
      throw new Error("YouTube search failed");
    }
    const data = await response.json();
    setYoutubeResults(data);
  } catch (error) {
    console.log("Error fetching YouTube songs:", error);
    setYoutubeResults([]);
  } finally {
    setIsLoadingYoutube(false);
  }
};

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" + secs : secs}`;
};

export const handleFetchSongsJioSavan = async (
  search,
  setIsLoadingJioSavan,
  setJioSavanResults
) => {
  try {
    setIsLoadingJioSavan(true);
    const response = await fetch(
      `${apiBaseUrl}search-songs-jio-savan?q=${encodeURIComponent(search)}`
    );
    if (!response.ok) {
      throw new Error("JioSavan search failed");
    }
    const data = await response.json();

    // Transform JioSavan data to match our format
    const transformedData = data.data.map((song) => ({
      id: song.id,
      title: song.title,
      uploader: song.author || "Unknown Artist",
      artist: song.author || "Unknown Artist",
      thumbnail: song.thumbnail,
      duration: formatDuration(song.duration),
      url: song.id, // Use ID as identifier
      downloadUrls: song.downloadUrls,
      source: "jiosavan",
    }));

    setJioSavanResults(transformedData);
  } catch (error) {
    console.log("Error fetching JioSavan songs:", error);
    setJioSavanResults([]);
  } finally {
    setIsLoadingJioSavan(false);
  }
};
