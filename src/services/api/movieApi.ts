/**
 * Movie API endpoints implementation
 * Implements Adapter Pattern to normalize API responses
 */
import { AxiosInstance } from 'axios';
import { Movie, MovieDetails, MovieResponse, Genre } from '../../types/movie.types';
import config from '../../utils/config';

/**
 * MovieAPI class implementing the Adapter pattern
 * Encapsulates all movie-related API calls and normalizes responses
 */
export class MovieAPI {
  constructor(private readonly client: AxiosInstance) {}

  /**
   * Fetches popular movies with pagination
   */
  async getPopularMovies(page: number = 1): Promise<MovieResponse<Movie>> {
    const { data } = await this.client.get<MovieResponse<Movie>>('/discover/movie', {
      params: {
        page,
        sort_by: 'popularity.desc'
      }
    });
    return this.normalizeResponse(data);
  }

  /**
   * Searches movies by query string
   */
  async searchMovies(query: string, page: number = 1): Promise<MovieResponse<Movie>> {
    const { data } = await this.client.get<MovieResponse<Movie>>('/search/movie', {
      params: { query, page }
    });
    return this.normalizeResponse(data);
  }

  /**
   * Fetches movies by genre
   */
  async getMoviesByGenre(genreId: number, page: number = 1): Promise<MovieResponse<Movie>> {
    const { data } = await this.client.get<MovieResponse<Movie>>('/discover/movie', {
      params: {
        with_genres: genreId,
        page
      }
    });
    return this.normalizeResponse(data);
  }

  /**
   * Fetches detailed movie information including credits and similar movies
   */
  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    const { data } = await this.client.get<MovieDetails>(`/movie/${movieId}`, {
      params: {
        append_to_response: 'credits,similar,videos'
      }
    });
    return this.normalizeMovieDetails(data);
  }

  /**
   * Fetches all available movie genres
   */
  async getGenres(): Promise<Genre[]> {
    const { data } = await this.client.get<{ genres: Genre[] }>('/genre/movie/list');
    return data.genres;
  }

  /**
   * Normalizes the movie response to ensure consistent data structure
   * @private
   */
  private normalizeResponse(data: MovieResponse<Movie>): MovieResponse<Movie> {
    return {
      results: data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: Number(movie.vote_average.toFixed(1)),
        genre_ids: movie.genre_ids,
        overview: movie.overview
      })),
      total_results: data.total_results,
      page: data.page,
      total_pages: Math.ceil(data.total_results / config.ITEMS_PER_PAGE)
    };
  }

  /**
   * Normalizes detailed movie data
   * @private
   */
  private normalizeMovieDetails(movie: MovieDetails): MovieDetails {
    return {
      ...movie,
      vote_average: Number(movie.vote_average.toFixed(1)),
      videos: {
        results: movie.videos.results.filter(video => 
          video.site === 'YouTube' && ['Trailer', 'Teaser'].includes(video.type)
        )
      },
      credits: {
        cast: movie.credits.cast.slice(0, 10).map(actor => ({
          id: actor.id,
          name: actor.name,
          character: actor.character,
          profile_path: actor.profile_path
        }))
      },
      similar: {
        results: movie.similar.results.slice(0, 4).map(similar => ({
          id: similar.id,
          title: similar.title,
          poster_path: similar.poster_path,
          release_date: similar.release_date,
          vote_average: Number(similar.vote_average.toFixed(1)),
          genre_ids: [],
          overview: ''
        }))
      }
    };
  }
}