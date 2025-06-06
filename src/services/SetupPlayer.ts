import TrackPlayer, { Capability, AppKilledPlaybackBehavior } from 'react-native-track-player';

export const setupPlayer = async () => {
  try {
    const currentState = await TrackPlayer.getState().catch(() => null);

    if (currentState === null) {
      await TrackPlayer.setupPlayer();

      await TrackPlayer.updateOptions({
        android: {
          appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback, // continues playing in background
        },
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
        ],
        alwaysPauseOnInterruption: true,
        notificationCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
      });
    }

    return true;
  } catch (error) {
    console.error('TrackPlayer setup failed:', error);
    return false;
  }
};
