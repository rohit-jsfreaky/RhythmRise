import React, { forwardRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ActionSheet from "react-native-actions-sheet";
import QueueItem from "./QueueItem";

const QueueActionSheet = forwardRef(
  (
    {
      theme,
      queue,
      currentTrackIndex,
      handleQueueItemPress,
      handleRemoveFromQueue,
    },
    ref
  ) => (
    <ActionSheet
      ref={ref}
      containerStyle={{
        backgroundColor: theme.colors.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}
      indicatorStyle={{
        backgroundColor: theme.colors.textSecondary,
        width: 40,
        height: 4,
      }}
      gestureEnabled={true}
      statusBarTranslucent
      drawUnderStatusbar={false}
      defaultOverlayOpacity={0.3}
    >
      <View
        style={[
          styles.actionSheetContent,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        {/* Action Sheet Header */}
        <View
          style={[
            styles.actionSheetHeader,
            { borderBottomColor: theme.colors.border },
          ]}
        >
          <View>
            <Text
              style={[
                styles.actionSheetTitle,
                { color: theme.colors.textPrimary },
              ]}
            >
              Queue
            </Text>
            <Text
              style={[
                styles.actionSheetSubtitle,
                { color: theme.colors.textSecondary },
              ]}
            >
              {queue.length} {queue.length === 1 ? "song" : "songs"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => ref.current?.hide()}
            style={[
              styles.actionSheetCloseButton,
              { backgroundColor: theme.colors.glassBackground },
            ]}
          >
            <Ionicons
              name="close"
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Queue List */}
        <View style={styles.actionSheetBody}>
          {queue.length === 0 ? (
            <View
              style={[
                styles.emptyStateContainer,
                { backgroundColor: theme.colors.glassBackground },
              ]}
            >
              <Ionicons
                name="musical-notes"
                size={48}
                color={theme.colors.textSecondary}
              />
              <Text
                style={[
                  styles.emptyStateTitle,
                  { color: theme.colors.textPrimary },
                ]}
              >
                Queue is Empty
              </Text>
              <Text
                style={[
                  styles.emptyStateSubtitle,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Add songs to see them here
              </Text>
            </View>
          ) : (
            <FlatList
              data={queue}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              renderItem={({ item, index }) => (
                <QueueItem
                  item={item}
                  index={index}
                  isCurrentTrack={index === currentTrackIndex}
                  handleQueueItemPress={handleQueueItemPress}
                  queue={queue}
                  handleRemoveFromQueue={handleRemoveFromQueue}
                  theme={theme}
                />
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.queueList}
            />
          )}
        </View>
      </View>
    </ActionSheet>
  )
);

export default QueueActionSheet;

const styles = StyleSheet.create({
  actionSheetContent: {
    minHeight: 400,
    maxHeight: "80%",
  },
  actionSheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  actionSheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  actionSheetSubtitle: {
    fontSize: 13,
    opacity: 0.8,
  },
  actionSheetCloseButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  actionSheetBody: {
    flex: 1,
  },
  queueList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    padding: 40,
    margin: 20,
    minHeight: 200,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.7,
  },
});