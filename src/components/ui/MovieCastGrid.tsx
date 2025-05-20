import React from 'react';
import { User } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface MovieCastGridProps {
  cast: CastMember[];
  limit?: number;
  className?: string;
}

const MovieCastGrid: React.FC<MovieCastGridProps> = ({
  cast,
  limit = 6,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 ${className}`}>
      {cast.slice(0, limit).map(actor => (
        <div key={actor.id} className="text-center">
          <div className="aspect-[3/4] rounded-lg overflow-hidden mb-2">
            <ImageWithFallback
              src={actor.profile_path ? `https://image.tmdb.org/t/p/w300${actor.profile_path}` : ''}
              alt={actor.name}
              className="w-full h-full object-cover"
              fallbackClassName="bg-gray-800"
            />
          </div>
          <h3 className="font-medium line-clamp-1">{actor.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
            {actor.character}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MovieCastGrid;
