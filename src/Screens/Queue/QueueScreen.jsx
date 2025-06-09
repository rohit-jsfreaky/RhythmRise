import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { Ionicons } from '@expo/vector-icons';

const QueueScreen = () => {
  const [queue, setQueue] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);

  useEffect(() => {
    const getQueue = async () => {
      try {
        const tracks = await TrackPlayer.getQueue();
        setQueue(tracks);
        
        const index = await TrackPlayer.getCurrentTrack();
        setCurrentTrackIndex(index);
      } catch (error) {
        console.log('Error getting queue:', error);
      }
    };
    
    getQueue();
    
    // Set up an interval to refresh the queue
    const interval = setInterval(getQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  const skipToTrack = async (index) => {
    try {
      await TrackPlayer.skip(index);
      await TrackPlayer.play();
    } catch (error) {
      console.log('Error skipping to track:', error);
    }
  };

  const removeFromQueue = async (index) => {
    try {
      await TrackPlayer.remove(index);
      // Refresh queue
      const tracks = await TrackPlayer.getQueue();
      setQueue(tracks);
    } catch (error) {
      console.log('Error removing track from queue:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current Queue</Text>
      
      {queue.length === 0 ? (
        <Text style={styles.emptyText}>Queue is empty</Text>
      ) : (
        <FlatList
          data={queue}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item, index }) => (
            <TouchableOpacity 
              style={[
                styles.trackItem, 
                index === currentTrackIndex ? styles.currentTrack : null
              ]}
              onPress={() => skipToTrack(index)}
            >
              <Image source={{ uri: item.artwork }} style={styles.thumbnail} />
              
              <View style={styles.trackInfo}>
                <Text style={styles.trackTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.trackArtist} numberOfLines={1}>{item.artist}</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removeFromQueue(index)}
              >
                <Ionicons name="close-circle-outline" size={24} color="#666" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  currentTrack: {
    backgroundColor: 'rgba(29, 185, 84, 0.1)',
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  trackInfo: {
    flex: 1,
    marginLeft: 12,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  trackArtist: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  removeButton: {
    padding: 8,
  },
});

export default QueueScreen;