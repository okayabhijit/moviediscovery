import { Movie } from '../context/MovieContext';
export const mockMovies: Movie[] = [{
  id: 1,
  title: "The Shawshank Redemption",
  posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop",
  releaseYear: 1994,
  rating: 9.3,
  genres: ["Drama"],
  actors: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
  director: "Frank Darabont",
  plot: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
  trailerUrl: "https://www.youtube.com/embed/6hB3S9bIaco",
  similarMovies: [2, 3]
}, {
  id: 2,
  title: "The Godfather",
  posterUrl: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=2056&auto=format&fit=crop",
  releaseYear: 1972,
  rating: 9.2,
  genres: ["Crime", "Drama"],
  actors: ["Marlon Brando", "Al Pacino", "James Caan"],
  director: "Francis Ford Coppola",
  plot: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
  trailerUrl: "https://www.youtube.com/embed/sY1S34973zA",
  similarMovies: [3, 4]
}, {
  id: 3,
  title: "The Dark Knight",
  posterUrl: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=2070&auto=format&fit=crop",
  releaseYear: 2008,
  rating: 9.0,
  genres: ["Action", "Crime", "Drama"],
  actors: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
  director: "Christopher Nolan",
  plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
  trailerUrl: "https://www.youtube.com/embed/EXeTwQWrcwY",
  similarMovies: [5, 6]
}, {
  id: 4,
  title: "Pulp Fiction",
  posterUrl: "https://images.unsplash.com/photo-1626814026160-2237a95c5182?q=80&w=2070&auto=format&fit=crop",
  releaseYear: 1994,
  rating: 8.9,
  genres: ["Crime", "Drama"],
  actors: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
  director: "Quentin Tarantino",
  plot: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
  trailerUrl: "https://www.youtube.com/embed/s7EdQ4FqbhY",
  similarMovies: [2, 7]
}, {
  id: 5,
  title: "Inception",
  posterUrl: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1974&auto=format&fit=crop",
  releaseYear: 2010,
  rating: 8.8,
  genres: ["Action", "Adventure", "Sci-Fi"],
  actors: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"],
  director: "Christopher Nolan",
  plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
  trailerUrl: "https://www.youtube.com/embed/YoHD9XEInc0",
  similarMovies: [3, 8]
}, {
  id: 6,
  title: "The Matrix",
  posterUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop",
  releaseYear: 1999,
  rating: 8.7,
  genres: ["Action", "Sci-Fi"],
  actors: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
  director: "Lana Wachowski, Lilly Wachowski",
  plot: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
  trailerUrl: "https://www.youtube.com/embed/vKQi3bBA1y8",
  similarMovies: [5, 8]
}, {
  id: 7,
  title: "Goodfellas",
  posterUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop",
  releaseYear: 1990,
  rating: 8.7,
  genres: ["Biography", "Crime", "Drama"],
  actors: ["Robert De Niro", "Ray Liotta", "Joe Pesci"],
  director: "Martin Scorsese",
  plot: "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito in the Italian-American crime syndicate.",
  trailerUrl: "https://www.youtube.com/embed/qo5jJpHtI1Y",
  similarMovies: [2, 4]
}, {
  id: 8,
  title: "Interstellar",
  posterUrl: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=2070&auto=format&fit=crop",
  releaseYear: 2014,
  rating: 8.6,
  genres: ["Adventure", "Drama", "Sci-Fi"],
  actors: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
  director: "Christopher Nolan",
  plot: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
  trailerUrl: "https://www.youtube.com/embed/zSWdZVtXT7E",
  similarMovies: [5, 6]
}];
export const allGenres = Array.from(new Set(mockMovies.flatMap(movie => movie.genres))).sort();