/**
 * MovieGrid component for displaying a grid of movie cards
 * Implements Component Composition pattern using HOCs
 */
import React from 'react';
import { Movie } from '../../types/movie.types';
import MovieCard from '../MovieCard';
import { MovieCardSkeleton } from '../SkeletonLoader';
import NoResults from '../ui/NoResults';
import { BaseProps, WithLoadingProps, WithErrorProps, withLoading, withError } from '../common/BaseComponent';
import { Film } from 'lucide-react';

interface MovieGridProps extends WithLoadingProps, WithErrorProps {
  movies: Movie[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
}

/**
 * Basic MovieGrid component before HOC enhancement
 */
const BaseMovieGrid: React.FC<MovieGridProps> = ({ 
  movies, 
  onLoadMore, 
  hasMore, 
  loadingMore, 
  className 
}) => {
  if (movies.length === 0) {
    return (
      <NoResults
        icon={<Film size={48} />}
        title="No movies found"
        message="Try adjusting your search or filter criteria"
        className={className}
      />
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            className="px-6 py-3 bg-indigo-600 dark:bg-purple-700 text-white rounded-full
                     hover:bg-indigo-700 dark:hover:bg-purple-800 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? 'Loading...' : 'Load More Movies'}
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Loading component for MovieGrid
 */
const MovieGridLoading: React.FC<BaseProps> = ({ className }) => (
  <div className={className}>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

/**
 * Error component for MovieGrid
 */
const MovieGridError: React.FC<BaseProps & { message?: string }> = ({ className, message }) => (
  <NoResults
    icon={<Film size={48} />}
    title="Error"
    message={message || 'Something went wrong. Please try again.'}
    className={className}
  />
);

// Compose HOCs in the correct order and export a valid component
export const MovieGrid = withLoading(
  withError(BaseMovieGrid, MovieGridError),
  MovieGridLoading
);
