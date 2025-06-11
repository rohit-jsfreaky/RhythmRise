import { StyleSheet, View, Animated, Easing } from "react-native";
import React, { useRef, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";

const SongsListSkeletonView = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const { theme } = useTheme();

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [shimmerAnim]);

  const shimmerStyle = {
    opacity: shimmerAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.3, 0.6, 0.3],
    }),
  };

  return (
    <View style={[styles.songItem, { backgroundColor: theme.colors.glassBackground }]}>
      <Animated.View 
        style={[
          styles.skeletonThumbnail, 
          { backgroundColor: theme.colors.border }, 
          shimmerStyle
        ]} 
      />
      <View style={styles.songInfo}>
        <Animated.View 
          style={[
            styles.skeletonTitle, 
            { backgroundColor: theme.colors.border }, 
            shimmerStyle
          ]} 
        />
        <Animated.View 
          style={[
            styles.skeletonDetails, 
            { backgroundColor: theme.colors.border }, 
            shimmerStyle
          ]} 
        />
      </View>
    </View>
  );
};

export default SongsListSkeletonView;

const styles = StyleSheet.create({
  songItem: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginBottom: 8,
    borderRadius: 12,
    alignItems: "center",
  },
  skeletonThumbnail: {
    width: 56,
    height: 56,
    borderRadius: 10,
  },
  songInfo: {
    marginLeft: 16,
    flex: 1,
  },
  skeletonTitle: {
    width: "70%",
    height: 16,
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonDetails: {
    width: "50%",
    height: 12,
    borderRadius: 4,
  },
});