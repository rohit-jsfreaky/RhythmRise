import TrackPlayer from "react-native-track-player";
import { getBestQualityUrl } from "../Screens/SearchScreen/SearchScreen";

const getSecondsFromDuration = (timeStr) => {
  if (!timeStr) return 0;
  const [mins, secs] = timeStr.split(":").map(Number);
  return mins * 60 + secs;
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
    const bestQualityUrl = getBestQualityUrl(song.downloadUrls);
    return bestQualityUrl;
  }
};

export const playSong = async (song, navigation) => {
  try {
    await TrackPlayer.reset();
    await TrackPlayer.add({
      id: song.url || song.id,
      url: decideSingleSongUrl(song),
      title: song.title,
      artist: song.uploader || song.artist || "Unknown Artist",
      artwork: song.thumbnail,
      duration: getSecondsFromDuration(song.duration),
    });
    await TrackPlayer.play();
    navigation.navigate("Player");
  } catch (error) {
    console.log("Error playing song:", error);
  }
};

export const playAllSongs = async (
  song,
  navigation,
  songs,
  isJioSavan = false
) => {
  try {
    await TrackPlayer.reset();
    // Add all favorites to queue
    for (const s of songs) {
      await TrackPlayer.add({
        id: s.url || s.id,
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
    navigation.replace("Tabs", { screen: "Player" });
  } catch (e) {
    console.log("Error playing favorite:", e);
  }
};
