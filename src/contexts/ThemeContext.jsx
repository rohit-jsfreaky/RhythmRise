import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Theme definitions
export const themes = {
  // Light Mode Theme - First in list for visibility
  light: {
    name: "Light Mode",
    colors: {
      primary: "#007AFF", // iOS Blue
      secondary: "#5856D6", // iOS Purple
      accent: "#34C759", // iOS Green
      background: "#F2F2F7", // iOS Light background
      surface: "#FFFFFF", // Pure white surfaces
      textPrimary: "#1C1C1E", // iOS Primary label
      textSecondary: "#8E8E93", // iOS Secondary label
      border: "rgba(60, 60, 67, 0.29)", // iOS separator
      gradient: ["rgba(0, 122, 255, 0.1)", "#F2F2F7"], // Light blue to background
      cardGradient: ["rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.7)"],
      activeGradient: ["#007AFF", "#5856D6"], // Blue to purple
      glassBackground: "rgba(255, 255, 255, 0.8)", // Light glass effect
      shadowColor: "rgba(0, 0, 0, 0.1)", // Light shadows
      errorColor: "#FF3B30", // iOS Red
      successColor: "#34C759", // iOS Green
    },
  },
  purple: {
    name: "Purple Galaxy",
    colors: {
      primary: "#7B4DFF",
      secondary: "#18B5FF",
      accent: "#36195B",
      background: "#080B38",
      surface: "#10133E",
      textPrimary: "#F8F9FE",
      textSecondary: "#A0A6B1",
      border: "rgba(255, 255, 255, 0.15)",
      gradient: ["rgba(123, 77, 255, 0.15)", "#080B38"],
      cardGradient: ["rgba(123, 77, 255, 0.2)", "rgba(16, 19, 62, 0.95)"],
      activeGradient: ["#18B5FF", "#7B4DFF"],
      glassBackground: "rgba(255, 255, 255, 0.08)",
      shadowColor: "#7B4DFF",
      errorColor: "#e74c3c",
      successColor: "#2ecc71",
    },
  },
  ocean: {
    name: "Ocean Breeze",
    colors: {
      primary: "#4c7275",
      secondary: "#86b9b0",
      accent: "#052530",
      background: "#041421",
      surface: "#052530",
      textPrimary: "#d1d5d6",
      textSecondary: "#86b9b0",
      border: "rgba(134, 185, 176, 0.15)",
      gradient: ["rgba(76, 114, 117, 0.15)", "#041421"],
      cardGradient: ["rgba(76, 114, 117, 0.2)", "rgba(5, 37, 48, 0.95)"],
      activeGradient: ["#86b9b0", "#4c7275"],
      glassBackground: "rgba(134, 185, 176, 0.08)",
      shadowColor: "#4c7275",
      errorColor: "#e74c3c",
      successColor: "#86b9b0",
    },
  },
  dark: {
    name: "Midnight Black",
    colors: {
      primary: "#1a1a1a",
      secondary: "#333333",
      accent: "#666666",
      background: "#000000",
      surface: "#1a1a1a",
      textPrimary: "#ffffff",
      textSecondary: "#cccccc",
      border: "rgba(255, 255, 255, 0.1)",
      gradient: ["rgba(26, 26, 26, 0.15)", "#000000"],
      cardGradient: ["rgba(26, 26, 26, 0.2)", "rgba(51, 51, 51, 0.95)"],
      activeGradient: ["#333333", "#1a1a1a"],
      glassBackground: "rgba(255, 255, 255, 0.05)",
      shadowColor: "#000000",
      errorColor: "#e74c3c",
      successColor: "#2ecc71",
    },
  },
  sunset: {
    name: "Sunset Glow",
    colors: {
      primary: "#FF6B35",
      secondary: "#F7931E",
      accent: "#FFD23F",
      background: "#1a0e0a",
      surface: "#2d1810",
      textPrimary: "#fff5f0",
      textSecondary: "#ffcc99",
      border: "rgba(255, 107, 53, 0.15)",
      gradient: ["rgba(255, 107, 53, 0.15)", "#1a0e0a"],
      cardGradient: ["rgba(255, 107, 53, 0.2)", "rgba(45, 24, 16, 0.95)"],
      activeGradient: ["#F7931E", "#FF6B35"],
      glassBackground: "rgba(255, 107, 53, 0.08)",
      shadowColor: "#FF6B35",
      errorColor: "#e74c3c",
      successColor: "#2ecc71",
    },
  },
  rose: {
    name: "Rose Garden",
    colors: {
      primary: "#bba6a5",
      secondary: "#5397ae",
      accent: "#a6c6c1",
      background: "#2a1f1e",
      surface: "#3d2f2e",
      textPrimary: "#e6e1ce",
      textSecondary: "#ddbfb5",
      border: "rgba(187, 166, 165, 0.25)",
      gradient: ["rgba(187, 166, 165, 0.20)", "#2a1f1e"],
      cardGradient: ["rgba(187, 166, 165, 0.25)", "rgba(61, 47, 46, 0.95)"],
      activeGradient: ["#5397ae", "#bba6a5"],
      glassBackground: "rgba(187, 166, 165, 0.12)",
      shadowColor: "#bba6a5",
      errorColor: "#d63384",
      successColor: "#a6c6c1",
    },
  },
  // New Modern Apple-inspired Themes
  arctic: {
    name: "Arctic Blue",
    colors: {
      primary: "#007AFF",
      secondary: "#5856D6",
      accent: "#34C759",
      background: "#0A0C0F",
      surface: "#1C1C1E",
      textPrimary: "#FFFFFF",
      textSecondary: "#8E8E93",
      border: "rgba(0, 122, 255, 0.15)",
      gradient: ["rgba(0, 122, 255, 0.15)", "#0A0C0F"],
      cardGradient: ["rgba(0, 122, 255, 0.2)", "rgba(28, 28, 30, 0.95)"],
      activeGradient: ["#007AFF", "#5856D6"],
      glassBackground: "rgba(0, 122, 255, 0.08)",
      shadowColor: "#007AFF",
      errorColor: "#FF3B30",
      successColor: "#34C759",
    },
  },
  graphite: {
    name: "Graphite Pro",
    colors: {
      primary: "#8A8A8E",
      secondary: "#636366",
      accent: "#FF9500",
      background: "#000000",
      surface: "#1C1C1E",
      textPrimary: "#FFFFFF",
      textSecondary: "#8E8E93",
      border: "rgba(138, 138, 142, 0.15)",
      gradient: ["rgba(138, 138, 142, 0.10)", "#000000"],
      cardGradient: ["rgba(138, 138, 142, 0.15)", "rgba(28, 28, 30, 0.95)"],
      activeGradient: ["#8A8A8E", "#636366"],
      glassBackground: "rgba(138, 138, 142, 0.06)",
      shadowColor: "#8A8A8E",
      errorColor: "#FF3B30",
      successColor: "#34C759",
    },
  },
  mint: {
    name: "Mint Fresh",
    colors: {
      primary: "#00C7BE",
      secondary: "#30D158",
      accent: "#64D2FF",
      background: "#0A1514",
      surface: "#1A2621",
      textPrimary: "#FFFFFF",
      textSecondary: "#8FE6DD",
      border: "rgba(0, 199, 190, 0.20)",
      gradient: ["rgba(0, 199, 190, 0.15)", "#0A1514"],
      cardGradient: ["rgba(0, 199, 190, 0.25)", "rgba(26, 38, 33, 0.95)"],
      activeGradient: ["#00C7BE", "#30D158"],
      glassBackground: "rgba(0, 199, 190, 0.10)",
      shadowColor: "#00C7BE",
      errorColor: "#FF453A",
      successColor: "#30D158",
    },
  },
  lavender: {
    name: "Lavender Dream",
    colors: {
      primary: "#BF5AF2",
      secondary: "#AF52DE",
      accent: "#FF2D92",
      background: "#0F0A14",
      surface: "#1F1A24",
      textPrimary: "#FFFFFF",
      textSecondary: "#D1C4E9",
      border: "rgba(191, 90, 242, 0.20)",
      gradient: ["rgba(191, 90, 242, 0.15)", "#0F0A14"],
      cardGradient: ["rgba(191, 90, 242, 0.25)", "rgba(31, 26, 36, 0.95)"],
      activeGradient: ["#BF5AF2", "#AF52DE"],
      glassBackground: "rgba(191, 90, 242, 0.10)",
      shadowColor: "#BF5AF2",
      errorColor: "#FF375F",
      successColor: "#34C759",
    },
  },
  coral: {
    name: "Coral Reef",
    colors: {
      primary: "#FF6B6B",
      secondary: "#FF8E53",
      accent: "#FFAB00",
      background: "#0F0A0A",
      surface: "#2A1F1F",
      textPrimary: "#FFFFFF",
      textSecondary: "#FFB3B3",
      border: "rgba(255, 107, 107, 0.20)",
      gradient: ["rgba(255, 107, 107, 0.15)", "#0F0A0A"],
      cardGradient: ["rgba(255, 107, 107, 0.25)", "rgba(42, 31, 31, 0.95)"],
      activeGradient: ["#FF6B6B", "#FF8E53"],
      glassBackground: "rgba(255, 107, 107, 0.10)",
      shadowColor: "#FF6B6B",
      errorColor: "#FF3B30",
      successColor: "#34C759",
    },
  },
  emerald: {
    name: "Emerald Forest",
    colors: {
      primary: "#50C878",
      secondary: "#40916C",
      accent: "#2D6A4F",
      background: "#081A0F",
      surface: "#1B4332",
      textPrimary: "#FFFFFF",
      textSecondary: "#95D5B2",
      border: "rgba(80, 200, 120, 0.20)",
      gradient: ["rgba(80, 200, 120, 0.15)", "#081A0F"],
      cardGradient: ["rgba(80, 200, 120, 0.25)", "rgba(27, 67, 50, 0.95)"],
      activeGradient: ["#50C878", "#40916C"],
      glassBackground: "rgba(80, 200, 120, 0.10)",
      shadowColor: "#50C878",
      errorColor: "#FF3B30",
      successColor: "#40916C",
    },
  },
  gold: {
    name: "Golden Hour",
    colors: {
      primary: "#FFD700",
      secondary: "#FFA500",
      accent: "#FF8C00",
      background: "#1A1300",
      surface: "#2D2200",
      textPrimary: "#FFFFFF",
      textSecondary: "#FFEC8B",
      border: "rgba(255, 215, 0, 0.20)",
      gradient: ["rgba(255, 215, 0, 0.15)", "#1A1300"],
      cardGradient: ["rgba(255, 215, 0, 0.25)", "rgba(45, 34, 0, 0.95)"],
      activeGradient: ["#FFD700", "#FFA500"],
      glassBackground: "rgba(255, 215, 0, 0.10)",
      shadowColor: "#FFD700",
      errorColor: "#FF3B30",
      successColor: "#34C759",
    },
  },
  steel: {
    name: "Steel Blue",
    colors: {
      primary: "#4682B4",
      secondary: "#5F9EA0",
      accent: "#708090",
      background: "#0A0F14",
      surface: "#1A2530",
      textPrimary: "#FFFFFF",
      textSecondary: "#B0C4DE",
      border: "rgba(70, 130, 180, 0.20)",
      gradient: ["rgba(70, 130, 180, 0.15)", "#0A0F14"],
      cardGradient: ["rgba(70, 130, 180, 0.25)", "rgba(26, 37, 48, 0.95)"],
      activeGradient: ["#4682B4", "#5F9EA0"],
      glassBackground: "rgba(70, 130, 180, 0.10)",
      shadowColor: "#4682B4",
      errorColor: "#FF3B30",
      successColor: "#34C759",
    },
  },
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState("dark"); // Default to light mode
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await SecureStore.getItemAsync("selectedTheme");
      if (savedTheme && themes[savedTheme]) {
        setCurrentTheme(savedTheme);
      }
    } catch (error) {
      console.log("Error loading theme:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeTheme = async (themeName) => {
    try {
      await SecureStore.setItemAsync("selectedTheme", themeName);
      setCurrentTheme(themeName);
    } catch (error) {
      console.log("Error saving theme:", error);
    }
  };

  const theme = themes[currentTheme];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        currentTheme,
        changeTheme,
        themes,
        isLoading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
