/**
 * WelcomeScreen component
 * Implements Presentational Component pattern for welcome message display
 */
import React from 'react';
import { BaseProps } from './common/BaseComponent';

interface WelcomeScreenProps extends BaseProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, className }) => (
  <div className={`text-center py-16 ${className || ''}`}>
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold mb-4 dark:text-white">
        What Should I Watch Tonight
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">
        Discover and explore your favorite movies. Use the search bar to find specific titles, 
        actors or browse by genres, or build your personal collection of favorites to watch later.
      </p>
      <button
        onClick={onStart}
        className="px-8 py-4 bg-indigo-600 dark:bg-purple-700 text-white rounded-full 
                 hover:bg-indigo-700 dark:hover:bg-purple-800 transition-colors
                 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
      >
        Start Browsing Movies
      </button>
    </div>
  </div>
);
