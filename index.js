import { registerRootComponent } from "expo";
import TrackPlayer from "react-native-track-player";
import App from "./App";

import { musicPlayerService } from "./musicPlayerService";

registerRootComponent(App);
TrackPlayer.registerPlaybackService(() => musicPlayerService);
