import TrackPlayer from "react-native-track-player";

const getSecondsFromDuration = (timeStr) => {
  if (!timeStr) return 0;
  const [mins, secs] = timeStr.split(":").map(Number);
  return mins * 60 + secs;
};

export const playSong = async (song, navigation) => {
  try {
    await TrackPlayer.reset();
    await TrackPlayer.add({
      id: song.url,
      url: `https://rhythm-rise-backend.vercel.app/api/music/get-audio-stream?url=${encodeURIComponent(
        song.url
      )}&quality=high`,
      title: song.title,
      artist: song.uploader,
      artwork: song.thumbnail,
      duration: getSecondsFromDuration(song.duration),
    });
    await TrackPlayer.play();
    navigation.navigate("Player");
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
        id: s.url,
        url: `https://rhythm-rise-backend.vercel.app/api/music/get-audio-stream?url=${encodeURIComponent(
          s.url
        )}&quality=high`,
        title: s.title,
        artist: s.uploader,
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
