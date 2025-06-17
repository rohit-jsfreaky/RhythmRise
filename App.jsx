import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { setupPlayer } from "./src/services/SetupPlayer";
import TrackPlayer, { State } from "react-native-track-player";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MenuProvider } from "react-native-popup-menu";
import Tabs from "./src/Screens/Tabs/Tabs";
import Favorites from "./src/Screens/Favorites/Favorites";
import ArtistSongs from "./src/Screens/Artist/ArtistSongs";
import PlayerScreen from "./src/Screens/Player/PlayerScreen";
import MiniPlayer from "./src/Components/MiniPlayer";
import { ThemeProvider, useTheme } from "./src/contexts/ThemeContext";
import Playlist from "./src/Screens/Playlist/Playlist";
import TrendingSongs from "./src/Screens/TrendingSongs/TrendingSongs";

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
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Text style={{ color: theme.colors.textPrimary }}>
          Setting up player...
        </Text>
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
            name="ArtistSongs"
            component={ArtistSongs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Player"
            component={PlayerScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Playlist"
            component={Playlist}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Trending"
            component={TrendingSongs}
            options={{ headerShown: false }}
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
