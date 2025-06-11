import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../contexts/ThemeContext";

const FavoritesCard = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          shadowColor: theme.colors.shadowColor,
        }
      ]}
      onPress={() => navigation.navigate("Favorites")}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[theme.colors.accent, theme.colors.primary + "80"]} // 50% opacity
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={[
          styles.iconContainer,
          { backgroundColor: theme.colors.glassBackground }
        ]}>
          <Ionicons name="heart" size={36} color={theme.colors.errorColor} />
        </View>
        <Text style={[styles.heading, { color: theme.colors.textPrimary }]}>
          Favorites
        </Text>
        <Text style={[styles.subheading, { color: theme.colors.textSecondary }]}>
          All your loved tracks
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default FavoritesCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  card: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
  },
  subheading: {
    fontSize: 14,
  },
});
