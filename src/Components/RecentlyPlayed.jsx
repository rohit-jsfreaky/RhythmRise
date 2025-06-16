import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import PlayListModal from "./PlayListModal";
import MenuPortal from "./MenuPortal";
import { useTheme } from "../contexts/ThemeContext";
import { isFavorite, toggleFavorite } from "../utils/Favorite";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

const RecentlyPlayed = ({ playRecentSong, columns }) => {
  const [favorites, setFavorites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [menuOpenFor, setMenuOpenFor] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();

  useEffect(() => {
    (async () => {
      const stored = await SecureStore.getItemAsync("favorites");
      if (stored) setFavorites(JSON.parse(stored));
    })();
  }, []);

  const handletoggleFavorite = async (song) => {
    await toggleFavorite(song, favorites, setFavorites);
  };

  const handleMenuPress = (song, event) => {
    const { pageX, pageY } = event.nativeEvent;
    const menuWidth = 180;
    const menuHeight = 120;

    // Calculate position to keep menu on screen
    let x = pageX - menuWidth + 20; // Position to the left of touch point
    let y = pageY - 20; // Position slightly above touch point

    // Adjust if menu would go off screen
    if (x < 20) x = 20;
    if (x + menuWidth > screenWidth - 20) x = screenWidth - menuWidth - 20;
    if (y < 60) y = 60; // Keep below status bar
    if (y + menuHeight > screenHeight - 100)
      y = screenHeight - menuHeight - 100;

    setMenuPosition({ x, y });
    setMenuOpenFor(song.url);
  };

  const handleAddToPlaylist = () => {
    const song = columns.flat().find((s) => s.url === menuOpenFor);
    if (song) {
      setSelectedSong(song);
      setShowModal(true);
    }
  };

  const handleCancel = () => {
    // Optional: Add any cleanup logic here
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.heading, { color: theme.colors.textPrimary }]}>
          Recently Played
        </Text>
        <TouchableOpacity style={styles.seeAll}>
          <Text
            style={[styles.seeAllText, { color: theme.colors.textPrimary }]}
          >
            See All
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row" }}>
        <FlatList
          data={columns}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, idx) => "col" + idx}
          renderItem={({ item: col }) => (
            <View style={{ marginRight: 16, paddingBottom: 16 }}>
              {col.map((song) => (
                <View style={{ position: "relative" }} key={song.url}>
                  <TouchableOpacity
                    onPress={() => playRecentSong(song)}
                    style={[
                      styles.recentSongItem,
                      { backgroundColor: theme.colors.glassBackground },
                    ]}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: song.thumbnail }}
                      style={[
                        styles.recentArtwork,
                        { backgroundColor: theme.colors.secondary },
                      ]}
                    />
                    <View style={styles.songInfo}>
                      <Text
                        style={[
                          styles.recentTitle,
                          { color: theme.colors.textPrimary },
                        ]}
                        numberOfLines={1}
                      >
                        {song.title}
                      </Text>
                      <Text
                        style={[
                          styles.recentArtist,
                          { color: theme.colors.textSecondary },
                        ]}
                        numberOfLines={1}
                      >
                        {song.uploader}
                      </Text>
                      <Text
                        style={[
                          styles.recentDuration,
                          { color: theme.colors.textSecondary },
                        ]}
                      >
                        {song.duration}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      onPress={() => handletoggleFavorite(song)}
                      style={styles.actionButton}
                    >
                      <Ionicons
                        name={
                          isFavorite(song, favorites)
                            ? "heart"
                            : "heart-outline"
                        }
                        size={22}
                        color={
                          isFavorite(song, favorites)
                            ? theme.colors.errorColor
                            : theme.colors.textPrimary
                        }
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={(event) => handleMenuPress(song, event)}
                      style={styles.actionButton}
                    >
                      <Ionicons
                        name="ellipsis-vertical"
                        size={22}
                        color={theme.colors.textPrimary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        />
      </View>

      <MenuPortal
        menuOpenFor={menuOpenFor}
        setMenuOpenFor={setMenuOpenFor}
        menuPosition={menuPosition}
        onAddToPlaylist={handleAddToPlaylist}
        onCancel={handleCancel}
      />

      {showModal && (
        <PlayListModal
          selectedSong={selectedSong}
          setSelectedSong={setSelectedSong}
          setShowModal={setShowModal}
          showModal={showModal}
        />
      )}
    </View>
  );
};

export default RecentlyPlayed;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
  },
  seeAll: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
  },
  recentSongItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    width: 250,
  },
  recentArtwork: {
    width: 56,
    height: 56,
    borderRadius: 10,
    marginRight: 12,
  },
  songInfo: {
    flex: 1,
    justifyContent: "center",
    paddingRight: 50, // Make space for action buttons
  },
  recentTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  recentArtist: {
    fontSize: 13,
    marginBottom: 4,
  },
  recentDuration: {
    fontSize: 12,
    opacity: 0.7,
  },
  actionButtons: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  actionButton: {
    padding: 6,
  },
});
