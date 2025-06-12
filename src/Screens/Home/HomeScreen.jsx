import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import TopTitle from "../../Components/TopTitle";
import SearchBar from "../../Components/SearchBar";
import * as SecureStore from "expo-secure-store";
import { FlatList, Image, TouchableOpacity } from "react-native";
import TrackPlayer from "react-native-track-player";
import RecentlyPlayed from "../../Components/RecentlyPlayed";
import { BlurView } from "expo-blur";
import { useTheme } from "../../contexts/ThemeContext";

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [favoriteArtists, setFavoriteArtists] = useState([]);
  const navigation = useNavigation();
  const { theme } = useTheme();

  // Mock favorite artists data - replace with actual data from onboarding
  const mockFavoriteArtists = [
    {
      id: "1",
      name: "Taylor Swift",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
      gradient: [theme.colors.primary, theme.colors.secondary],
      genre: "Pop",
    },
    {
      id: "2",
      name: "Ed Sheeran",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      gradient: [theme.colors.secondary, theme.colors.accent],
      genre: "Folk Pop",
    },
    {
      id: "3",
      name: "The Weeknd",
      image:
        "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400",
      gradient: theme.colors.activeGradient,
      genre: "R&B",
    },
  ];

  const fetchSongs = () => {
    navigation.navigate("Search", {
      search: searchQuery,
    });
  };

  useEffect(() => {
    const loadRecentlyPlayed = async () => {
      const stored = await SecureStore.getItemAsync("recentlyPlayed");
      if (stored) setRecentlyPlayed(JSON.parse(stored));
    };

    const loadFavoriteArtists = async () => {
      // Load from SecureStore or use mock data for now
      const stored = await SecureStore.getItemAsync("favoriteArtists");
      if (stored) {
        // Apply theme colors to stored artists
        const storedArtists = JSON.parse(stored).map((artist, index) => ({
          ...artist,
          gradient:
            index === 0
              ? [theme.colors.primary, theme.colors.secondary]
              : index === 1
              ? [theme.colors.secondary, theme.colors.accent]
              : theme.colors.activeGradient,
        }));
        setFavoriteArtists(storedArtists);
      } else {
        setFavoriteArtists(mockFavoriteArtists);
      }
    };

    const unsubscribe = navigation.addListener("focus", () => {
      loadRecentlyPlayed();
      loadFavoriteArtists();
    });

    return unsubscribe;
  }, [navigation, theme]); // Add theme as dependency

  const getSecondsFromDuration = (timeStr) => {
    if (!timeStr) return 0;
    const [mins, secs] = timeStr.split(":").map(Number);
    return mins * 60 + secs;
  };

  const playRecentSong = async (song) => {
    try {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: song.url,
        url: `https://rhythm-rise-backend.vercel.app/api/music/get-audio-stream?url=${encodeURIComponent(
          song.url
        )}&quality=high`,
        title: song.title,
        artist: song.uploader,
        artwork: song.thumbnail,
        duration: getSecondsFromDuration(song.duration),
      });
      await TrackPlayer.play();
      navigation.navigate("Player");
    } catch (error) {
      console.log("Error playing song:", error);
    }
  };

  const navigateToArtistSongs = (artist) => {
    // Navigate to artist songs screen with artist data
    navigation.navigate("ArtistSongs", {
      artist: artist,
    });
  };

  // Helper to chunk array into columns for 3 rows
  const getColumns = (data, rows = 3) => {
    const columns = Array.from({ length: rows }, () => []);
    data.forEach((item, idx) => {
      columns[idx % rows].push(item);
    });
    return columns;
  };

  const columns = getColumns(recentlyPlayed, 3);

  const renderArtistCard = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.artistCard,
        {
          marginRight: index < favoriteArtists.length - 1 ? 16 : 0,
          shadowColor: theme.colors.shadowColor,
        },
      ]}
      onPress={() => navigateToArtistSongs(item)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={item.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.artistCardGradient}
      >
        <View style={styles.artistCardContent}>
          <View
            style={[
              styles.artistImageContainer,
              { borderColor: theme.colors.glassBackground },
            ]}
          >
            <Image source={{ uri: item.image }} style={styles.artistImage} />
          </View>

          <View style={styles.artistInfo}>
            <Text
              style={[
                styles.artistName,
                { color: theme.colors.textPrimary },
              ]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Text
              style={[
                styles.artistGenre,
                { color: theme.colors.textSecondary },
              ]}
              numberOfLines={1}
            >
              {item.genre}
            </Text>
          </View>

          <View style={styles.playIconContainer}>
            <View
              style={[
                styles.playIcon,
                { backgroundColor: theme.colors.glassBackground },
              ]}
            >
              <Text
                style={[
                  styles.playIconText,
                  { color: theme.colors.textPrimary },
                ]}
              >
                ▶
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.colors.background }]}
    >
      <LinearGradient
        colors={theme.colors.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.screen}>
          <StatusBar style="light" />

          <View style={styles.header}>
            <TopTitle title="RhythmRise" />
          </View>

          <SearchBar
            fetchSongs={fetchSongs}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <View style={styles.featuredSection}>
            <Text
              style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
            >
              Featured Today
            </Text>
            <TouchableOpacity style={styles.featuredCard}>
              <ImageBackground
                source={{
                  uri: "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
                }}
                style={styles.featuredImage}
                imageStyle={{ borderRadius: 16 }}
              >
                <LinearGradient
                  colors={["transparent", theme.colors.background + "CC"]}
                  style={styles.featuredGradient}
                >
                  <Text
                    style={[
                      styles.featuredTitle,
                      { color: theme.colors.textPrimary },
                    ]}
                  >
                    Weekly Top Hits
                  </Text>
                </LinearGradient>
              </ImageBackground>
            </TouchableOpacity>
          </View>

          {recentlyPlayed.length > 0 && (
            <RecentlyPlayed columns={columns} playRecentSong={playRecentSong} />
          )}

          {favoriteArtists.length > 0 && (
            <View style={styles.artistSection}>
              <Text
                style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
              >
                Your Favorite Artists
              </Text>
              <FlatList
                data={favoriteArtists}
                renderItem={renderArtistCard}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.artistList}
              />
            </View>
          )}
        </SafeAreaView>
      </LinearGradient>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    minHeight: "100%",
  },
  screen: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  profileButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  profileIconBg: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitial: {
    fontSize: 18,
    fontWeight: "bold",
  },
  featuredSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  featuredCard: {
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 8,
  },
  featuredImage: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  featuredGradient: {
    padding: 16,
    height: "100%",
    justifyContent: "flex-end",
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  featuredSubtitle: {
    opacity: 0.8,
    fontSize: 14,
  },
  // Artist Section Styles with Theme Support
  artistSection: {
    marginTop: 32,
    marginBottom: 24,
  },
  artistList: {
    paddingRight: 20,
  },
  artistCard: {
    width: 160,
    height: 200,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  artistCardGradient: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  artistCardContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  artistImageContainer: {
    alignSelf: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    borderWidth: 3,
    elevation: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  artistImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  artistInfo: {
    alignItems: "center",
    marginTop: 12,
  },
  artistName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  artistGenre: {
    fontSize: 12,
    textAlign: "center",
    opacity: 0.8,
  },
  playIconContainer: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  playIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  playIconText: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 2,
  },
});
