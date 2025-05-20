import React, { useEffect, useState, createContext, useContext, useCallback } from 'react';
import { useFilters } from './FilterContext';
import { getData } from '../services';

export type Movie = {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  overview: string;
};

type MovieContextType = {
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
};

const MovieContext = createContext<MovieContextType>({
  movies: [],
  favorites: [],
  addToFavorites: () => {},
  removeFromFavorites: () => {},
  isFavorite: () => false,
  filteredMovies: [],
  displayedMovies: [],
  loadMore: () => {},
  hasMore: false,
  loadingMore: false,
  totalResults: 0,
  currentPage: 1,
  isLoading: false,
  error: null
});

export const useMovies = () => useContext(MovieContext);

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

  // Fetch movies based on filters
  const fetchMovies = async (page: number = 1, isLoadMore: boolean = false) => {
    try {
      setIsLoading(!isLoadMore);
      if (isLoadMore) setLoadingMore(true);

      let endpoint: string;
      let params: any = {
        page,
        language: 'en-US'
      };

      // Always include genre filter if selected
      if (selectedGenreId) {
        params.with_genres = selectedGenreId;
      }

      // Determine endpoint and add necessary params
      if (searchQuery) {
        endpoint = '/search/movie';
        params.query = searchQuery;
      } else {
        endpoint = '/discover/movie';
        params.sort_by = 'popularity.desc';
      }

      const { data } = await getData(endpoint, params);
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
    }
  }, [searchQuery, selectedGenreId]);

  // Only fetch movies when user has started browsing
  useEffect(() => {
    if (hasStartedBrowsing) {
      setCurrentPage(1);
      fetchMovies(1);
    }
  }, [searchQuery, selectedGenreId, hasStartedBrowsing]);

  // Load favorites from localStorage with cross-tab sync
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

  // Initialize favorites and set up storage event listener
  useEffect(() => {
    loadFavoritesFromStorage();

    // Listen for changes in other tabs
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

  const addToFavorites = useCallback((movie: Movie) => {
    // Always get the latest favorites from localStorage first
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

  const removeFromFavorites = useCallback((id: number) => {
    // Always get the latest favorites from localStorage first
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

  const isFavorite = useCallback((id: number) => {
    return favorites.some(movie => movie.id === id);
  }, [favorites]);

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
        error
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};