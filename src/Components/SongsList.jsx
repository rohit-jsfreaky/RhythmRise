import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const SongsList = ({
  data,
  playSong,
  toggleFavorite,
  isFavorite,
  addToPlaylist,
  onRemove, // <-- new prop
}) => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.url}
      renderItem={({ item }) => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#f7f7f7",
            borderRadius: 12,
            paddingVertical: 10,
            marginBottom: 16,
            paddingHorizontal: 16,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
            }}
            onPress={() => playSong(item)}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: item.thumbnail }}
              style={{
                width: 56,
                height: 56,
                borderRadius: 8,
                marginRight: 12,
                backgroundColor: "#eee",
              }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "#222",
                  marginBottom: 2,
                }}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: "#888",
                  marginBottom: 2,
                }}
                numberOfLines={1}
              >
                {item.uploader}
              </Text>
              <Text style={{ fontSize: 12, color: "#aaa" }}>
                {item.duration}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => toggleFavorite(item)}
            style={{ marginLeft: 8, padding: 6 }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={isFavorite(item) ? "heart" : "heart-outline"}
              size={22}
              color={isFavorite(item) ? "#e74c3c" : "#aaa"}
            />
          </TouchableOpacity>
          {!onRemove && (
            <TouchableOpacity
              onPress={() => addToPlaylist(item)}
              style={{ marginLeft: 8, padding: 6 }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="ellipsis-vertical" size={22} color="#888" />
            </TouchableOpacity>
          )}

          {onRemove && (
            <TouchableOpacity
              onPress={() => onRemove(item)}
              style={{ marginLeft: 8, padding: 6 }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="trash-outline" size={22} color="#e74c3c" />
            </TouchableOpacity>
          )}
        </View>
      )}
    />
  );
};

export default SongsList;

const styles = StyleSheet.create({});
