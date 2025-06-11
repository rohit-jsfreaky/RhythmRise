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
          <Ionicons name="trash-outline" size={18} color="#A0A6B1" />
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
                color="#18B5FF"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.queryText}>{query}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleRemoveQuery(query)}
              style={styles.removeBtn}
            >
              <Ionicons name="close-circle-outline" size={22} color="#A0A6B1" />
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
    marginBottom: 16,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#F8F9FE",
  },
  clearAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  clearAllText: {
    color: "#A0A6B1",
    fontSize: 13,
    marginLeft: 6,
  },
  list: {
    marginTop: 4,
  },
  queryRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  queryBtn: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  queryText: {
    color: "#F8F9FE",
    fontSize: 15,
    fontWeight: "500",
  },
  removeBtn: {
    marginLeft: 10,
    padding: 2,
  },
});
