import React from 'react';
import { SunIcon, MoonIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
const ThemeToggle: React.FC = () => {
  const {
    darkMode,
    toggleDarkMode
  } = useTheme();
  return <button onClick={toggleDarkMode} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors focus:outline-none" aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
      {darkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
    </button>;
};
export default ThemeToggle;