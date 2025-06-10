import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import TopTitle from "../../Components/TopTitle";
import SearchBar from "../../Components/SearchBar";
import * as SecureStore from "expo-secure-store";
import { FlatList, Image, TouchableOpacity } from "react-native";
import TrackPlayer from "react-native-track-player";
import RecentlyPlayed from "../../Components/RecentlyPlayed";

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const navigation = useNavigation();
  const fetchSongs = () => {
    navigate.navigate("Search", {
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
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" backgroundColor="#080B38" />
      <TopTitle title="RyhthmRise" />

      <SearchBar
        fetchSongs={fetchSongs}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      {/* <Text>Home Screen</Text> */}

      {recentlyPlayed.length > 0 && (
        <RecentlyPlayed columns={columns} playRecentSong={playRecentSong} />
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#080B38",
  },
});
