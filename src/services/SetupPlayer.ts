import TrackPlayer, {
  Capability,
  AppKilledPlaybackBehavior,
  IOSCategory,
  IOSCategoryMode,
  IOSCategoryOptions,
  AndroidAudioContentType,
} from "react-native-track-player";

export const setupPlayer = async () => {
  try {


    await TrackPlayer.setupPlayer({
      // Better buffer size for streaming
      minBuffer: 15, // Default is 15
      maxBuffer: 50, // Default is 50
      playBuffer: 2.5, // Default is 2.5
      backBuffer: 0, // Default is 0
      // Better audio quality
      iosCategory: IOSCategory.Playback,
      iosCategoryMode: IOSCategoryMode.Default,
      iosCategoryOptions: [
        IOSCategoryOptions.AllowBluetooth,
        IOSCategoryOptions.AllowBluetoothA2DP,
        IOSCategoryOptions.MixWithOthers,
      ],
      androidAudioContentType: AndroidAudioContentType.Music,
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
        Capability.SeekTo
      ],
      // Continue playback when app is in background
      android: {
        appKilledPlaybackBehavior:
          AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        alwaysPauseOnInterruption: true,
      },
    });

    return true;
  } catch (e) {
    console.log("Error setting up player:", e);
    return false;
  }
};
