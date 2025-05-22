// Jest mock for config.ts to avoid import.meta.env issues in tests
const config = {
  TMDB_BASE_URL: 'https://api.themoviedb.org/3',
  TMDB_API_KEY: 'test-api-key',
  TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  SEARCH_DEBOUNCE_DELAY: 700,
  ITEMS_PER_PAGE: 20,
  CACHE_DURATION: 24 * 60 * 60 * 1000,
  STORAGE_KEYS: {
    FAVORITES: 'favorites',
    DARK_MODE: 'darkMode',
    WELCOME_SEEN: 'hasSeenWelcome',
    GENRES_CACHE: 'cachedGenres',
    GENRES_TIMESTAMP: 'genresCachedAt'
  }
};
module.exports = config;
