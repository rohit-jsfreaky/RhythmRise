import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { setupPlayer } from "./src/services/SetupPlayer";
import TrackPlayer, { State } from "react-native-track-player";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/Screens/Home/HomeScreen";
import PlayerScreen from "./src/Screens/Player/PlayerScreen";
import QueueScreen from "./src/Screens/Queue/QueueScreen";
import MiniPlayer from "./src/Components/MiniPlayer";

const Stack = createNativeStackNavigator();

export default function App() {
  const [playSetup, setPlaySetup] = useState(false);
  const [isTrackActive, setIsTrackActive] = useState(false);

  useEffect(() => {
    const playerSet = async () => {
      const isSetup = await setupPlayer();
      setPlaySetup(isSetup);
    };
    playerSet();

    // Check if a track is active
    const checkTrackStatus = async () => {
      const currentTrack = await TrackPlayer.getCurrentTrack();
      setIsTrackActive(currentTrack !== null);
    };

    const interval = setInterval(checkTrackStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!playSetup) {
    return (
      <View style={styles.container}>
        <Text>Setting up player...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Rhythm Rise" }}
        />
        <Stack.Screen
          name="Player"
          component={PlayerScreen}
          options={{ title: "Now Playing" }}
        />
        <Stack.Screen
          name="Queue"
          component={QueueScreen}
          options={{ title: "Queue" }}
        />
      </Stack.Navigator>

      {isTrackActive && <MiniPlayer />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
