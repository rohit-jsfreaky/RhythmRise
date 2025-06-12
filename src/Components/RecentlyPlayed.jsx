import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Modal,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect, useRef } from "react";
import { Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import PlayListModal from "./PlayListModal";
import { useTheme } from "../contexts/ThemeContext";

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const RecentlyPlayed = ({ playRecentSong, columns }) => {
  const [favorites, setFavorites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [menuOpenFor, setMenuOpenFor] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const menuAnim = useRef(new Animated.Value(0)).current;
  const { theme } = useTheme();

  useEffect(() => {
    (async () => {
      const stored = await SecureStore.getItemAsync("favorites");
      if (stored) setFavorites(JSON.parse(stored));
    })();
  }, []);

  useEffect(() => {
    if (menuOpenFor) {
      Animated.timing(menuAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(menuAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [menuOpenFor]);

  const isFavorite = (song) => favorites.some((fav) => fav.url === song.url);

  const toggleFavorite = async (song) => {
    let updated;
    if (isFavorite(song)) {
      updated = favorites.filter((fav) => fav.url !== song.url);
    } else {
      updated = [song, ...favorites.filter((fav) => fav.url !== song.url)];
    }
    setFavorites(updated);
    await SecureStore.setItemAsync("favorites", JSON.stringify(updated));
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
    if (y + menuHeight > screenHeight - 100) y = screenHeight - menuHeight - 100;
    
    setMenuPosition({ x, y });
    menuAnim.setValue(0);
    setMenuOpenFor(song.url);
  };

  const MenuPortal = () => {
    if (!menuOpenFor) return null;

    return (
      <Modal
        transparent
        visible={!!menuOpenFor}
        animationType="none"
        onRequestClose={() => setMenuOpenFor(null)}
      >
        <TouchableOpacity
          style={styles.portalOverlay}
          activeOpacity={1}
          onPress={() => setMenuOpenFor(null)}
        >
          <Animated.View
            style={[
              styles.portalMenuContainer,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                shadowColor: theme.colors.shadowColor,
                left: menuPosition.x,
                top: menuPosition.y,
                opacity: menuAnim,
                transform: [
                  {
                    translateY: menuAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-10, 0],
                    }),
                  },
                  {
                    scale: menuAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1],
                    }),
                  },
                ],
              }
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                setMenuOpenFor(null);
                const song = columns.flat().find(s => s.url === menuOpenFor);
                if (song) {
                  setSelectedSong(song);
                  setShowModal(true);
                }
              }}
              style={[
                styles.portalMenuItem,
                { borderBottomColor: theme.colors.border }
              ]}
              activeOpacity={0.7}
            >
              <View style={[
                styles.portalMenuIconContainer,
                { backgroundColor: theme.colors.primary + '20' }
              ]}>
                <Ionicons name="musical-notes" size={16} color={theme.colors.primary} />
              </View>
              <Text style={[styles.portalMenuText, { color: theme.colors.textPrimary }]}>
                Add to Playlist
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setMenuOpenFor(null)}
              style={styles.portalMenuItem}
              activeOpacity={0.7}
            >
              <View style={[
                styles.portalMenuIconContainer,
                { backgroundColor: theme.colors.textSecondary + '20' }
              ]}>
                <Ionicons name="close" size={16} color={theme.colors.textSecondary} />
              </View>
              <Text style={[styles.portalMenuText, { color: theme.colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.heading, { color: theme.colors.textPrimary }]}>
          Recently Played
        </Text>
        <TouchableOpacity style={styles.seeAll}>
          <Text style={[styles.seeAllText, { color: theme.colors.textPrimary }]}>
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
              {col.map((song, songIndex) => (
                <View style={{ position: "relative" }} key={song.url}>
                  <TouchableOpacity
                    onPress={() => playRecentSong(song)}
                    style={[styles.recentSongItem, { backgroundColor: theme.colors.glassBackground }]}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: song.thumbnail }}
                      style={[styles.recentArtwork, { backgroundColor: theme.colors.secondary }]}
                    />
                    <View style={styles.songInfo}>
                      <Text style={[styles.recentTitle, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                        {song.title}
                      </Text>
                      <Text style={[styles.recentArtist, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                        {song.uploader}
                      </Text>
                      <Text style={[styles.recentDuration, { color: theme.colors.textSecondary }]}>
                        {song.duration}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      onPress={() => toggleFavorite(song)}
                      style={styles.actionButton}
                    >
                      <Ionicons
                        name={isFavorite(song) ? "heart" : "heart-outline"}
                        size={22}
                        color={isFavorite(song) ? theme.colors.errorColor : theme.colors.textPrimary}
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

      <MenuPortal />

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
  // Portal-based menu styles
  portalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  portalMenuContainer: {
    position: 'absolute',
    borderRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
    minWidth: 180,
    overflow: 'hidden',
    borderWidth: 1,
  },
  portalMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  portalMenuIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  portalMenuText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
