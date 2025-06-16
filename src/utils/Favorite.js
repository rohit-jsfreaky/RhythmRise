import * as SecureStore from "expo-secure-store";

export const isFavorite = (song, favorites) =>
  favorites.some((fav) => fav.url === song.url);

export const toggleFavorite = async (song, favorites, setFavorites) => {
  let updated;
  if (isFavorite(song, favorites)) {
    updated = favorites.filter((fav) => fav.url !== song.url);
  } else {
    updated = [song, ...favorites.filter((fav) => fav.url !== song.url)];
  }
  setFavorites(updated);
  await SecureStore.setItemAsync("favorites", JSON.stringify(updated));
};

export const removeFavorite = async (song, title, setSongs) => {
  const stored = await SecureStore.getItemAsync("playlists");
  let playlistsArr = stored ? JSON.parse(stored) : [];
  playlistsArr = playlistsArr.map((pl) =>
    pl.title === title
      ? { ...pl, songs: pl.songs.filter((s) => s.url !== song.url) }
      : pl
  );
  await SecureStore.setItemAsync("playlists", JSON.stringify(playlistsArr));
  setSongs((prev) => prev.filter((s) => s.url !== song.url));
};
