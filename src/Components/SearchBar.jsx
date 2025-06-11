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
      <View style={styles.inputWrapper}>
        <Ionicons name="search" size={20} color="#A0A6B1" style={styles.icon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for songs..."
          placeholderTextColor="#A0A6B1"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={fetchSongs}
          returnKeyType="search"
        />
        {showClear && (
          <TouchableOpacity style={styles.clearButton} onPress={onClear}>
            <Ionicons name="close-circle" size={18} color="#A0A6B1" />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={styles.searchButton}
        onPress={fetchSongs}
      >
        <Ionicons name="arrow-forward" size={22} color="#F8F9FE" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchContainer: {
    marginVertical: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
  },
  icon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#F8F9FE",
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  searchButton: {
    marginLeft: 12,
    backgroundColor: "#7B4DFF",
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#7B4DFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
