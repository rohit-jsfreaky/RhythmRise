import { StyleSheet, Text, View, Animated } from "react-native";
import React from "react";

const TopTitle = ({ title }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.accent} />
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
    color: "#F8F9FE", // Switched to light color on dark background
    letterSpacing: 0.5,
  },
  accent: {
    position: 'absolute',
    bottom: -6,
    left: 0,
    width: 32,
    height: 3,
    borderRadius: 4,
    backgroundColor: '#7B4DFF', // Accent color
  }
});
