import React, { useEffect, useState, createContext, useContext, useCallback } from 'react';
import { useFilters } from './FilterContext';
import { MovieRepository } from '../services/repositories/MovieRepository';
import { MovieAPI } from '../services/api/movieApi';
import { createTMDBClient } from '../services/api/tmdbClient';
import { Movie } from '../types/movie.types';

/**
 * Context value interface for movies.
 */
export interface MovieContextType {
  movies: Movie[];
  favorites: Movie[];
  addToFavorites: (movie: Movie) => void;
  removeFromFavorites: (id: number) => void;
  isFavorite: (id: number) => boolean;
  filteredMovies: Movie[];
  displayedMovies: Movie[];
  loadMore: () => void;
  hasMore: boolean;
  loadingMore: boolean;
  totalResults: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  setHasStartedBrowsing: (value: boolean) => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

/**
 * Custom hook to access the MovieContext.
 */
export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) throw new Error('useMovies must be used within a MovieProvider');
  return context;
};

/**
 * MovieProvider component that supplies movie data and actions to its children.
 * Uses the Repository pattern for data access and manages favorites in localStorage.
 */
export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { searchQuery, selectedGenreId } = useFilters();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasStartedBrowsing, setHasStartedBrowsing] = useState(() => {
    return localStorage.getItem('hasSeenWelcome') === 'true';
  });

  // Use the repository for all data access
  const apiClient = createTMDBClient();
  const movieApi = new MovieAPI(apiClient);
  const repository = new MovieRepository(movieApi);

  /**
   * Fetch movies using the repository, based on current filters.
   */
  const fetchMovies = async (page: number = 1, isLoadMore: boolean = false) => {
    try {
      setIsLoading(!isLoadMore);
      if (isLoadMore) setLoadingMore(true);
      let data;
      if (searchQuery) {
        data = await repository.searchMovies(searchQuery, page);
      } else if (selectedGenreId) {
        data = await repository.getMoviesByGenre(selectedGenreId, page);
      } else {
        data = await repository.getPopularMovies(page);
      }
      const { results, total_results } = data;
      if (isLoadMore) {
        setMovies(prevMovies => [...prevMovies, ...results]);
      } else {
        setMovies(results);
      }
      setTotalResults(total_results);
      setCurrentPage(page);
      setError(null);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Failed to load movies. Please try again later.');
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  };

  // Update hasStartedBrowsing when necessary
  useEffect(() => {
    if (searchQuery || selectedGenreId !== null || localStorage.getItem('hasSeenWelcome') === 'true') {
      setHasStartedBrowsing(true);
      if (!movies.length) {
        fetchMovies(1);
      }
    }
  }, [searchQuery, selectedGenreId, movies.length]);

  // Only fetch movies when user has started browsing
  useEffect(() => {
    if (hasStartedBrowsing) {
      setCurrentPage(1);
      fetchMovies(1);
    }
  }, [searchQuery, selectedGenreId, hasStartedBrowsing]);

  /**
   * Load favorites from localStorage and keep in sync across tabs.
   */
  const loadFavoritesFromStorage = useCallback(() => {
    try {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        setFavorites(parsedFavorites);
      }
    } catch (error) {
      console.error('Error loading favorites from storage:', error);
    }
  }, []);

  useEffect(() => {
    loadFavoritesFromStorage();
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'favorites' && e.newValue !== null) {
        try {
          const newFavorites = JSON.parse(e.newValue);
          setFavorites(newFavorites);
        } catch (error) {
          console.error('Error parsing favorites from storage event:', error);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadFavoritesFromStorage]);

  /**
   * Add a movie to favorites and persist in localStorage.
   */
  const addToFavorites = useCallback((movie: Movie) => {
    const currentStoredFavorites = localStorage.getItem('favorites');
    let updatedFavorites: Movie[] = [];
    try {
      const currentFavorites = currentStoredFavorites ? JSON.parse(currentStoredFavorites) : [];
      if (!currentFavorites.some((fav: Movie) => fav.id === movie.id)) {
        updatedFavorites = [...currentFavorites, movie];
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setFavorites(updatedFavorites);
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  }, []);

  /**
   * Remove a movie from favorites and update localStorage.
   */
  const removeFromFavorites = useCallback((id: number) => {
    const currentStoredFavorites = localStorage.getItem('favorites');
    let updatedFavorites: Movie[] = [];
    try {
      const currentFavorites = currentStoredFavorites ? JSON.parse(currentStoredFavorites) : [];
      updatedFavorites = currentFavorites.filter((movie: Movie) => movie.id !== id);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  }, []);

  /**
   * Check if a movie is in the favorites list.
   */
  const isFavorite = useCallback((id: number) => {
    return favorites.some(movie => movie.id === id);
  }, [favorites]);

  /**
   * Load more movies (pagination).
   */
  const loadMore = () => {
    if (!loadingMore && currentPage * 20 < totalResults) {
      fetchMovies(currentPage + 1, true);
    }
  };

  const hasMore = currentPage * 20 < totalResults;

  return (
    <MovieContext.Provider
      value={{
        movies,
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        filteredMovies: movies,
        displayedMovies: movies,
        loadMore,
        hasMore,
        loadingMore,
        totalResults,
        currentPage,
        isLoading,
        error,
        setHasStartedBrowsing
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};