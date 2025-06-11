import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect, useRef } from "react";
import { Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import PlayListModal from "./PlayListModal";

const RecentlyPlayed = ({ playRecentSong, columns }) => {
  const [favorites, setFavorites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [menuOpenFor, setMenuOpenFor] = useState(null);
  const menuAnim = useRef(new Animated.Value(0)).current;

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
        duration: 180,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(menuAnim, {
        toValue: 0,
        duration: 120,
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

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Recently Played</Text>
        <TouchableOpacity style={styles.seeAll}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row" }}>
        <FlatList
          data={columns}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, idx) => "col" + idx}
          renderItem={({ item: col }) => (
            <View style={{ marginRight: 16 }}>
              {col.map((song) => (
                <View style={{ position: "relative" }} key={song.url}>
                  <TouchableOpacity
                    onPress={() => playRecentSong(song)}
                    style={styles.recentSongItem}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: song.thumbnail }}
                      style={styles.recentArtwork}
                    />
                    <View style={styles.songInfo}>
                      <Text style={styles.recentTitle} numberOfLines={1}>
                        {song.title}
                      </Text>
                      <Text style={styles.recentArtist} numberOfLines={1}>
                        {song.uploader}
                      </Text>
                      <Text style={styles.recentDuration}>{song.duration}</Text>
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
                        color={isFavorite(song) ? "#e74c3c" : "#F8F9FE"}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        menuAnim.setValue(0);
                        setMenuOpenFor(song.url);
                      }}
                      style={styles.actionButton}
                    >
                      <Ionicons
                        name="ellipsis-vertical"
                        size={22}
                        color="#F8F9FE"
                      />
                    </TouchableOpacity>
                  </View>

                  {menuOpenFor === song.url && (
                    <>
                      {/* Overlay to close menu on outside click */}
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
                      <Animated.View
                        style={{
                          position: "absolute",
                          top: 50,
                          right: 10,
                          backgroundColor: "#10133E",
                          borderRadius: 12,
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 8 },
                          shadowOpacity: 0.15,
                          shadowRadius: 12,
                          elevation: 8,
                          zIndex: 100,
                          minWidth: 160,
                          overflow: 'hidden',
                          opacity: menuAnim,
                          transform: [
                            {
                              translateY: menuAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [20, 0],
                              }),
                            },
                          ],
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            setMenuOpenFor(null);
                            setSelectedSong(song);
                            setShowModal(true);
                          }}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: 16,
                            borderBottomWidth: 1,
                            borderBottomColor: 'rgba(160, 166, 177, 0.1)',
                          }}
                          activeOpacity={0.7}
                        >
                          <View style={{
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            backgroundColor: 'rgba(123, 77, 255, 0.2)',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 12,
                          }}>
                            <Ionicons name="musical-notes" size={16} color="#7B4DFF" />
                          </View>
                          <Text style={{ 
                            color: "#F8F9FE", 
                            fontSize: 14, 
                            fontWeight: '500' 
                          }}>
                            Add to Playlist
                          </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          onPress={() => setMenuOpenFor(null)}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: 16,
                          }}
                          activeOpacity={0.7}
                        >
                          <View style={{
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            backgroundColor: 'rgba(160, 166, 177, 0.1)',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 12,
                          }}>
                            <Ionicons name="close" size={16} color="#A0A6B1" />
                          </View>
                          <Text style={{ 
                            color: "#A0A6B1", 
                            fontSize: 14, 
                            fontWeight: '500' 
                          }}>
                            Cancel
                          </Text>
                        </TouchableOpacity>
                      </Animated.View>
                    </>
                  )}
                </View>
              ))}
            </View>
          )}
        />
      </View>
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
    marginBottom: 24,
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
    color: "#F8F9FE",
  },
  seeAll: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  seeAllText: {
    color: "#7B4DFF",
    fontSize: 14,
    fontWeight: "600",
  },
  recentSongItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
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
    backgroundColor: "#18B5FF",
  },
  songInfo: {
    flex: 1,
    justifyContent: "center",
    paddingRight: 50, // Make space for action buttons
  },
  recentTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#F8F9FE",
    marginBottom: 2,
  },
  recentArtist: {
    fontSize: 13,
    color: "#A0A6B1",
    marginBottom: 4,
  },
  recentDuration: {
    fontSize: 12,
    color: "#A0A6B1",
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
