import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import TrackPlayer, { useTrackPlayerEvents, Event, useProgress } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';

const PlayerScreen = () => {
  const { position, duration } = useProgress();
  const [track, setTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [wasPlayingBeforeSeek, setWasPlayingBeforeSeek] = useState(false);

  useTrackPlayerEvents([Event.PlaybackTrackChanged, Event.PlaybackState], async (event) => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
      const trackInfo = await TrackPlayer.getTrack(event.nextTrack);
      setTrack(trackInfo);
    } else if (event.type === Event.PlaybackState) {
      const state = await TrackPlayer.getState();
      setIsPlaying(state === 'playing');
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
        setIsPlaying(state === 'playing');
      } catch (error) {
        console.log('Error getting track info:', error);
      }
    };

    getTrackInfo();
  }, []);

  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  const handleSeekStart = async () => {
    // Store current playing state before seeking
    const state = await TrackPlayer.getState();
    setWasPlayingBeforeSeek(state === 'playing');
    setIsSeeking(true);
  };

  const handleSeekComplete = async (value) => {
    await TrackPlayer.seekTo(value);
    
    // Resume playback if it was playing before seek
    if (wasPlayingBeforeSeek) {
      await TrackPlayer.play();
    }
    
    setIsSeeking(false);
  };

  const togglePlayback = async () => {
    const state = await TrackPlayer.getState();
    if (state === 'playing') {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  if (!track) return null;

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: track.artwork }} style={styles.artwork} />
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>{track.title}</Text>
        <Text style={styles.artist}>{track.artist}</Text>
      </View>
      
      <View style={styles.controlsContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration > 0 ? duration : 0.001}
          value={position}
          onSlidingStart={handleSeekStart}
          onSlidingComplete={handleSeekComplete}
          minimumTrackTintColor="#1DB954"
          maximumTrackTintColor="#D3D3D3"
          thumbTintColor="#1DB954"
        />
        
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.controlButton} onPress={() => TrackPlayer.skipToPrevious()}>
            <Ionicons name="play-skip-back" size={28} color="#333" />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.controlButton, styles.playButton]} onPress={togglePlayback}>
            <Ionicons name={isPlaying ? "pause" : "play"} size={40} color="#FFF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton} onPress={() => TrackPlayer.skipToNext()}>
            <Ionicons name="play-skip-forward" size={28} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  artwork: {
    width: 280,
    height: 280,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  artist: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  controlsContainer: {
    marginTop: 40,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -10,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  controlButton: {
    marginHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    backgroundColor: '#1DB954',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PlayerScreen;