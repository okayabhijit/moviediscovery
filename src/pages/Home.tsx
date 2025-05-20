import React, { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import GenreButtons from '../components/GenreButtons';
import MovieCard from '../components/MovieCard';
import { MovieCardSkeleton } from '../components/SkeletonLoader';
import { useMovies } from '../context/MovieContext';
import { useTheme } from '../context/ThemeContext';
import { useFilters } from '../context/FilterContext';
import { Loader2Icon, Film } from 'lucide-react';

const Home: React.FC = () => {
  const { displayedMovies, filteredMovies, loadMore, hasMore, loadingMore } = useMovies();
  const { searchQuery, selectedGenreId } = useFilters();
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(() => {
    // Check if user has seen welcome screen before
    return localStorage.getItem('hasSeenWelcome') !== 'true';
  });

  // Hide welcome screen when user interacts with search or genre filters
  useEffect(() => {
    if (showWelcome && (searchQuery || selectedGenreId !== null)) {
      setShowWelcome(false);
      localStorage.setItem('hasSeenWelcome', 'true');
    }
  }, [searchQuery, selectedGenreId, showWelcome]);

  useEffect(() => {
    // Reset loading when movies are loaded or filtered
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleStartBrowsing = () => {
    setShowWelcome(false);
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  return (
    <main className={`flex-grow w-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-6">
        <SearchBar />
        <GenreButtons />

        {showWelcome ? (
          <div className="text-center py-16">
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold mb-4 dark:text-white">Welcome to MovieMagic</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">
                Discover and explore your favorite movies. Use the search bar to find specific titles, actors or
                browse by genres, or build your personal collection of favorites.
              </p>
              <button
                onClick={handleStartBrowsing}
                className="px-8 py-4 bg-indigo-600 dark:bg-purple-700 text-white rounded-full 
                         hover:bg-indigo-700 dark:hover:bg-purple-800 transition-colors
                         text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                Start Browsing Movies
              </button>
            </div>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <MovieCardSkeleton key={i} />)}
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="text-center py-10">
            <h2 className="text-2xl font-semibold mb-2">No movies found</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayedMovies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button 
                  onClick={loadMore} 
                  disabled={loadingMore}
                  className="px-6 py-3 bg-indigo-600 dark:bg-purple-700 text-white rounded-full
                           hover:bg-indigo-700 dark:hover:bg-purple-800 transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loadingMore ? (
                    <>
                      <Loader2Icon className="animate-spin" size={20} />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <span>Load More Movies</span>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Home;