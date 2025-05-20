import React, { createContext, useContext, useState, useEffect } from 'react';
import { getData } from '../services';

interface Genre {
  id: number;
  name: string;
}

interface FilterState {
  genre: string;
  genreId: number | null;
}

interface FilterContextType {
  searchQuery: string;
  selectedGenre: string;
  selectedGenreId: number | null;
  genres: Genre[];
  isLoadingGenres: boolean;
  setSearchQuery: (query: string) => void;
  setSelectedGenre: (genre: string, genreId: number | null) => void;
  clearFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};

// FilterProvider component to manage filter state
// and provide it to the rest of the app
export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoadingGenres, setIsLoadingGenres] = useState(true);
  
  // Initialize from localStorage with error handling
  const initialFilter = (): { selectedGenre: string; selectedGenreId: number | null } => {
    try {
      const savedFilter = localStorage.getItem('selectedGenre');
      if (savedFilter) {
        const filter: FilterState = JSON.parse(savedFilter);
        if (filter && typeof filter.genre === 'string' && (filter.genreId === null || typeof filter.genreId === 'number')) {
          return {
            selectedGenre: filter.genre,
            selectedGenreId: filter.genreId
          };
        }
      }
    } catch (error) {
      console.error('Error parsing saved genre:', error);
      localStorage.removeItem('selectedGenre');
    }
    return { selectedGenre: 'All', selectedGenreId: null };
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(initialFilter().selectedGenre);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(initialFilter().selectedGenreId);

  // Fetch and cache genres
  useEffect(() => {
    const fetchAndCacheGenres = async () => {
      try {
        // Check if we have cached genres and they're not too old (24 hours)
        const cachedData = localStorage.getItem('cachedGenres');
        const cachedTimestamp = localStorage.getItem('genresCachedAt');
        
        if (cachedData && cachedTimestamp) {
          const parsedData = JSON.parse(cachedData);
          const timestamp = parseInt(cachedTimestamp);
          const now = Date.now();
          const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
          
          if (now - timestamp < oneDay) {
            setGenres(parsedData);
            setIsLoadingGenres(false);
            return;
          }
        }

        // Fetch fresh data if cache is missing or expired
        const { data } = await getData('/genre/movie/list');
        setGenres(data.genres);
        
        // Cache the new data
        localStorage.setItem('cachedGenres', JSON.stringify(data.genres));
        localStorage.setItem('genresCachedAt', Date.now().toString());
      } catch (err) {
        console.error('Error fetching genres:', err);
        // Try to use cached data even if it's expired in case of API error
        const cachedData = localStorage.getItem('cachedGenres');
        if (cachedData) {
          setGenres(JSON.parse(cachedData));
        }
      } finally {
        setIsLoadingGenres(false);
      }
    };

    fetchAndCacheGenres();
  }, []);

  // Handle search query changes - now doesn't affect genre selection
  const handleSearchQuery = (query: string) => {
    setSearchQuery(query);
  };
  // Handle genre selection changes with error handling
  const handleGenreSelection = (genre: string, genreId: number | null) => {
    setSelectedGenre(genre);
    setSelectedGenreId(genreId);

    try {
      if (genre === 'All') {
        localStorage.removeItem('selectedGenre');
      } else {
        const filter: FilterState = {
          genre,
          genreId
        };
        localStorage.setItem('selectedGenre', JSON.stringify(filter));
      }
    } catch (error) {
      console.error('Error saving genre selection:', error);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenre('All');
    setSelectedGenreId(null);
    localStorage.removeItem('selectedGenre');
  };

  return (
    <FilterContext.Provider
      value={{
        searchQuery,
        selectedGenre,
        selectedGenreId,
        genres,
        isLoadingGenres,
        setSearchQuery: handleSearchQuery,
        setSelectedGenre: handleGenreSelection,
        clearFilters
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
