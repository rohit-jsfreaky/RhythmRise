import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaView, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../contexts/ThemeContext";

const { width } = Dimensions.get("window");
const ARTWORK_SIZE = width * 0.75;

const NoTrackPlayer = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <LinearGradient
      colors={theme.colors.gradient}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            style={styles.headerButton}
          >
            <Ionicons
              name="arrow-back"
              size={28}
              color={theme.colors.textPrimary}
            />
          </TouchableOpacity>
          <Text
            style={[styles.headerTitle, { color: theme.colors.textPrimary }]}
          >
            Now Playing
          </Text>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons
              name="ellipsis-vertical"
              size={24}
              color={theme.colors.textPrimary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.emptyStateContainer}>
          <View
            style={[
              styles.artworkShadow,
              { shadowColor: theme.colors.shadowColor },
            ]}
          >
            <LinearGradient
              colors={[theme.colors.accent, theme.colors.primary + "80"]} // 50% opacity
              style={[styles.artwork, styles.emptyArtwork]}
            >
              <Ionicons
                name="musical-notes"
                size={80}
                color={theme.colors.textPrimary + "4D"} // 30% opacity
              />
            </LinearGradient>
          </View>

          <Text
            style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}
          >
            No Track Playing
          </Text>
          <Text
            style={[
              styles.emptySubtitle,
              { color: theme.colors.textSecondary },
            ]}
          >
            Play a song to see it here
          </Text>

          <View style={{ height: 200 }} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default NoTrackPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  emptyArtwork: {
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  artworkShadow: {
    borderRadius: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
  },
  artwork: {
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
    borderRadius: 24,
  },
});
