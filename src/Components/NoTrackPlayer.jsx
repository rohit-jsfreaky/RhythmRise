import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaView, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { View, Text, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const ARTWORK_SIZE = width * 0.75;

const NoTrackPlayer = () => {
  return (
    <LinearGradient
      colors={["rgba(123, 77, 255, 0.15)", "#080B38"]}
      style={styles.container}
    >
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="chevron-down" size={28} color="#F8F9FE" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Now Playing</Text>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="#F8F9FE" />
          </TouchableOpacity>
        </View>

        <View style={styles.emptyStateContainer}>
          <View style={styles.artworkShadow}>
            <LinearGradient
              colors={["#36195B", "#522377"]}
              style={[styles.artwork, styles.emptyArtwork]}
            >
              <Ionicons
                name="musical-notes"
                size={80}
                color="rgba(248, 249, 254, 0.3)"
              />
            </LinearGradient>
          </View>

          <Text style={styles.emptyTitle}>No Track Playing</Text>
          <Text style={styles.emptySubtitle}>Play a song to see it here</Text>

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
    backgroundColor: "#080B38",
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
    color: "#F8F9FE",
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
    shadowColor: "#7B4DFF",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    borderRadius: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F8F9FE",
    marginTop: 30,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#A0A6B1",
  },
  artwork: {
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
    borderRadius: 24,
    backgroundColor: "#36195B",
  },
});
