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
  const navigation = useNavigation();
  const { theme } = useTheme();

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
    const unsubscribe = navigation.addListener("focus", loadRecentlyPlayed);
    return unsubscribe;
  }, [navigation]);

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

  // Helper to chunk array into columns for 3 rows
  const getColumns = (data, rows = 3) => {
    const columns = Array.from({ length: rows }, () => []);
    data.forEach((item, idx) => {
      columns[idx % rows].push(item);
    });
    return columns;
  };

  const columns = getColumns(recentlyPlayed, 3);

  return (
    <View style={[styles.scrollView, { backgroundColor: theme.colors.background }]}>
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
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
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
                  <Text style={[styles.featuredTitle, { color: theme.colors.textPrimary }]}>
                    Weekly Top Hits
                  </Text>
                  <Text style={[styles.featuredSubtitle, { color: theme.colors.textPrimary }]}>
                    48 trending songs
                  </Text>
                </LinearGradient>
              </ImageBackground>
            </TouchableOpacity>
          </View>

          {recentlyPlayed.length > 0 && (
            <RecentlyPlayed columns={columns} playRecentSong={playRecentSong} />
          )}
        </SafeAreaView>
      </LinearGradient>
    </View>
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
});
