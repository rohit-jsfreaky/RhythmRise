import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../contexts/ThemeContext";
import HomeScreen from "../Home/HomeScreen";
import SearchScreen from "../SearchScreen/SearchScreen";
import PlayerScreen from "../Player/PlayerScreen";
import LibraryScreen from "../LibraryScreen/LibraryScreen";
import ProfileScreen from "../ProfileScreen/ProfileScreen";

const Tab = createMaterialTopTabNavigator();

// Custom Tab Bar
function MyTabBar({ state, navigation }) {
  const { theme } = useTheme();

  return (
    <View style={styles.tabBarWrapper}>
      <View
        style={[
          styles.tabBarContainer,
          {
            shadowColor: theme.colors.shadowColor,
          },
        ]}
      >
        {/* Glassmorphism Background */}
        <BlurView intensity={100} tint="dark" style={styles.glassBackground}>
          <LinearGradient
            colors={theme.colors.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.glassGradient,
              { borderColor: theme.colors.border },
            ]}
          >
            <View style={styles.tabBar}>
              {state.routes.map((route, index) => {
                const isFocused = state.index === index;

                const icons = {
                  Home: isFocused ? "home" : "home-outline",
                  Search: isFocused ? "search" : "search-outline",
                  Player: isFocused ? "musical-notes" : "musical-notes-outline",
                  Library: isFocused ? "library" : "library-outline",
                  Profile: isFocused ? "person" : "person-outline",
                };

                const onPress = () => {
                  if (!isFocused) navigation.navigate(route.name);
                };

                return (
                  <TouchableOpacity
                    key={route.key}
                    accessibilityRole="button"
                    onPress={onPress}
                    activeOpacity={0.7}
                    style={styles.tabButton}
                  >
                    <View
                      style={[
                        styles.iconWrapper,
                        isFocused && styles.iconActive,
                      ]}
                    >
                      {isFocused && (
                        <LinearGradient
                          colors={theme.colors.activeGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={[
                            styles.activeBackground,
                            {
                              shadowColor: theme.colors.secondary,
                            },
                          ]}
                        />
                      )}
                      <Ionicons
                        name={icons[route.name]}
                        size={20}
                        color={
                          isFocused
                            ? theme.colors.textPrimary
                            : theme.colors.textPrimary + "99" // 60% opacity
                        }
                        style={{ zIndex: 1 }}
                      />
                    </View>

                    <Text
                      style={[
                        styles.tabLabel,
                        { color: theme.colors.textPrimary + "99" }, // 60% opacity
                        isFocused && [
                          styles.tabLabelActive,
                          {
                            color: theme.colors.textPrimary,
                            textShadowColor:
                              theme.colors.secondary + "66", // 40% opacity
                          },
                        ],
                      ]}
                    >
                      {route.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Glass reflection effect */}
            <View style={styles.glassReflection} />
          </LinearGradient>
        </BlurView>

        {/* Border highlight */}
        <View
          style={[
            styles.borderHighlight,
            { borderColor: theme.colors.border },
          ]}
        />
      </View>
    </View>
  );
}

const Tabs = () => {
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      swipeEnabled={false}
      tabBar={(props) => <MyTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Player" component={PlayerScreen} />
      <Tab.Screen name="Library" component={LibraryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default Tabs;

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: "relative",
    backgroundColor: "transparent",
  },
  tabBarContainer: {
    position: "absolute",
    bottom: 10,
    left: 20,
    right: 20,
    borderRadius: 28,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20,
  },
  glassBackground: {
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  glassGradient: {
    borderRadius: 28,
    borderWidth: 1,
    overflow: "hidden",
  },
  glassReflection: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "40%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  borderHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 28,
    borderWidth: 1,
    pointerEvents: "none",
  },
  tabBar: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: "transparent",
    borderRadius: 28,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    position: "relative",
  },
  iconWrapper: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    marginBottom: 4,
    backgroundColor: "transparent",
    position: "relative",
    overflow: "hidden",
  },
  activeBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  iconActive: {
    transform: [{ scale: 1.05 }],
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginBottom: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  tabLabelActive: {
    fontWeight: "700",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
