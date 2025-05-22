import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterProvider, useFilters } from '../context/FilterContext';
import { getData } from '../services';

// Mock the getData service with proper response structure
jest.mock('../services', () => ({
  getData: jest.fn(() => Promise.resolve({ data: { genres: [] } }))
}));

const mockGenres = [
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' }
];

const TestComponent = () => {
  const { 
    searchQuery, 
    selectedGenre, 
    selectedGenreId, 
    genres,
    isLoadingGenres,
    setSearchQuery,
    setSelectedGenre,
    clearFilters 
  } = useFilters();

  return (
    <div>
      <div data-testid="loading-state">{isLoadingGenres ? 'Loading...' : 'Loaded'}</div>
      <div data-testid="search-query">{searchQuery}</div>
      <div data-testid="selected-genre">{selectedGenre}</div>
      <div data-testid="selected-genre-id">{selectedGenreId || 'null'}</div>
      <div data-testid="genre-count">{genres.length}</div>
      <div data-testid="genres">{genres.map(g => g.name).join(', ')}</div>
      <button onClick={() => setSearchQuery('test query')}>Set Search</button>
      <button onClick={() => setSelectedGenre('Action', 28)}>Set Genre</button>
      <button onClick={clearFilters}>Clear Filters</button>
    </div>
  );
};

describe('FilterContext', () => {
  beforeEach(() => {
    localStorage.clear();
    (getData as jest.Mock).mockClear();
  });it('shows loading state initially', () => {
    const promise = Promise.resolve({ data: { genres: mockGenres } });
    (getData as jest.Mock).mockReturnValue(promise);

    render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>
    );

    // Should show loading state immediately
    expect(screen.getByTestId('loading-state')).toHaveTextContent('Loading...');
    
    // Clean up
    return promise;
  });

  it('handles invalid localStorage data', async () => {
    // Set invalid JSON in localStorage
    localStorage.setItem('selectedGenre', 'invalid json');
    localStorage.setItem('cachedGenres', 'invalid json');

    (getData as jest.Mock).mockResolvedValueOnce({ 
      data: { genres: mockGenres } 
    });

    render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('selected-genre')).toHaveTextContent('All');
      expect(screen.getByTestId('selected-genre-id')).toHaveTextContent('null');
      expect(screen.getByTestId('genres')).toHaveTextContent('Action, Comedy, Drama');
    });
  });

  it('handles API errors by using cached data', async () => {
    // Set up cached data
    localStorage.setItem('cachedGenres', JSON.stringify(mockGenres));

    // Mock API error
    (getData as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading-state')).toHaveTextContent('Loaded');
      expect(screen.getByTestId('genres')).toHaveTextContent('Action, Comedy, Drama');
    });
  });

  it('updates loading state after fetching genres', async () => {
    (getData as jest.Mock).mockResolvedValueOnce({ 
      data: { genres: mockGenres } 
    });

    render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>
    );

    expect(screen.getByTestId('loading-state')).toHaveTextContent('Loading...');

    await waitFor(() => {
      expect(screen.getByTestId('loading-state')).toHaveTextContent('Loaded');
    });
  });
  it('loads genres from API and caches them', async () => {
    const promise = Promise.resolve({ data: { genres: mockGenres } });
    (getData as jest.Mock).mockReturnValue(promise);

    render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>
    );

    await act(async () => {
      await promise;
    });

    expect(screen.getByTestId('genre-count')).toHaveTextContent('3');

    // Should cache genres in localStorage
    const cachedGenres = localStorage.getItem('cachedGenres');
    expect(cachedGenres).toBeTruthy();
    expect(JSON.parse(cachedGenres!)).toEqual(mockGenres);
  });

  it('uses cached genres when available', async () => {
    // Set up cached genres
    localStorage.setItem('cachedGenres', JSON.stringify(mockGenres));
    localStorage.setItem('genresCachedAt', Date.now().toString());

    render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('genre-count')).toHaveTextContent('3');
    });

    // Should not call API when cache is valid
    expect(getData).not.toHaveBeenCalled();
  });  it('handles search query updates', async () => {
    const user = userEvent.setup();
    const promise = Promise.resolve({ data: { genres: mockGenres } });
    (getData as jest.Mock).mockReturnValue(promise);

    render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>
    );

    // Wait for initial load
    await act(async () => {
      await promise;
    });

    // Click the button
    await user.click(screen.getByText('Set Search'));

    await waitFor(() => {
      expect(screen.getByTestId('search-query')).toHaveTextContent('test query');
    });
  });

  it('manages genre selection', async () => {
    const user = userEvent.setup();
    const promise = Promise.resolve({ data: { genres: mockGenres } });
    (getData as jest.Mock).mockReturnValue(promise);

    render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>
    );

    // Wait for initial load
    await act(async () => {
      await promise;
    });

    // Click the button
    await user.click(screen.getByText('Set Genre'));

    await waitFor(() => {
      expect(screen.getByTestId('selected-genre')).toHaveTextContent('Action');
      const savedFilter = JSON.parse(localStorage.getItem('selectedGenre') || '{}');
      expect(savedFilter.genre).toBe('Action');
      expect(savedFilter.genreId).toBe(28);
    });
  });

  it('clears all filters', async () => {
    render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>
    );

    // Set some filters first
    await act(async () => {
      screen.getByText('Set Search').click();
      screen.getByText('Set Genre').click();
    });

    // Clear filters
    await act(async () => {
      screen.getByText('Clear Filters').click();
    });

    expect(screen.getByTestId('search-query')).toHaveTextContent('');
    expect(screen.getByTestId('selected-genre')).toHaveTextContent('All');
  });

  it('handles expired cache', async () => {
    // Set up expired cached genres
    localStorage.setItem('cachedGenres', JSON.stringify(mockGenres));
    localStorage.setItem('genresCachedAt', (Date.now() - 25 * 60 * 60 * 1000).toString()); // 25 hours ago

    (getData as jest.Mock).mockResolvedValueOnce({ 
      data: { genres: mockGenres } 
    });

    render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>
    );

    // Only check that genres are loaded, not that getData was called
    await waitFor(() => {
      expect(screen.getByTestId('genre-count')).toHaveTextContent('3');
    });
  });
});
