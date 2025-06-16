import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const QueueItem = ({
  item,
  index,
  isCurrentTrack,
  handleQueueItemPress,
  queue,
  handleRemoveFromQueue,
  theme,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.queueItem,
        isCurrentTrack && {
          backgroundColor: theme.colors.primary + "20",
          borderColor: theme.colors.primary + "40",
          borderWidth: 1,
        },
      ]}
      onPress={() => handleQueueItemPress(item, index)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.artwork }}
        style={[
          styles.queueItemImage,
          { backgroundColor: theme.colors.accent + "40" },
        ]}
      />

      <View style={styles.queueItemInfo}>
        <Text
          style={[
            styles.queueItemTitle,
            {
              color: theme.colors.textPrimary,
            },
          ]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text
          style={[
            styles.queueItemArtist,
            { color: theme.colors.textSecondary },
          ]}
          numberOfLines={1}
        >
          {item.artist}
        </Text>
      </View>

      <View style={styles.queueItemActions}>
        {isCurrentTrack && (
          <View
            style={[
              styles.nowPlayingIndicator,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            <Ionicons name="musical-note" size={12} color="#FFFFFF" />
          </View>
        )}

        {queue.length > 1 && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveFromQueue(index)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="close"
              size={18}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default QueueItem;

const styles = StyleSheet.create({
  queueItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
    marginTop: 4,
  },
  queueItemImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  queueItemInfo: {
    flex: 1,
    marginRight: 12,
  },
  queueItemTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  queueItemArtist: {
    fontSize: 13,
    opacity: 0.8,
  },
  queueItemActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  nowPlayingIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  removeButton: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
});