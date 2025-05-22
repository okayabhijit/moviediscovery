/**
 * Custom hooks for movie data management
 * Implements Observer pattern through React hooks
 */

import { useState, useEffect, useCallback } from 'react';
import { useFilters } from '../context/FilterContext';
import { MovieRepository } from '../services/repositories/MovieRepository';
import { Movie } from '../types/movie.types';

interface UseMovieListReturn {
  movies: Movie[];
  isLoading: boolean;
  error: string | null;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  totalResults: number;
}

/**
 * Custom hook for managing movie list data and pagination
 * Follows Single Responsibility Principle by handling only movie list logic
 */
export const useMovieList = (movieRepository: MovieRepository): UseMovieListReturn => {
  const { searchQuery, selectedGenreId } = useFilters();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  /**
   * Fetches movies based on current filters
   * @param page - Page number to fetch
   * @param append - Whether to append results to existing movies
   */
  const fetchMovies = useCallback(async (page: number, append: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);

      let data;
      if (searchQuery) {
        data = await movieRepository.searchMovies(searchQuery, page);
      } else if (selectedGenreId) {
        data = await movieRepository.getMoviesByGenre(selectedGenreId, page);
      } else {
        data = await movieRepository.getPopularMovies(page);
      }

      setMovies(prev => append ? [...prev, ...data.results] : data.results);
      setTotalResults(data.total_results);
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to fetch movies. Please try again.');
      console.error('Error fetching movies:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedGenreId, movieRepository]);

  // Reset and fetch movies when filters change
  useEffect(() => {
    setCurrentPage(1);
    fetchMovies(1);
  }, [searchQuery, selectedGenreId, fetchMovies]);

  const loadMore = useCallback(async () => {
    if (!isLoading && currentPage * 20 < totalResults) {
      await fetchMovies(currentPage + 1, true);
    }
  }, [currentPage, totalResults, isLoading, fetchMovies]);

  return {
    movies,
    isLoading,
    error,
    loadMore,
    hasMore: currentPage * 20 < totalResults,
    totalResults
  };
};