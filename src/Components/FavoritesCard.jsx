import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const FavoritesCard = () => {
  const navigation = useNavigation();
  return (
    <Pressable
      style={styles.card}
      onPress={() => navigation.navigate("Favorites")}
    >
      <Ionicons
        name="heart"
        size={54}
        color="#e74c3c"
        style={{ marginBottom: 10 }}
      />
      <Text style={styles.heading}>Favourites</Text>
    </Pressable>
  );
};

export default FavoritesCard;

const styles = StyleSheet.create({
  card: {
    width: 120,
    height: 120,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    marginTop: 30,
  },
  heading: {
    fontSize: 17,
    fontWeight: "bold",
    letterSpacing: 1,
    textAlign: "center",
  },
});
