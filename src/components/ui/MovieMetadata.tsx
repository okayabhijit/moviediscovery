import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import Rating from './Rating';

interface MovieMetadataProps {
  releaseDate?: string;
  runtime?: number;
  rating?: number;
  className?: string;
  variant?: 'default' | 'compact';
}

const MovieMetadata: React.FC<MovieMetadataProps> = ({
  releaseDate,
  runtime,
  rating,
  className = '',
  variant = 'default',
}) => {
  const year = releaseDate 
    ? new Date(releaseDate).getFullYear() 
    : undefined;

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 text-sm ${className}`}>
        {year && <span>{year}</span>}
        {rating !== undefined && (
          <>
            <span>•</span>
            <Rating value={rating} />
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-4 items-center ${className}`}>
      {year && (
        <div className="flex items-center gap-2">
          <Calendar size={20} />
          <span>{year}</span>
        </div>
      )}
      {runtime && (
        <div className="flex items-center gap-2">
          <Clock size={20} />
          <span>{runtime} min</span>
        </div>
      )}
      {rating !== undefined && (
        <Rating value={rating} />
      )}
    </div>
  );
};

export default MovieMetadata;
