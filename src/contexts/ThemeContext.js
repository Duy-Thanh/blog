import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const themes = {
    light: {
      '--primary-color': '#ffffff',
      '--secondary-color': '#f8f9fa',
      '--text-color': '#2c3e50',
      '--text-secondary': '#6c757d',
      '--accent-color': '#2ADFFF',
      '--accent-hover': '#1fb8d4',
      '--background-color': '#f8f9fa',
      '--card-background': '#ffffff',
      '--border-color': 'rgba(0, 0, 0, 0.1)',
      '--box-shadow': '0 4px 20px rgba(0, 0, 0, 0.08)',
      '--glass-border': 'rgba(255, 255, 255, 0.3)',
      '--progress-background': 'rgba(0, 0, 0, 0.1)',
      '--card-padding': '1.5rem',
      '--border-radius': '12px',
      '--accent-rgb': '42, 223, 255',
      '--text-on-accent': '#1a1a1a'
    },
    dark: {
      '--primary-color': '#1a1a1a',
      '--secondary-color': '#2d2d2d',
      '--text-color': '#ffffff',
      '--text-secondary': '#b3b3b3',
      '--accent-color': '#2ADFFF',
      '--accent-hover': '#1fb8d4',
      '--background-color': '#121212',
      '--card-background': '#1E1E1E',
      '--border-color': 'rgba(255, 255, 255, 0.1)',
      '--box-shadow': '0 4px 20px rgba(0, 0, 0, 0.3)',
      '--glass-border': 'rgba(255, 255, 255, 0.1)',
      '--progress-background': 'rgba(255, 255, 255, 0.1)',
      '--card-padding': '1.5rem',
      '--border-radius': '12px',
      '--accent-rgb': '42, 223, 255',
      '--text-on-accent': '#1a1a1a'
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    const colors = themes[theme];
    Object.entries(colors).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 