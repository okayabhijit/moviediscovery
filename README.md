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

3. Configure environment variables:
   
   - Go to `src/utils/config.ts`

   - Add your TMDB API key:

    API_KEY=your_api_key_here

4. Start the development server:

   npm run dev

## Testing

The project uses Jest and React Testing Library for testing. To run tests:

1. Run all tests:
   npm test

2. Run tests with coverage report:
   npm run test:coverage

Current test coverage:
- Statements: 41.45%
- Branches: 23.27%
- Functions: 29.09%
- Lines: 40.49%

Components with 100% coverage:
- GenreButtons
- SearchBar
- Favorites (85.71% branches)
- FilterContext (97.01% statements, 92.85% branches)

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
