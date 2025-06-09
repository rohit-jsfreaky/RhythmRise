import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import TopTitle from "../../Components/TopTitle";
import SearchBar from "../../Components/SearchBar";

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigation();
  const fetchSongs = () => {
    navigate.navigate("Search", {
      search: searchQuery,
    });
  };
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" backgroundColor="#fff" />
      <TopTitle title="RyhthmRise" />

      <SearchBar
        fetchSongs={fetchSongs}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      {/* <Text>Home Screen</Text> */}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
});
