import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";

const SearchQuery = ({ searchHistory, setSearchHistory, handleQueryTap }) => {
  const handleRemoveQuery = async (query) => {
    const updated = searchHistory.filter((q) => q !== query);
    setSearchHistory(updated);
    await SecureStore.setItemAsync("searchHistory", JSON.stringify(updated));
  };

  const handleClearAll = async () => {
    setSearchHistory([]);
    await SecureStore.deleteItemAsync("searchHistory");
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Recent Searches</Text>
        <TouchableOpacity onPress={handleClearAll} style={styles.clearAllBtn}>
          <Ionicons name="trash-outline" size={22} color="#888" />
          <Text style={styles.clearAllText}>Clear All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.list}>
        {searchHistory.map((query) => (
          <View key={query} style={styles.queryRow}>
            <TouchableOpacity
              style={styles.queryBtn}
              onPress={() => handleQueryTap(query)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="time-outline"
                size={18}
                color="#1DB954"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.queryText}>{query}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleRemoveQuery(query)}
              style={styles.removeBtn}
            >
              <Ionicons name="close-circle-outline" size={22} color="#888" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

export default SearchQuery;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 17,
    color: "#222",
  },
  clearAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: "#f3f3f3",
  },
  clearAllText: {
    color: "#888",
    fontSize: 13,
    marginLeft: 4,
  },
  list: {
    marginTop: 2,
  },
  queryRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  queryBtn: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  queryText: {
    color: "#222",
    fontSize: 15,
    fontWeight: "500",
  },
  removeBtn: {
    marginLeft: 10,
    padding: 2,
  },
});
