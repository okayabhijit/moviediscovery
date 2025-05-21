import React, { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';
import { MovieCardSkeleton } from '../components/SkeletonLoader';
import { useMovies } from '../context/MovieContext';
import { Heart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import NavBar from '../components/NavBar';
import NoResults from '../components/ui/NoResults';
import { Movie } from '../context/MovieContext';

const Favorites: React.FC = () => {
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  let favorites: Movie[] = [];

  try {
    favorites = useMovies().favorites;
  } catch (err) {
    if (!error) {
      setError('Something went wrong. Please try again later.');
    }
  }

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return (
      <main className={`flex-grow w-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
        <NavBar
          title="Your Favorites"
          icon={<Heart size={24} className="text-pink-500" fill="currentColor" />}
        />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-red-500">{error}</p>
          <NoResults
            icon={<Heart size={48} />}
            title="Something went wrong"
            message="Please try again later"
            actionLabel="Browse Movies"
            actionLink="/"
          />
        </div>
      </main>
    );
  }

  return (
    <main className={`flex-grow w-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <NavBar
        title="Your Favorites"
        icon={<Heart size={24} className="text-pink-500" fill="currentColor" />}
      />
      
      <div className="container mx-auto px-4 pb-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <MovieCardSkeleton key={i} />)}
          </div>
        ) : favorites.length === 0 ? (
          <NoResults
            icon={<Heart size={48} />}
            title="No favorites yet"
            message="Start adding movies to your favorites!"
            actionLabel="Browse Movies"
            actionLink="/"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map(movie => <MovieCard key={movie.id} movie={movie} />)}
          </div>
        )}
      </div>
    </main>
  );
};

export default Favorites;