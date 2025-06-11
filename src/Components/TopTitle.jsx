import { StyleSheet, Text, View, Animated } from "react-native";
import React from "react";
import { useTheme } from "../contexts/ThemeContext";

const TopTitle = ({ title }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text>
      <View style={[styles.accent, { backgroundColor: theme.colors.primary }]} />
    </View>
  );
};

export default TopTitle;

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    position: 'relative',
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  accent: {
    position: 'absolute',
    bottom: -6,
    left: 0,
    width: 32,
    height: 3,
    borderRadius: 4,
  }
});
