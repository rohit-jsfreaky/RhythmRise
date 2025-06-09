import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TrackPlayer, { useTrackPlayerEvents, Event, useProgress, State } from 'react-native-track-player';
import { Ionicons } from '@expo/vector-icons';

const MiniPlayer = () => {
  const navigation = useNavigation();
  const [track, setTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { position, duration } = useProgress();

  useTrackPlayerEvents([Event.PlaybackTrackChanged, Event.PlaybackState], async (event) => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
      const trackInfo = await TrackPlayer.getTrack(event.nextTrack);
      setTrack(trackInfo);
    } else if (event.type === Event.PlaybackState) {
      const state = await TrackPlayer.getState();
      setIsPlaying(state === State.Playing);
    }
  });

  useEffect(() => {
    const getTrackInfo = async () => {
      try {
        const currentTrack = await TrackPlayer.getCurrentTrack();
        if (currentTrack !== null) {
          const trackInfo = await TrackPlayer.getTrack(currentTrack);
          setTrack(trackInfo);
        }
        
        const state = await TrackPlayer.getState();
        setIsPlaying(state === State.Playing);
      } catch (error) {
        console.log('Error getting track info:', error);
      }
    };

    getTrackInfo();
  }, []);

  const togglePlayback = async (e) => {
    e.stopPropagation();
    const state = await TrackPlayer.getState();
    if (state === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  if (!track) return null;

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => navigation.navigate('Player')}
    >
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progress, 
            { width: `${duration > 0 ? (position / duration) * 100 : 0}%` }
          ]} 
        />
      </View>
      
      <View style={styles.content}>
        <Image source={{ uri: track.artwork }} style={styles.artwork} />
        
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{track.title}</Text>
          <Text style={styles.artist} numberOfLines={1}>{track.artist}</Text>
        </View>
        
        <TouchableOpacity style={styles.playButton} onPress={togglePlayback}>
          <Ionicons name={isPlaying ? "pause" : "play"} size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F2F2F2',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressBar: {
    height: 2,
    backgroundColor: '#E0E0E0',
    width: '100%',
  },
  progress: {
    height: 2,
    backgroundColor: '#1DB954',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  artwork: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  artist: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  playButton: {
    padding: 8,
  },
});

export default MiniPlayer;