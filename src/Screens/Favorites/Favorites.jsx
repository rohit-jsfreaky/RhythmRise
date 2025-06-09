import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import TopTitle from "../../Components/TopTitle";
import TrackPlayer from "react-native-track-player";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadFavorites = async () => {
      const stored = await SecureStore.getItemAsync("favorites");
      if (stored) setFavorites(JSON.parse(stored));
    };
    loadFavorites();
  }, []);

  // Play all favorites, start from pressed song
  const playFavoriteSong = async (song) => {
    try {
      await TrackPlayer.reset();
      // Add all favorites to queue
      for (const fav of favorites) {
        await TrackPlayer.add({
          id: fav.url,
          url: `https://rhythm-rise-backend.vercel.app/api/music/get-audio-stream?url=${encodeURIComponent(
            fav.url
          )}&quality=high`,
          title: fav.title,
          artist: fav.uploader,
          artwork: fav.thumbnail,
          duration:
            fav.duration && typeof fav.duration === "string"
              ? getSecondsFromDuration(fav.duration)
              : fav.duration || 0,
        });
      }
      // Find index of pressed song
      const idx = favorites.findIndex((f) => f.url === song.url);
      if (idx > 0) await TrackPlayer.skip(idx);
      await TrackPlayer.play();
      navigation.replace("Tabs", { screen: "Player" });
    } catch (e) {
      console.log("Error playing favorite:", e);
    }
  };

  const getSecondsFromDuration = (timeStr) => {
    if (!timeStr) return 0;
    const [mins, secs] = timeStr.split(":").map(Number);
    return mins * 60 + secs;
  };
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" backgroundColor="#fff" />
      <TopTitle title="Favorites" />

      <View style={{ flex: 1, paddingVertical: 20 }}>
        {favorites.length === 0 ? (
          <Text style={{ color: "#888", marginTop: 20 }}>
            No favorites yet.
          </Text>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.url}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#f7f7f7",
                  borderRadius: 12,
                  paddingVertical: 10,
                  marginBottom: 16,
                  paddingHorizontal: 16,
                }}
                onPress={() => playFavoriteSong(item)}
              >
                <Image
                  source={{ uri: item.thumbnail }}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 8,
                    marginRight: 12,
                    backgroundColor: "#eee",
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "bold",
                      color: "#222",
                      marginBottom: 2,
                    }}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#888",
                      marginBottom: 2,
                    }}
                    numberOfLines={1}
                  >
                    {item.uploader}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#aaa" }}>
                    {item.duration}
                  </Text>
                </View>
                <Ionicons name="heart" size={22} color="#e74c3c" />
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
});
