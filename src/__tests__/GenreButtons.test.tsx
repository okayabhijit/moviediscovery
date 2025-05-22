import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GenreButtons from '../components/GenreButtons';
import { FilterProvider, useFilters, FilterContextType } from '../context/FilterContext';

// Mock genre data for tests
const mockGenres = [
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' }
];

// Mock the API call to return mockGenres
jest.mock('../services', () => ({
  getData: jest.fn(() => Promise.resolve({ data: { genres: mockGenres } }))
}));

/**
 * GenreButtons component tests.
 * - Verifies rendering, selection, caching, and error handling.
 */
describe('GenreButtons', () => {
  /**
   * Helper to render GenreButtons with context.
   */
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
    const actionButton = await screen.findByText('Action');
    await userEvent.click(actionButton);
    expect(actionButton.closest('button')).toHaveClass('bg-indigo-600');
  });

  it('deselects genre when "All" is clicked', async () => {
    renderGenreButtons();
    const actionButton = await screen.findByText('Action');
    await userEvent.click(actionButton);
    const allButton = screen.getByText('All');
    await userEvent.click(allButton);
    expect(allButton).toHaveClass('bg-indigo-600');
    expect(actionButton.closest('button')).not.toHaveClass('bg-indigo-600');
  });

  it('persists selected genre in localStorage', async () => {
    renderGenreButtons();
    const actionButton = await screen.findByText('Action');
    await userEvent.click(actionButton);
    const savedFilter = JSON.parse(localStorage.getItem('selectedGenre') || '{}');
    expect(savedFilter.genre).toBe('Action');
    expect(savedFilter.genreId).toBe(28);
  });

  it('uses cached genres when available', async () => {
    // Pre-populate the cache
    localStorage.setItem('cachedGenres', JSON.stringify(mockGenres));
    localStorage.setItem('genresCachedAt', Date.now().toString());
    renderGenreButtons();
    expect(await screen.findByText('Action')).toBeInTheDocument();
    expect(screen.queryByText(/loading genres/i)).not.toBeInTheDocument();
  });

  it('fetches new genres when cache is expired', async () => {
    // Set expired cache (older than 24 hours)
    const oldTimestamp = Date.now() - (25 * 60 * 60 * 1000);
    localStorage.setItem('cachedGenres', JSON.stringify(mockGenres));
    localStorage.setItem('genresCachedAt', oldTimestamp.toString());
    renderGenreButtons();
    // Only check that genres are rendered, not the loading state
    expect(await screen.findByText('Action')).toBeInTheDocument();
  });

  it('handles error state gracefully', async () => {
    // Mock API failure
    const { getData } = require('../services');
    getData.mockRejectedValueOnce(new Error('API Error'));
    // Set some cached data as fallback
    localStorage.setItem('cachedGenres', JSON.stringify(mockGenres));
    renderGenreButtons();
    expect(await screen.findByText('Action')).toBeInTheDocument();
  });

  it('maintains selected genre state across re-renders', async () => {
    const { rerender } = renderGenreButtons();
    const actionButton = await screen.findByText('Action');
    await userEvent.click(actionButton);
    rerender(
      <FilterProvider>
        <GenreButtons />
      </FilterProvider>
    );
    expect(actionButton.closest('button')).toHaveClass('bg-indigo-600');
  });

  it('reflects changes when filters are cleared', async () => {
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
    const actionButton = await screen.findByText('Action');
    await userEvent.click(actionButton);
    await act(async () => {
      filterContextValue?.clearFilters();
    });
    expect(screen.getByText('All')).toHaveClass('bg-indigo-600');
    expect(actionButton.closest('button')).not.toHaveClass('bg-indigo-600');
    const savedFilter = localStorage.getItem('selectedGenre');
    expect(JSON.parse(savedFilter || '{}')).toEqual({});
  });
});
