import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../components/SearchBar';
import { FilterProvider } from '../context/FilterContext';
import config from '../utils/config';
import { getData } from '../services';

// Mock data for genres
const mockGenres = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Comedy' }
];

// Mock the getData service to return mockGenres
jest.mock('../services', () => ({
  getData: jest.fn().mockImplementation(() => Promise.resolve({ data: { genres: mockGenres } }))
}));

/**
 * Wrapper to provide FilterContext for SearchBar tests.
 */
const FilterWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <FilterProvider>{children}</FilterProvider>
);

/**
 * SearchBar component tests.
 * - Verifies rendering, debounce, clear, and empty input behaviors.
 */
describe('SearchBar', () => {
  /**
   * Helper to render SearchBar with context and wait for state updates.
   */
  const renderSearchBar = async () => {
    let component;
    // Set up initial localStorage state for genres
    localStorage.setItem('cachedGenres', JSON.stringify(mockGenres));
    localStorage.setItem('genresCachedAt', Date.now().toString());
    await act(async () => {
      component = render(<SearchBar />, { wrapper: FilterWrapper });
    });
    // Wait for any pending state updates
    await act(async () => { await Promise.resolve(); });
    return component;
  };

  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.clear();
    (getData as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders search input', async () => {
    await renderSearchBar();
    expect(screen.getByPlaceholderText(/search movies/i)).toBeInTheDocument();
  });

  it('debounces search input', async () => {
    await renderSearchBar();
    const user = userEvent.setup({ delay: null });
    const input = screen.getByRole('textbox');
    await act(async () => { await user.type(input, 'test movie'); });
    expect(input).toHaveValue('test movie');
    // Fast-forward the debounce timeout
    await act(async () => { jest.advanceTimersByTime(config.SEARCH_DEBOUNCE_DELAY); });
    expect(input).toHaveValue('test movie');
  });

  it('clears search input when clear button is clicked', async () => {
    await renderSearchBar();
    const user = userEvent.setup({ delay: null });
    const input = screen.getByRole('textbox');
    await act(async () => { await user.type(input, 'test movie'); });
    expect(input).toHaveValue('test movie');
    const clearButton = screen.getByRole('button');
    await act(async () => { await user.click(clearButton); });
    expect(input).toHaveValue('');
  });

  it('handles empty input correctly', async () => {
    await renderSearchBar();
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
