import React from 'react';
import { SunIcon, MoonIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/**
 * ThemeToggle component for switching between light and dark mode.
 * - Follows SRP: Only handles theme toggling UI and action.
 * - Decoupled from theme logic (handled by context).
 */
const ThemeToggle: React.FC = () => {
  // Access theme state and toggle function from context
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors focus:outline-none"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Show sun icon in dark mode, moon icon in light mode */}
      {darkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
    </button>
  );
};

export default ThemeToggle;