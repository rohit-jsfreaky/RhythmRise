import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import TrackPlayer, { usePlaybackState, useProgress, useActiveTrack } from 'react-native-track-player';

const { width } = Dimensions.get('window');

const MiniPlayer = ({ translateY }) => {
  const navigation = useNavigation();
  const track = useActiveTrack();
  const { state } = usePlaybackState();
  const { position, duration } = useProgress();
  
  const isPlaying = state === 'playing';
  
  const togglePlayback = async (e) => {
    e.stopPropagation(); // Prevent navigation when tapping play button
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };
  
  const navigateToPlayer = () => {
    navigation.navigate('Player');
  };
  
  if (!track) return null;
  
  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ translateY: translateY || 0 }] }
      ]}
    >
      <LinearGradient
        colors={['#10133E', '#36195B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progress, 
              { width: `${(position / (duration || 1)) * 100}%` }
            ]} 
          />
        </View>
        
        {/* Main Content */}
        <TouchableOpacity 
          style={styles.content}
          activeOpacity={0.9}
          onPress={navigateToPlayer}
        >
          {/* Artwork */}
          <View style={styles.artworkContainer}>
            <Image source={{ uri: track.artwork }} style={styles.artwork} />
          </View>
          
          {/* Track Info */}
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>{track.title}</Text>
            <Text style={styles.artist} numberOfLines={1}>{track.artist}</Text>
          </View>
          
          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity 
              onPress={togglePlayback}
              style={styles.playButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons 
                name={isPlaying ? 'pause' : 'play'} 
                size={20} 
                color="#F8F9FE" 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={(e) => {
                e.stopPropagation();
                // Add to favorites or show menu
              }}
              style={styles.menuButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons 
                name="ellipsis-vertical" 
                size={18} 
                color="#A0A6B1" 
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: 70,
    overflow: 'hidden',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    marginBottom: -1, // Slight overlap with tab bar for seamless look
  },
  gradient: {
    flex: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  progressBar: {
    height: 3,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progress: {
    height: '100%',
    backgroundColor: '#18B5FF',
    borderRadius: 1.5,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  artworkContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#7B4DFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  artwork: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    color: '#F8F9FE',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  artist: {
    color: '#A0A6B1',
    fontSize: 13,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(123, 77, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  menuButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MiniPlayer;