import TrackPlayer, { Capability, AppKilledPlaybackBehavior } from 'react-native-track-player';

export const setupPlayer = async () => {
  try {
    await TrackPlayer.setupPlayer({
      // Better buffer size for streaming
      minBuffer: 15, // Default is 15
      maxBuffer: 50, // Default is 50
      playBuffer: 2.5, // Default is 2.5
      backBuffer: 0, // Default is 0
      // Auto update metadata when track changes
      updateMetadataInterval: 5, // Every 5 seconds
      // Better audio quality
      iosCategory: 'playback',
      iosCategoryMode: 'default',
      iosCategoryOptions: ['allowBluetooth', 'allowBluetoothA2DP', 'mixWithOthers'],
      androidAudioContentType: 'music',
      androidAudioAttributes: [
        {
          usage: 'media',
          contentType: 'music',
        },
      ],
    });

    await TrackPlayer.updateOptions({
      // Media controls capabilities
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
        Capability.SeekTo,
      ],
      // Capabilities that will show up when the notification is in the compact form on Android
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      // Continue playback when app is in background
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
      // Controls the audio focus behavior in Android
      androidAudioFocus: {
        duckSensitivity: 'high',
        pauseWhenInterrupted: true,
      },
    });

    return true;
  } catch (e) {
    console.log('Error setting up player:', e);
    return false;
  }
};
