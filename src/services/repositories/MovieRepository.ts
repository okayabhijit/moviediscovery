/**
 * Movie repository implementation
 * Implements Repository pattern for data access abstraction
 */
import { Movie, MovieDetails, Genre, MovieResponse } from '../../types/movie.types';
import { MovieAPI } from '../api/movieApi';
import config from '../../utils/config';

/**
 * Interface defining movie data access operations
 */
export interface IMovieRepository {
  getPopularMovies(page?: number): Promise<MovieResponse<Movie>>;
  searchMovies(query: string, page?: number): Promise<MovieResponse<Movie>>;
  getMoviesByGenre(genreId: number, page?: number): Promise<MovieResponse<Movie>>;
  getMovieDetails(movieId: number): Promise<MovieDetails>;
  getGenres(): Promise<Genre[]>;
}

/**
 * MovieRepository class implementing the Repository pattern
 * Handles caching, data persistence, and API communication
 */
export class MovieRepository implements IMovieRepository {
  constructor(private readonly api: MovieAPI) {}

  async getPopularMovies(page: number = 1): Promise<MovieResponse<Movie>> {
    return this.api.getPopularMovies(page);
  }

  async searchMovies(query: string, page: number = 1): Promise<MovieResponse<Movie>> {
    return this.api.searchMovies(query, page);
  }

  async getMoviesByGenre(genreId: number, page: number = 1): Promise<MovieResponse<Movie>> {
    return this.api.getMoviesByGenre(genreId, page);
  }

  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    return this.api.getMovieDetails(movieId);
  }

  /**
   * Gets genres with caching support
   */
  async getGenres(): Promise<Genre[]> {
    // Try to get genres from cache
    const cachedGenres = localStorage.getItem(config.STORAGE_KEYS.GENRES_CACHE);
    const cachedTimestamp = localStorage.getItem(config.STORAGE_KEYS.GENRES_TIMESTAMP);

    if (cachedGenres && cachedTimestamp) {
      const timestamp = parseInt(cachedTimestamp);
      if (Date.now() - timestamp < config.CACHE_DURATION) {
        return JSON.parse(cachedGenres);
      }
    }

    // Fetch fresh data if cache is missing or expired
    const genres = await this.api.getGenres();
    
    // Update cache
    localStorage.setItem(config.STORAGE_KEYS.GENRES_CACHE, JSON.stringify(genres));
    localStorage.setItem(config.STORAGE_KEYS.GENRES_TIMESTAMP, Date.now().toString());

    return genres;
  }

  /**
   * Gets favorite movies from local storage
   */
  getFavorites(): Movie[] {
    try {
      const favorites = localStorage.getItem(config.STORAGE_KEYS.FAVORITES);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  }

  /**
   * Saves favorite movies to local storage
   */
  saveFavorites(movies: Movie[]): void {
    try {
      localStorage.setItem(config.STORAGE_KEYS.FAVORITES, JSON.stringify(movies));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }
}
