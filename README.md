# Movie Discovery - What Should I Watch Tonight

A movie discovery application built with React, TypeScript, and Tailwind CSS. Browse popular movies, search for specific titles, filter by genres, and maintain your personal favorites list to watch later.

## Live Demo

[Live Demo Link] (https://okayabhijit.github.io/moviediscovery/)

## Features

- 🎬 Browse popular movies
- 🔍 Search functionality
- 🏷️ Filter by genres
- ❤️ Save favorite movies
- 🌓 Dark/Light mode
- 📱 Responsive design
- 🚀 Fast and optimized performance

## Technologies Used

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Jest & React Testing Library
- GitHub Actions for CI/CD

## TMDB API key

- Create account (https://www.themoviedb.org)
- Choose developer plan (https://www.themoviedb.org/subscribe/developer)
- Fill in required fields, you will get API key and access_token

## Setup Instructions

1. Clone the repository:

   git clone https://github.com/okayabhijit/moviediscovery.git

   cd moviediscovery

   npm install

2. Configure your TMDB API key:
   
   - Open `src/utils/config.ts`
   - Replace the value of `TMDB_API_KEY` in the `config` object with your API key, e.g.:
     ```typescript
     TMDB_API_KEY: 'your_api_key_here',
     ```
   - Or, set the environment variable `VITE_TMDB_API_KEY` in a `.env` file at the project root for Vite to pick up automatically.

3. Start the development server:

   npm run dev

## Testing

The project uses Jest and React Testing Library for testing. To run tests:

1. Run all tests:
   npm test

2. Run tests with coverage report:
   npm run test:coverage

### Current test coverage (as of May 22, 2025):
- **Statements:** 34.92%
- **Branches:** 19.58%
- **Functions:** 24.32%
- **Lines:** 34.04%

#### Components with high coverage:
- GenreButtons: 100%
- SearchBar: 93.33% lines, 77.77% functions, 70% branches
- Favorites: 85.71% statements, 85.18% lines, 83.33% functions
- FilterContext: 97.01% statements, 96.87% lines, 100% functions, 92.85% branches

## CI/CD

The project uses GitHub Actions for CI/CD. The pipeline:
1. Runs tests
2. Checks code quality
3. Builds the application
4. Deploys to production (when merging to main)

See `.github/workflows/deploy.yml` for the complete workflow.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [TMDB API](https://www.themoviedb.org/documentation/api) for providing movie data
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [Vite](https://vitejs.dev/) for the build tool
