import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../contexts/ThemeContext";

const ArtistCard = ({ artist, onPress }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.artistCard,
        { backgroundColor: theme.colors.glassBackground },
      ]}
      onPress={() => onPress(artist)}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.artistImageContainer,
          { shadowColor: theme.colors.shadowColor },
        ]}
      >
        <Image
          source={{ uri: artist.thumbnail }}
          style={[
            styles.artistImage,
            { backgroundColor: theme.colors.accent },
          ]}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.artistImageOverlay}
        />
      </View>

      <View style={styles.artistInfo}>
        <Text
          style={[styles.artistName, { color: theme.colors.textPrimary }]}
          numberOfLines={1}
        >
          {artist.name}
        </Text>
        <Text
          style={[styles.artistSongs, { color: theme.colors.textSecondary }]}
        >
          {artist.songCount} {artist.songCount === 1 ? "song" : "songs"}
        </Text>
      </View>

      <View
        style={[
          styles.playCountContainer,
          { backgroundColor: theme.colors.primary + "20" },
        ]}
      >
        <Text
          style={[styles.playCount, { color: theme.colors.primary }]}
        >
          {artist.playCount || 0}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ArtistCard;

const styles = StyleSheet.create({
  artistCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  artistImageContainer: {
    position: "relative",
    alignSelf: "center",
    marginBottom: 12,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  artistImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  artistImageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  artistInfo: {
    alignItems: "center",
    marginBottom: 8,
  },
  artistName: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
  },
  artistSongs: {
    fontSize: 13,
    opacity: 0.8,
  },
  playCountContainer: {
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 50,
    alignItems: "center",
  },
  playCount: {
    fontSize: 12,
    fontWeight: "600",
  },
});