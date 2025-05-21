import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Favorites from './pages/Favorites';
import { ThemeProvider } from './context/ThemeContext';
import { MovieProvider } from './context/MovieContext';
import { FilterProvider } from './context/FilterContext';

export function App() {
  return (
    <BrowserRouter basename="/moviediscovery">
      <ThemeProvider>
        <FilterProvider>
          <MovieProvider>
            <div className="flex flex-col min-h-screen w-full">
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movie/:id" element={<MovieDetail />} />
                <Route path="/favorites" element={<Favorites />} />
              </Routes>
            </div>
          </MovieProvider>
        </FilterProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}