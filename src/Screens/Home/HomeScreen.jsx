import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";
import TrackPlayer from "react-native-track-player";

const HomeScreen = ({ navigation }) => {
  const [seacrchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);

  useEffect(() => {
    const getTrackInfo = async () => {
      try {
        const trackIndex = await TrackPlayer.getCurrentTrack();
        if (trackIndex !== null) {
          const trackInfo = await TrackPlayer.getTrack(trackIndex);
          setCurrentTrack(trackInfo);
        }
      } catch (error) {
        console.log("Error getting track info:", error);
      }
    };

    getTrackInfo();
  }, []);

  const fetchSongs = async () => {
    if (!seacrchQuery.trim()) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `https://rhythm-rise-backend.vercel.app/api/music/search-songs?q=${encodeURIComponent(
          seacrchQuery
        )}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.log("Error fetching songs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSecondsFromDuration = (timeStr) => {
    const [mins, secs] = timeStr.split(":").map(Number);
    return mins * 60 + secs;
  };

  const onSongPress = async (song) => {
    try {
      // Keep existing queue and add new song
      const queue = await TrackPlayer.getQueue();
      
      // Add the new track
      await TrackPlayer.add({
        id: song.url,
        url: `https://rhythm-rise-backend.vercel.app/api/music/get-audio-stream?url=${encodeURIComponent(
          song.url
        )}&quality=high`,  // Added quality parameter for better audio
        title: song.title,
        artist: song.uploader,
        artwork: song.thumbnail,
        duration: getSecondsFromDuration(song.duration),
        // Add buffer size options for better streaming
        pitchAlgorithm: 'Music',  // Optimized for music quality
        headers: {
          'User-Agent': 'Mozilla/5.0', // Helps with some streaming services
        },
      });

      // Skip to the newly added track (it will be at the end of queue)
      await TrackPlayer.skip(queue.length);
      await TrackPlayer.play();

      // Navigate to player screen
      navigation.navigate("Player");
    } catch (error) {
      console.log("Error playing song:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for songs..."
          value={seacrchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={fetchSongs}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.resultsContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#1DB954" />
        ) : searchResults.length === 0 ? (
          <Text style={styles.noResults}>
            Search for music to get started
          </Text>
        ) : (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.url}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.songItem}
                onPress={() => onSongPress(item)}
              >
                <Image
                  source={{ uri: item.thumbnail }}
                  style={styles.thumbnail}
                />
                <View style={styles.songInfo}>
                  <Text
                    style={styles.songTitle}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text style={styles.songDetails}>
                    {item.uploader} • {item.duration}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={{
              paddingBottom: currentTrack ? 60 : 0,
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    padding: 10,
    flexDirection: "row",
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: "#1DB954",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  noResults: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
  songItem: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  songInfo: {
    marginLeft: 10,
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  songDetails: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
});

export default HomeScreen;
