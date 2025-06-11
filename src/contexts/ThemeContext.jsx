import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme definitions
export const themes = {
  purple: {
    name: 'Purple Galaxy',
    colors: {
      primary: '#7B4DFF',
      secondary: '#18B5FF',
      accent: '#36195B',
      background: '#080B38',
      surface: '#10133E',
      textPrimary: '#F8F9FE',
      textSecondary: '#A0A6B1',
      border: 'rgba(255, 255, 255, 0.15)',
      gradient: ['rgba(123, 77, 255, 0.15)', '#080B38'],
      cardGradient: ['rgba(123, 77, 255, 0.2)', 'rgba(16, 19, 62, 0.95)'],
      activeGradient: ['#18B5FF', '#7B4DFF'],
      glassBackground: 'rgba(255, 255, 255, 0.08)',
      shadowColor: '#7B4DFF',
      errorColor: '#e74c3c',
      successColor: '#2ecc71',
    }
  },
  ocean: {
    name: 'Ocean Breeze',
    colors: {
      primary: '#4c7275',
      secondary: '#86b9b0',
      accent: '#052530',
      background: '#041421',
      surface: '#052530',
      textPrimary: '#d1d5d6',
      textSecondary: '#86b9b0',
      border: 'rgba(134, 185, 176, 0.15)',
      gradient: ['rgba(76, 114, 117, 0.15)', '#041421'],
      cardGradient: ['rgba(76, 114, 117, 0.2)', 'rgba(5, 37, 48, 0.95)'],
      activeGradient: ['#86b9b0', '#4c7275'],
      glassBackground: 'rgba(134, 185, 176, 0.08)',
      shadowColor: '#4c7275',
      errorColor: '#e74c3c',
      successColor: '#86b9b0',
    }
  },
  dark: {
    name: 'Midnight Black',
    colors: {
      primary: '#1a1a1a',
      secondary: '#333333',
      accent: '#666666',
      background: '#000000',
      surface: '#1a1a1a',
      textPrimary: '#ffffff',
      textSecondary: '#cccccc',
      border: 'rgba(255, 255, 255, 0.1)',
      gradient: ['rgba(26, 26, 26, 0.15)', '#000000'],
      cardGradient: ['rgba(26, 26, 26, 0.2)', 'rgba(51, 51, 51, 0.95)'],
      activeGradient: ['#333333', '#1a1a1a'],
      glassBackground: 'rgba(255, 255, 255, 0.05)',
      shadowColor: '#000000',
      errorColor: '#e74c3c',
      successColor: '#2ecc71',
    }
  },
  sunset: {
    name: 'Sunset Glow',
    colors: {
      primary: '#FF6B35',
      secondary: '#F7931E',
      accent: '#FFD23F',
      background: '#1a0e0a',
      surface: '#2d1810',
      textPrimary: '#fff5f0',
      textSecondary: '#ffcc99',
      border: 'rgba(255, 107, 53, 0.15)',
      gradient: ['rgba(255, 107, 53, 0.15)', '#1a0e0a'],
      cardGradient: ['rgba(255, 107, 53, 0.2)', 'rgba(45, 24, 16, 0.95)'],
      activeGradient: ['#F7931E', '#FF6B35'],
      glassBackground: 'rgba(255, 107, 53, 0.08)',
      shadowColor: '#FF6B35',
      errorColor: '#e74c3c',
      successColor: '#2ecc71',
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('purple');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await SecureStore.getItemAsync('selectedTheme');
      if (savedTheme && themes[savedTheme]) {
        setCurrentTheme(savedTheme);
      }
    } catch (error) {
      console.log('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeTheme = async (themeName) => {
    try {
      await SecureStore.setItemAsync('selectedTheme', themeName);
      setCurrentTheme(themeName);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  const theme = themes[currentTheme];

  return (
    <ThemeContext.Provider value={{
      theme,
      currentTheme,
      changeTheme,
      themes,
      isLoading
    }}>
      {children}
    </ThemeContext.Provider>
  );
};