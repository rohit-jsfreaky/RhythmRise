import * as SecureStore from "expo-secure-store";

export const removeFromPlayList = async () => {};

export const addToPlayList = async () => {};

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
