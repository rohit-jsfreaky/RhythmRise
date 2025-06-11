import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  fetchSongs,
  showClear,
  onClear,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.searchContainer}>
      <View style={[styles.inputWrapper, { backgroundColor: theme.colors.glassBackground }]}>
        <Ionicons 
          name="search" 
          size={20} 
          color={theme.colors.textSecondary} 
          style={styles.icon} 
        />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.textPrimary }]}
          placeholder="Search for songs..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={fetchSongs}
          returnKeyType="search"
        />
        {showClear && (
          <TouchableOpacity style={styles.clearButton} onPress={onClear}>
            <Ionicons name="close-circle" size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={[styles.searchButton, { 
          backgroundColor: theme.colors.primary,
          shadowColor: theme.colors.shadowColor,
        }]}
        onPress={fetchSongs}
      >
        <Ionicons name="arrow-forward" size={22} color={theme.colors.textPrimary} />
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
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
  },
  icon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  searchButton: {
    marginLeft: 12,
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
