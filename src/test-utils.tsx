import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { FilterProvider } from '../context/FilterContext';
import { MovieProvider } from '../context/MovieContext';

function render(ui: React.ReactElement, { route = '/' } = {}) {
  window.history.pushState({}, 'Test page', route);

  return rtlRender(ui, {
    wrapper: ({ children }) => (
      <BrowserRouter>
        <ThemeProvider>
          <FilterProvider>
            <MovieProvider>
              {children}
            </MovieProvider>
          </FilterProvider>
        </ThemeProvider>
      </BrowserRouter>
    ),
  });
}

// re-export everything
export * from '@testing-library/react';
export { render };
