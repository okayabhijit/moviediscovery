import React from 'react';
import { Link } from 'react-router-dom';
import { useMovies } from '../context/MovieContext';
import ThemeToggle from './ThemeToggle';
import { HeartIcon, FilmIcon } from 'lucide-react';

const Header: React.FC = () => {
  const { favorites } = useMovies();
  
  return (
    <header className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-900 dark:to-purple-900 text-white py-4 px-4 sm:px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <FilmIcon size={28} />
          <span className="text-2xl font-bold hidden sm:inline">MovieMagic</span>
        </Link>
        
        <div className="flex items-center gap-3 sm:gap-6">
          <Link 
            to="/favorites" 
            className="flex items-center hover:text-pink-200 transition-colors"
          >
            <button className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-full ${
              favorites.length > 0 ? 'bg-pink-500 dark:bg-pink-600' : 'bg-white/20 hover:bg-white/30'
            } transition-colors`}
            >
              <HeartIcon size={20} fill="white" />
              <span className="hidden sm:inline">Favorites</span>
              {favorites.length > 0 && (
                <span className="bg-white text-purple-600 rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm font-bold">
                  {favorites.length}
                </span>
              )}
            </button>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;