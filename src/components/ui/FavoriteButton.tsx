import React from 'react';
import { Heart } from 'lucide-react';
import { useMovies } from '../../context/MovieContext';
import type { Movie } from '../../context/MovieContext';

interface FavoriteButtonProps {
  movie: Movie;
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ movie, className = '' }) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useMovies();
  const isMovieFavorite = isFavorite(movie.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent triggering parent link clicks
    if (isMovieFavorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full transition-colors duration-300 ${
        isMovieFavorite 
          ? 'bg-red-500 text-white' 
          : 'bg-gray-800/80 text-gray-200 hover:bg-red-500 hover:text-white'
      } ${className}`}
      aria-label={isMovieFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart size={20} fill={isMovieFavorite ? 'currentColor' : 'none'} />
    </button>
  );
};

export default FavoriteButton;
