import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
  const [menuOpenFor, setMenuOpenFor] = useState(null);

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
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={['rgba(123, 77, 255, 0.15)', '#080B38']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.screen}>
          <StatusBar style="light" />
          <TopTitle title="Library" />
          
          <View style={styles.createPlaylistSection}>
            <Text style={styles.heading}>Create Playlist</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Playlist title"
                placeholderTextColor="#A0A6B1"
                value={newTitle}
                onChangeText={setNewTitle}
                selectionColor="#7B4DFF"
                color="#F8F9FE"
              />
              <TouchableOpacity style={styles.addBtn} onPress={createPlaylist}>
                <LinearGradient
                  colors={['#18B5FF', '#7B4DFF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.addBtnGradient}
                >
                  <Ionicons name="add" size={24} color="#F8F9FE" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.favoritesSection}>
            <FavoritesCard />
          </View>
          
          <Text style={styles.heading}>Your Playlists</Text>
          <View style={styles.playlistsContainer}>
            {playlists.length === 0 ? (
              <View style={styles.emptyPlaylistsContainer}>
                <Ionicons name="musical-notes" size={48} color="rgba(248, 249, 254, 0.2)" />
                <Text style={styles.emptyPlaylistsText}>No playlists yet</Text>
                <Text style={styles.emptyPlaylistsSubText}>
                  Create your first playlist above
                </Text>
              </View>
            ) : (
              <PlaylistCardList
                playlistColumns={playlistColumns}
                setPlaylistToDelete={setPlaylistToDelete}
                setRenameValue={setRenameValue}
                setShowDeleteModal={setShowDeleteModal}
                setShowRenameModal={setShowRenameModal}
              />
            )}
          </View>
          
          {menuOpenFor && (
            <TouchableOpacity
              activeOpacity={1}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 98,
              }}
              onPress={() => setMenuOpenFor(null)}
            />
          )}
        </SafeAreaView>
      </LinearGradient>
      
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#080B38",
  },
  gradient: {
    flex: 1,
    minHeight: '100%',
  },
  screen: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#F8F9FE",
  },
  createPlaylistSection: {
    marginBottom: 24,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(248, 249, 254, 0.15)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    color: "#F8F9FE",
    fontSize: 15,
  },
  addBtn: {
    marginLeft: 12,
    shadowColor: "#7B4DFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addBtnGradient: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoritesSection: {
    marginBottom: 24,
  },
  playlistsContainer: {
    flex: 1,
  },
  emptyPlaylistsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    opacity: 0.8,
  },
  emptyPlaylistsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#F8F9FE",
    marginTop: 12,
    marginBottom: 4,
  },
  emptyPlaylistsSubText: {
    fontSize: 14,
    color: "#A0A6B1",
  },
});

export default LibraryScreen;
