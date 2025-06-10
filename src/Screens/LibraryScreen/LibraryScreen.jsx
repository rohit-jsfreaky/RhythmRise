import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import FavoritesCard from "../../Components/FavoritesCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import TopTitle from "../../Components/TopTitle";
import PlaylistCardList from "../../Components/PlaylistCardList";
import DeletePlaylistModal from "../../Components/DeletePlaylistModal";
import RenamePlaylistModal from "../../Components/RenamePlaylistModal";

const LibraryScreen = () => {
  const [playlists, setPlaylists] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  useEffect(() => {
    (async () => {
      const stored = await SecureStore.getItemAsync("playlists");
      if (stored) setPlaylists(JSON.parse(stored));
    })();
  }, []);

  const createPlaylist = async () => {
    if (!newTitle.trim()) return;
    const updated = [{ title: newTitle, songs: [] }, ...playlists];
    setPlaylists(updated);
    await SecureStore.setItemAsync("playlists", JSON.stringify(updated));
    setNewTitle("");
  };

  const handleDeletePlaylist = async () => {
    const updated = playlists.filter((pl) => pl.title !== playlistToDelete);
    setPlaylists(updated);
    await SecureStore.setItemAsync("playlists", JSON.stringify(updated));
    setShowDeleteModal(false);
    setPlaylistToDelete(null);
  };

  const getPlaylistColumns = (data, columns = 3) => {
    const chunked = Array.from({ length: columns }, () => []);
    data.forEach((item, idx) => {
      chunked[idx % columns].push(item);
    });
    return chunked;
  };

  const playlistColumns = getPlaylistColumns(playlists, 3);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" backgroundColor="#080B38" />
      <TopTitle title="Library" />
      <Text style={styles.heading}>Create Playlist</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Playlist title"
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <TouchableOpacity style={styles.addBtn} onPress={createPlaylist}>
          <Ionicons name="add-circle" size={32} color="#1DB954" />
        </TouchableOpacity>
      </View>
      <FavoritesCard />
      <Text style={[styles.heading, { marginTop: 10 }]}>Your Playlists</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <PlaylistCardList
          playlistColumns={playlistColumns}
          setPlaylistToDelete={setPlaylistToDelete}
          setRenameValue={setRenameValue}
          setShowDeleteModal={setShowDeleteModal}
          setShowRenameModal={setShowRenameModal}
        />
      </View>
      <DeletePlaylistModal
        handleDeletePlaylist={handleDeletePlaylist}
        playlistToDelete={playlistToDelete}
        setShowDeleteModal={setShowDeleteModal}
        showDeleteModal={showDeleteModal}
      />
      <RenamePlaylistModal
        playlistToDelete={playlistToDelete}
        playlists={playlists}
        renameValue={renameValue}
        setPlaylistToDelete={setPlaylistToDelete}
        setPlaylists={setPlaylists}
        setRenameValue={setRenameValue}
        setShowRenameModal={setShowRenameModal}
        showRenameModal={showRenameModal}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#222",
  },
  inputRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#f7f7f7",
  },
  addBtn: { marginLeft: 8 },
});

export default LibraryScreen;
