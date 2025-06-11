import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { setupPlayer } from "./src/services/SetupPlayer";
import TrackPlayer, { State } from "react-native-track-player";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MenuProvider } from "react-native-popup-menu";
import QueueScreen from "./src/Screens/Queue/QueueScreen";
import MiniPlayer from "./src/Components/MiniPlayer";
import Tabs from "./src/Screens/Tabs/Tabs";
import Favorites from "./src/Screens/Favorites/Favorites";
import Playlist from "./src/Screens/Playlist/Playlist";
import { ThemeProvider, useTheme } from "./src/contexts/ThemeContext";

const Stack = createNativeStackNavigator();

function AppContent() {
  const [playSetup, setPlaySetup] = useState(false);
  const [isTrackActive, setIsTrackActive] = useState(false);
  const { theme, isLoading } = useTheme();

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

  if (isLoading || !playSetup) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.textPrimary }}>Setting up player...</Text>
      </View>
    );
  }

  return (
    <MenuProvider>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor={theme.colors.background} />
        <Stack.Navigator initialRouteName="Tabs">
          <Stack.Screen
            name="Tabs"
            component={Tabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Favorites"
            component={Favorites}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Playlist"
            component={Playlist}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Queue"
            component={QueueScreen}
            options={{ title: "Queue" }}
          />
        </Stack.Navigator>

        {/* {isTrackActive && <MiniPlayer />} */}
      </NavigationContainer>
    </MenuProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
