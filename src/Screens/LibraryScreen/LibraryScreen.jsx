import React from "react";

import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import TopTitle from "../../Components/TopTitle";
import FavoritesCard from "../../Components/FavoritesCard";
import { SafeAreaView } from "react-native-safe-area-context";

const LibraryScreen = () => {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" backgroundColor="#fff" />
      <TopTitle title="Library" />

      <FavoritesCard />
    </SafeAreaView>
  );
};

export default LibraryScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
});
