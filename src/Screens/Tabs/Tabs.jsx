import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Feather } from "@expo/vector-icons";
import HomeScreen from "../Home/HomeScreen";
import SearchScreen from "../SearchScreen/SearchScreen";
import PlayerScreen from "../Player/PlayerScreen";
import LibraryScreen from "../LibraryScreen/LibraryScreen";

const Tab = createMaterialTopTabNavigator();

const ProfileScreen = () => (
  <View style={styles.screen}>
    <Text>Profile Screen</Text>
  </View>
);

// Custom Tab Bar
function MyTabBar({ state, descriptors, navigation, position }) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const icons = {
          Home: "home",
          Search: "search",
          Player: "play-circle",
          Library: "music",
          Profile: "user",
        };

        const onPress = () => {
          if (!isFocused) navigation.navigate(route.name);
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            onPress={onPress}
            activeOpacity={1}
            style={styles.tabButton}
          >
            <View
              style={[
                styles.iconWrapper,
                isFocused && styles.iconActive, // only icon bg when active
              ]}
            >
              <Feather
                name={icons[route.name]}
                size={22}
                color={isFocused ? "#fff" : "#555"}
              />
            </View>
            <Text
              style={{ color: isFocused ? "#4b7bec" : "#555", fontSize: 10 }}
            >
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const Tabs = () => {
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      swipeEnabled
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
  screen: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  tabActive: {
    backgroundColor: "#4b7bec", // Highlight background for active tab
  },
  iconWrapper: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: "transparent", // default no color
  },

  iconActive: {
    backgroundColor: "#4b7bec", // active circle bg
  },
});
