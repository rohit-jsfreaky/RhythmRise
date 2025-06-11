import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

const SearchQuery = ({ searchHistory, setSearchHistory, handleQueryTap }) => {
  const { theme } = useTheme();

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
        <Text style={[styles.headerText, { color: theme.colors.textPrimary }]}>
          Recent Searches
        </Text>
        <TouchableOpacity
          onPress={handleClearAll}
          style={[styles.clearAllBtn, { backgroundColor: theme.colors.glassBackground }]}
        >
          <Ionicons name="trash-outline" size={18} color={theme.colors.textSecondary} />
          <Text style={[styles.clearAllText, { color: theme.colors.textSecondary }]}>
            Clear All
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.list}>
        {searchHistory.map((query) => (
          <View
            key={query}
            style={[styles.queryRow, { backgroundColor: theme.colors.glassBackground }]}
          >
            <TouchableOpacity
              style={styles.queryBtn}
              onPress={() => handleQueryTap(query)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="time-outline"
                size={18}
                color={theme.colors.secondary}
                style={{ marginRight: 10 }}
              />
              <Text style={[styles.queryText, { color: theme.colors.textPrimary }]}>
                {query}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleRemoveQuery(query)}
              style={styles.removeBtn}
            >
              <Ionicons
                name="close-circle-outline"
                size={22}
                color={theme.colors.textSecondary}
              />
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
  },
  clearAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearAllText: {
    fontSize: 13,
    marginLeft: 6,
    fontWeight: "500",
  },
  list: {
    marginTop: 4,
  },
  queryRow: {
    flexDirection: "row",
    alignItems: "center",
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
    fontSize: 15,
    fontWeight: "500",
  },
  removeBtn: {
    marginLeft: 10,
    padding: 2,
  },
});
