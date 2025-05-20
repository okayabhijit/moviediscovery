import React from 'react';
import { Link } from 'react-router-dom';
import { useFilters } from '../context/FilterContext';
import type { Movie } from '../context/MovieContext';
import ImageWithFallback from './ui/ImageWithFallback';
import Badge from './ui/Badge';
import FavoriteButton from './ui/FavoriteButton';
import MovieMetadata from './ui/MovieMetadata';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { genres } = useFilters();
  
  const movieGenres = genres
    .filter(genre => movie.genre_ids.includes(genre.id))
    .slice(0, 2); // Only show first 2 genres

  return (
    <Link to={`/movie/${movie.id}`} className="relative group">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105">
        <ImageWithFallback
          src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
              {movie.title}
            </h3>
            
            {movieGenres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {movieGenres.map(genre => (
                  <Badge key={genre.id} size="sm">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            )}
            
            <MovieMetadata
              releaseDate={movie.release_date}
              rating={movie.vote_average}
              variant="compact"
              className="text-gray-200"
            />
          </div>
        </div>

        <FavoriteButton 
          movie={movie} 
          className="absolute top-2 right-2"
        />
      </div>
    </Link>
  );
};

export default MovieCard;