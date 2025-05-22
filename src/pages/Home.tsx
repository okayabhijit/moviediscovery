/**
 * Home page component
 * Implements Container Pattern by managing state and layout
 * Follows Single Responsibility Principle by delegating UI components
 */
import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import GenreButtons from '../components/GenreButtons';
import { MovieGrid } from '../components/ui/MovieGrid';
import { WelcomeScreen } from '../components/ui/WelcomeScreen';
import { useMovies } from '../context/MovieContext';
import { useTheme } from '../context/ThemeContext';
import { useFilters } from '../context/FilterContext';

const Home: React.FC = () => {
  const { displayedMovies, loadMore, hasMore, loadingMore, setHasStartedBrowsing, isLoading } = useMovies();
  const { searchQuery, selectedGenreId } = useFilters();
  const { darkMode } = useTheme();
  const [showWelcome, setShowWelcome] = useState(() => {
    // Check if user has seen welcome screen before
    return localStorage.getItem('hasSeenWelcome') !== 'true';
  });

  // Hide welcome screen when user interacts with search or genre filters
  useEffect(() => {
    if (showWelcome && (searchQuery || selectedGenreId !== null)) {
      setShowWelcome(false);
      localStorage.setItem('hasSeenWelcome', 'true');
      setHasStartedBrowsing(true);
    }
  }, [searchQuery, selectedGenreId, showWelcome, setHasStartedBrowsing]);

  const handleStartBrowsing = () => {
    setShowWelcome(false);
    localStorage.setItem('hasSeenWelcome', 'true');
    setHasStartedBrowsing(true); // This will trigger the movie fetch in MovieContext
  };

  return (
    <main className={`flex-grow w-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <SearchBar />
        </div>
        <GenreButtons />

        {showWelcome ? (
          <WelcomeScreen onStart={handleStartBrowsing} />
        ) : (
          <MovieGrid
            movies={displayedMovies}
            isLoading={isLoading}
            hasMore={hasMore}
            loadingMore={loadingMore}
            onLoadMore={loadMore}
          />
        )}
      </div>
    </main>
  );
};

export default Home;