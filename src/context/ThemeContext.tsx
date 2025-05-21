import React, { useEffect, useState, createContext, useContext } from 'react';
type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};
const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {}
});
export const useTheme = () => useContext(ThemeContext);
export const ThemeProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme));
    } else {
      // Default to light mode for new users
      setDarkMode(false);
      localStorage.setItem('darkMode', 'false');
    }
  }, []);
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  return <ThemeContext.Provider value={{
    darkMode,
    toggleDarkMode
  }}>
      {children}
    </ThemeContext.Provider>;
};