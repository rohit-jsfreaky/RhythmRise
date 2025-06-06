import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import { setupPlayer } from "./src/services/SetupPlayer";
import TrackPlayer, {
  State,
  usePlaybackState,
} from "react-native-track-player";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./src/Screens/Home/Home";

const Stack = createNativeStackNavigator();
const testSong = {
  id: "1",
  url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // your song URL
  title: "Test Track",
  artist: "Test Artist",
};

export default function App() {
  const [playSetup, setPlaySetup] = useState(false);

  useEffect(() => {
    const playerSet = async () => {
      const isSetup = await setupPlayer();
      if (isSetup) {
        await TrackPlayer.reset(); // Clear any existing queue
        await TrackPlayer.add(testSong); // Add test song
      }
      setPlaySetup(isSetup);
    };
    playerSet();
  }, []);

  if (!playSetup) {
    return (
      <View style={styles.container}>
        <Text>Setting up player...</Text>
      </View>
    );
  }

  console.log("Player setup complete");

  return (
    <NavigationContainer>
      <StatusBar style="dark" />

      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        {/* <Stack.Screen name="Player" component={PlayerScreen} /> */}
      </Stack.Navigator>
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
