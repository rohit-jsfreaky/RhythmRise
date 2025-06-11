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
import { useTheme } from "../../contexts/ThemeContext";

const LibraryScreen = () => {
  const [playlists, setPlaylists] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [menuOpenFor, setMenuOpenFor] = useState(null);
  const { theme } = useTheme();

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

  const getPlaylistColumns = (data, columns = 2) => {
    const chunked = Array.from({ length: columns }, () => []);
    data.forEach((item, idx) => {
      chunked[idx % columns].push(item);
    });
    return chunked;
  };

  const playlistColumns = getPlaylistColumns(playlists, 2);

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={theme.colors.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.screen}>
          <StatusBar style="light" />
          <TopTitle title="Library" />
          
          <View style={styles.createPlaylistSection}>
            <Text style={[styles.heading, { color: theme.colors.textPrimary }]}>
              Create Playlist
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.glassBackground,
                    color: theme.colors.textPrimary,
                  }
                ]}
                placeholder="Playlist title"
                placeholderTextColor={theme.colors.textSecondary}
                value={newTitle}
                onChangeText={setNewTitle}
                selectionColor={theme.colors.primary}
              />
              <TouchableOpacity 
                style={[
                  styles.addBtn,
                  {
                    shadowColor: theme.colors.shadowColor,
                  }
                ]} 
                onPress={createPlaylist}
              >
                <LinearGradient
                  colors={theme.colors.activeGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.addBtnGradient}
                >
                  <Ionicons name="add" size={24} color={theme.colors.textPrimary} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.favoritesSection}>
            <FavoritesCard />
          </View>
          
          <Text style={[styles.heading, { color: theme.colors.textPrimary }]}>
            Your Playlists
          </Text>
          <View style={styles.playlistsContainer}>
            {playlists.length === 0 ? (
              <View style={styles.emptyPlaylistsContainer}>
                <View style={[
                  styles.emptyIconContainer,
                  { backgroundColor: theme.colors.glassBackground }
                ]}>
                  <Ionicons 
                    name="musical-notes" 
                    size={48} 
                    color={theme.colors.textSecondary + "33"} // 20% opacity
                  />
                </View>
                <Text style={[styles.emptyPlaylistsText, { color: theme.colors.textPrimary }]}>
                  No playlists yet
                </Text>
                <Text style={[styles.emptyPlaylistsSubText, { color: theme.colors.textSecondary }]}>
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
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  addBtn: {
    marginLeft: 12,
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
    marginTop: 60,
    opacity: 0.8,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyPlaylistsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyPlaylistsSubText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default LibraryScreen;
