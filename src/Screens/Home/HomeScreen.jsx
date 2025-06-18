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
import ArtistCard from "../../Components/ArtistCard";
import * as SecureStore from "expo-secure-store";
import { FlatList, TouchableOpacity } from "react-native";
import RecentlyPlayed from "../../Components/RecentlyPlayed";
import { useTheme } from "../../contexts/ThemeContext";
import { playSong } from "../../utils/songs";

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const navigation = useNavigation();
  const { theme } = useTheme();

  const fetchSongs = () => {
    navigation.navigate("Search", {
      search: searchQuery,
    });
    setSearchQuery("");
  };

  useEffect(() => {
    const loadRecentlyPlayed = async () => {
      const stored = await SecureStore.getItemAsync("recentlyPlayed");
      if (stored) setRecentlyPlayed(JSON.parse(stored));
    };

    const unsubscribe = navigation.addListener("focus", () => {
      loadRecentlyPlayed();
    });

    return unsubscribe;
  }, [navigation]);

  const playRecentSong = async (song) => {
    await playSong(song, navigation);
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
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
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
            <TouchableOpacity
              style={styles.featuredCard}
              onPress={() => navigation.navigate("Trending")}
            >
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

          {/* Quick Actions Section */}
          <View style={styles.quickActionsSection}>
            <Text
              style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
            >
              Quick Actions
            </Text>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity
                style={[
                  styles.quickActionCard,
                  { backgroundColor: theme.colors.glassBackground },
                ]}
                onPress={() => navigation.navigate("Favorites")}
              >
                <View
                  style={[
                    styles.quickActionIcon,
                    { backgroundColor: theme.colors.errorColor + "20" },
                  ]}
                >
                  <Text
                    style={[
                      styles.quickActionEmoji,
                      { color: theme.colors.errorColor },
                    ]}
                  >
                    ❤️
                  </Text>
                </View>
                <Text
                  style={[
                    styles.quickActionText,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  Favorites
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.quickActionCard,
                  { backgroundColor: theme.colors.glassBackground },
                ]}
                onPress={() =>
                  navigation.replace("Tabs", { screen: "Library" })
                }
              >
                <View
                  style={[
                    styles.quickActionIcon,
                    { backgroundColor: theme.colors.primary + "20" },
                  ]}
                >
                  <Text
                    style={[
                      styles.quickActionEmoji,
                      { color: theme.colors.primary },
                    ]}
                  >
                    🎵
                  </Text>
                </View>
                <Text
                  style={[
                    styles.quickActionText,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  Playlists
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
  // Artist Section Styles
  artistSection: {
    marginTop: 32,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
  },
  artistList: {
    paddingRight: 20,
  },
  artistSeparator: {
    width: 16,
  },
  // Quick Actions Section
  quickActionsSection: {
    marginTop: 32,
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickActionCard: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  quickActionEmoji: {
    fontSize: 20,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
