import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Favorites from '../pages/Favorites';
import { FilterProvider } from '../context/FilterContext';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock MovieContext
jest.mock('../context/MovieContext', () => ({
  useMovies: jest.fn(),
  useTheme: jest.fn(() => ({ darkMode: false })),
}));

describe('Favorites', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  const renderFavorites = () => {
    return render(      
        <BrowserRouter>
            <FilterProvider>
                <Favorites />
            </FilterProvider>
        </BrowserRouter>
    );
  };
  it('shows empty state when no favorites exist', async () => {
    const useMoviesMock = jest.requireMock('../context/MovieContext').useMovies;
    useMoviesMock.mockReturnValue({
      favorites: [],
      loading: false,
      removeFavorite: jest.fn(),
    });

    renderFavorites();
    
    // Wait for the loading state to clear
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
      expect(screen.getByText('No favorites yet')).toBeInTheDocument();
    expect(screen.getByText('Start adding movies to your favorites!')).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    const useMoviesMock = jest.requireMock('../context/MovieContext').useMovies;
    useMoviesMock.mockReturnValue({
      favorites: [],
      loading: true,
      removeFavorite: jest.fn(),
    });

    renderFavorites();
    expect(screen.getAllByTestId('movie-card-skeleton')).toHaveLength(4);
  });

  it('cleans up properly on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');
    const { unmount } = renderFavorites();
    
    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
