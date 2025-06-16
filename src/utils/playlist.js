import * as SecureStore from "expo-secure-store";
import { ToastAndroid } from "react-native";

export const removeFromPlayList = async () => {};

export const addToPlayList = async (
  playlistTitle,
  selectedSong,
  setShowModal,
  setSelectedSong
) => {
  const stored = await SecureStore.getItemAsync("playlists");
  let playlistsArr = stored ? JSON.parse(stored) : [];
  playlistsArr = playlistsArr.map((pl) =>
    pl.title === playlistTitle
      ? {
          ...pl,
          songs: [
            selectedSong,
            ...pl.songs.filter((s) => s.url !== selectedSong.url),
          ],
        }
      : pl
  );
  await SecureStore.setItemAsync("playlists", JSON.stringify(playlistsArr));
  setShowModal(false);
  setSelectedSong(null);
  ToastAndroid.show(`Added to playlist "${playlistTitle}"`, ToastAndroid.SHORT);
};

export const createPlaylist = async (
  newTitle,
  setPlaylists,
  setNewTitle,
  playlists
) => {
  if (!newTitle.trim()) return;
  const updated = [{ title: newTitle, songs: [] }, ...playlists];
  setPlaylists(updated);
  await SecureStore.setItemAsync("playlists", JSON.stringify(updated));
  setNewTitle("");
};

export const deletePlaylist = async (
  playlists,
  setPlaylists,
  setShowDeleteModal,
  setPlaylistToDelete,
  playlistToDelete
) => {
  const updated = playlists.filter((pl) => pl.title !== playlistToDelete);
  setPlaylists(updated);
  await SecureStore.setItemAsync("playlists", JSON.stringify(updated));
  setShowDeleteModal(false);
  setPlaylistToDelete(null);
};
