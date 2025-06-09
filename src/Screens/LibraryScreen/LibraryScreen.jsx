import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import FavoritesCard from "../../Components/FavoritesCard";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import TopTitle from "../../Components/TopTitle";

const LibraryScreen = () => {
  const [playlists, setPlaylists] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);
  const navigation = useNavigation();

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
      <StatusBar style="dark" backgroundColor="#fff" />
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
        {playlistColumns.map((column, colIdx) => (
          <View key={colIdx} style={{ flex: 1 }}>
            {column.map((item) => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  key={item.title}
                  style={styles.playlistCard}
                  onPress={() =>
                    navigation.navigate("Playlist", { title: item.title })
                  }
                >
                  <Ionicons name="musical-notes" size={48} color="#4b7bec" />
                  <Text style={styles.playlistTitle}>{item.title}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setPlaylistToDelete(item.title);
                    setShowDeleteModal(true);
                  }}
                  style={{ position: "absolute", top: 8, right: 8, padding: 6 }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="ellipsis-vertical" size={22} color="#888" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
      </View>
      {showDeleteModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Delete Playlist?</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete "{playlistToDelete}"? This cannot
              be undone.
            </Text>
            <View style={{ flexDirection: "row", marginTop: 20 }}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#e74c3c" }]}
                onPress={handleDeletePlaylist}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Delete
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  { backgroundColor: "#eee", marginLeft: 10 },
                ]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={{ color: "#222", fontWeight: "bold" }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
  playlistCard: {
    width: 120,
    height: 120,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    margin: 10,
  },
  playlistTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4b7bec",
    marginTop: 8,
    textAlign: "center",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#222",
  },
  modalText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  modalBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LibraryScreen;
