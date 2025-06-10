import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const PlaylistCardList = ({
  playlistColumns,
  setPlaylistToDelete,
  setShowDeleteModal,
  setRenameValue,
  setShowRenameModal,
}) => {
  const navigation = useNavigation();
  const menuAnim = useRef(new Animated.Value(0)).current;
  const [menuOpenFor, setMenuOpenFor] = useState(null);

  useEffect(() => {
    if (menuOpenFor) {
      Animated.timing(menuAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(menuAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }).start();
    }
  }, [menuOpenFor]);
  return playlistColumns.map((column, colIdx) => (
    <View key={colIdx} style={{ flex: 1 }}>
      {column.map((item) => (
        <View
          key={item.title}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <TouchableOpacity
            key={item.title + "_card"}
            style={styles.playlistCard}
            onPress={() =>
              navigation.navigate("Playlist", { title: item.title })
            }
          >
            <Ionicons name="musical-notes" size={48} color="#4b7bec" />
            <Text style={styles.playlistTitle}>{item.title}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            key={item.title + "_menu"}
            onPress={() => {
              // Always reset animation before opening a new menu
              menuAnim.setValue(0);
              setMenuOpenFor(item.title);
            }}
            style={{
              position: "absolute",
              bottom: 20,
              right: 0,
              paddingVertical: 4,
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 4 }}
          >
            <Ionicons name="ellipsis-vertical" size={22} color="#888" />
          </TouchableOpacity>
          {menuOpenFor === item.title && (
            <Animated.View
              key={item.title + "_menu_popup"}
              style={{
                position: "absolute",
                top: -40,
                right: 0,
                backgroundColor: "#fff",
                borderRadius: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
                elevation: 6,
                zIndex: 100,
                minWidth: 140,
                opacity: menuAnim,
                transform: [
                  {
                    translateY: menuAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setPlaylistToDelete(item.title);
                  setShowDeleteModal(true);
                  setMenuOpenFor(null);
                }}
                style={{ padding: 12 }}
              >
                <Text style={{ color: "#e74c3c", fontWeight: "bold" }}>
                  Delete Playlist
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setPlaylistToDelete(item.title);
                  setRenameValue(item.title);
                  setShowRenameModal(true);
                  setMenuOpenFor(null);
                }}
                style={{ padding: 12 }}
              >
                <Text style={{ color: "#222" }}>Rename Playlist</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setMenuOpenFor(null)}
                style={{ padding: 12 }}
              >
                <Text style={{ color: "#888" }}>Cancel</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      ))}
    </View>
  ));
};

export default PlaylistCardList;

const styles = StyleSheet.create({
  playlistCard: {
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
    margin: 10,
  },
  playlistTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4b7bec",
    marginTop: 8,
    textAlign: "center",
  },
});
