import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GenreButtons from '../components/GenreButtons';
import { FilterProvider, useFilters, FilterContextType } from '../context/FilterContext';

// Mock the genre data
const mockGenres = [
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' }
];

// Mock the API call
jest.mock('../services', () => ({
  getData: jest.fn(() => Promise.resolve({ 
    data: { genres: mockGenres } 
  }))
}));

describe('GenreButtons', () => {
  const renderGenreButtons = () => {
    return render(
      <FilterProvider>
        <GenreButtons />
      </FilterProvider>
    );
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('renders all genre buttons including "All"', async () => {
    renderGenreButtons();
    
    // Wait for genres to load
    expect(await screen.findByText('All')).toBeInTheDocument();
    expect(await screen.findByText('Action')).toBeInTheDocument();
    expect(await screen.findByText('Comedy')).toBeInTheDocument();
    expect(await screen.findByText('Drama')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    renderGenreButtons();
    expect(screen.getByText(/loading genres/i)).toBeInTheDocument();
  });

  it('selects a genre when clicked', async () => {
    renderGenreButtons();
    
    // Wait for genres to load
    const actionButton = await screen.findByText('Action');
    
    // Click the Action genre
    await userEvent.click(actionButton);
    
    // The clicked button should have the selected style
    expect(actionButton.closest('button')).toHaveClass('bg-indigo-600');
  });

  it('deselects genre when "All" is clicked', async () => {
    renderGenreButtons();
    
    // Wait for genres to load and click a genre
    const actionButton = await screen.findByText('Action');
    await userEvent.click(actionButton);
    
    // Click the All button
    const allButton = screen.getByText('All');
    await userEvent.click(allButton);
    
    // The All button should have the selected style
    expect(allButton).toHaveClass('bg-indigo-600');
    // The Action button should not have the selected style
    expect(actionButton.closest('button')).not.toHaveClass('bg-indigo-600');
  });

  it('persists selected genre in localStorage', async () => {
    renderGenreButtons();
    
    // Wait for genres to load and click a genre
    const actionButton = await screen.findByText('Action');
    await userEvent.click(actionButton);
    
    // Check if localStorage was updated
    const savedFilter = JSON.parse(localStorage.getItem('selectedGenre') || '{}');
    expect(savedFilter.genre).toBe('Action');
    expect(savedFilter.genreId).toBe(28);
  });

  it('uses cached genres when available', async () => {
    // Pre-populate the cache
    localStorage.setItem('cachedGenres', JSON.stringify(mockGenres));
    localStorage.setItem('genresCachedAt', Date.now().toString());
    
    renderGenreButtons();
    
    // Should immediately show genres from cache
    expect(await screen.findByText('Action')).toBeInTheDocument();
    expect(screen.queryByText(/loading genres/i)).not.toBeInTheDocument();
  });

  it('fetches new genres when cache is expired', async () => {
    // Set expired cache (older than 24 hours)
    const oldTimestamp = Date.now() - (25 * 60 * 60 * 1000);
    localStorage.setItem('cachedGenres', JSON.stringify(mockGenres));
    localStorage.setItem('genresCachedAt', oldTimestamp.toString());
    
    renderGenreButtons();
    
    // Should show loading state and then fetch new data
    expect(screen.getByText(/loading genres/i)).toBeInTheDocument();
    expect(await screen.findByText('Action')).toBeInTheDocument();
  });

  it('handles error state gracefully', async () => {
    // Mock API failure
    const { getData } = require('../services');
    getData.mockRejectedValueOnce(new Error('API Error'));
    
    // Set some cached data as fallback
    localStorage.setItem('cachedGenres', JSON.stringify(mockGenres));
    
    renderGenreButtons();
    
    // Should still render using cached data
    expect(await screen.findByText('Action')).toBeInTheDocument();
  });

  it('maintains selected genre state across re-renders', async () => {
    const { rerender } = renderGenreButtons();
    
    // Select a genre
    const actionButton = await screen.findByText('Action');
    await userEvent.click(actionButton);
    
    // Re-render the component
    rerender(
      <FilterProvider>
        <GenreButtons />
      </FilterProvider>
    );
    
    // Button should still be selected
    expect(actionButton.closest('button')).toHaveClass('bg-indigo-600');
  });  it('reflects changes when filters are cleared', async () => {
    let filterContextValue: FilterContextType | undefined;
    const TestWrapper = ({ children }: { children: React.ReactNode }) => {
      const filters = useFilters();
      filterContextValue = filters;
      return <>{children}</>;
    };

    render(
      <FilterProvider>
        <TestWrapper>
          <GenreButtons />
        </TestWrapper>
      </FilterProvider>
    );
    
    // Wait for genres to load and select a genre
    const actionButton = await screen.findByText('Action');
    await userEvent.click(actionButton);
    
    // Call clearFilters directly
    await act(async () => {
      filterContextValue?.clearFilters();
    });
    
    // All button should be selected
    expect(screen.getByText('All')).toHaveClass('bg-indigo-600');
    expect(actionButton.closest('button')).not.toHaveClass('bg-indigo-600');

    // Verify localStorage was cleared
    const savedFilter = localStorage.getItem('selectedGenre');
    expect(JSON.parse(savedFilter || '{}')).toEqual({});
  });
});
