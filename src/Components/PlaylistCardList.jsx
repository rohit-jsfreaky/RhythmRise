import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  FlatList,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

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

  return (
    <View style={styles.container}>
      {playlistColumns.map((column, colIdx) => (
        <View key={colIdx} style={styles.column}>
          {column.map((item) => (
            <View key={item.title} style={styles.cardWrapper}>
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate("Playlist", { title: item.title })}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['rgba(24, 181, 255, 0.2)', 'rgba(123, 77, 255, 0.2)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardGradient}
                >
                  <View style={styles.iconContainer}>
                    <Ionicons name="musical-notes" size={24} color="#7B4DFF" />
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.playlistTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  menuAnim.setValue(0);
                  setMenuOpenFor(item.title);
                }}
                style={styles.menuButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="ellipsis-vertical" size={18} color="#A0A6B1" />
              </TouchableOpacity>

              {menuOpenFor === item.title && (
                <Animated.View
                  style={[
                    styles.menu,
                    {
                      opacity: menuAnim,
                      transform: [
                        {
                          translateY: menuAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setPlaylistToDelete(item.title);
                      setRenameValue(item.title);
                      setShowRenameModal(true);
                      setMenuOpenFor(null);
                    }}
                    style={styles.menuItem}
                  >
                    <Ionicons name="create-outline" size={18} color="#F8F9FE" />
                    <Text style={styles.menuText}>Rename</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => {
                      setPlaylistToDelete(item.title);
                      setShowDeleteModal(true);
                      setMenuOpenFor(null);
                    }}
                    style={styles.menuItem}
                  >
                    <Ionicons name="trash-outline" size={18} color="#e74c3c" />
                    <Text style={[styles.menuText, {color: '#e74c3c'}]}>Delete</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => setMenuOpenFor(null)}
                    style={[styles.menuItem, styles.menuItemBorder]}
                  >
                    <Text style={[styles.menuText, {color: '#A0A6B1'}]}>Cancel</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default PlaylistCardList;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    paddingHorizontal: 6,
  },
  cardWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: "#18B5FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardGradient: {
    borderRadius: 12,
    padding: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  cardContent: {
    marginTop: 4,
  },
  playlistTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F8F9FE",
    marginBottom: 4,
  },
  menuButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  menu: {
    position: "absolute",
    top: 40,
    right: -10,
    width: 140,
    borderRadius: 12,
    backgroundColor: "#10133E",
    overflow: "hidden",
    zIndex: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  menuItemBorder: {
    borderTopWidth: 1,
    borderTopColor: "rgba(160, 166, 177, 0.1)",
  },
  menuText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#F8F9FE",
  },
});
