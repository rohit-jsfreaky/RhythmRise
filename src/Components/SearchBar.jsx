import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  fetchSongs,
  showClear,
  onClear,
}) => {
  return (
    <View style={styles.searchContainer}>
      {/* <Ionicons name="search" size={22} color="#888" style={styles.icon} /> */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search for songs..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={fetchSongs}
        returnKeyType="search"
      />
      {showClear && (
        <TouchableOpacity style={styles.clearButton} onPress={onClear}>
          <Ionicons name="close-circle" size={30} color="#888" />
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.searchButton} onPress={fetchSongs}>
        <Ionicons name="search" size={30} color="#888" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchContainer: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  clearButton: {
    marginRight: 8,
  },
  searchButton: {
    marginLeft: 8,
  },
});
