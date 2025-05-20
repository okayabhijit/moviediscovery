import React from 'react';
import { Heart } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';
import Badge from './Badge';
import MovieMetadata from './MovieMetadata';
import Button from './Button';

interface MovieHeroProps {
  title: string;
  overview: string;
  backdropPath?: string;
  posterPath?: string;
  releaseDate?: string;
  runtime?: number;
  rating?: number;
  genres: Array<{ id: number; name: string }>;
  isFavorite: boolean;
  onFavoriteClick: () => void;
}

const MovieHero: React.FC<MovieHeroProps> = ({
  title,
  overview,
  backdropPath,
  posterPath,
  releaseDate,
  runtime,
  rating,
  genres,
  isFavorite,
  onFavoriteClick,
}) => {
  return (
    <div 
      className="relative min-h-[60vh] bg-cover bg-center py-12 md:py-16"
      style={{
        backgroundImage: backdropPath 
          ? `linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.9)), 
             url(https://image.tmdb.org/t/p/original${backdropPath})`
          : 'linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.9))'
      }}
    >
      <div className="container mx-auto px-4 h-full flex items-center">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 w-full">
          {/* Poster */}
          <div className="w-48 md:w-64 mx-auto md:mx-0 flex-shrink-0 rounded-lg overflow-hidden shadow-2xl">
            <ImageWithFallback
              src={posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : ''}
              alt={title}
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
          
          {/* Movie Info */}
          <div className="flex-grow flex flex-col py-4">
            <h1 className="text-2xl md:text-4xl font-bold mb-4 text-white">{title}</h1>
            
            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {genres.map(genre => (
                  <Badge key={genre.id} variant="default" size="md">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            )}
            
            <MovieMetadata
              releaseDate={releaseDate}
              runtime={runtime}
              rating={rating}
              className="text-gray-300 mb-4"
            />
            
            <p className="text-gray-300 mb-6 max-w-2xl line-clamp-4 md:line-clamp-none">
              {overview}
            </p>
            
            <div className="mt-auto">
              <Button
                onClick={onFavoriteClick}
                variant={isFavorite ? 'primary' : 'secondary'}
                icon={<Heart fill={isFavorite ? 'currentColor' : 'none'} />}
                className={isFavorite ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieHero;
