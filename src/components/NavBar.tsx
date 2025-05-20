import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface NavBarProps {
  title?: string;
  icon?: React.ReactNode;
  backUrl?: string;
  backLabel?: string;
}

const NavBar: React.FC<NavBarProps> = ({
  title = '',
  icon,
  backUrl = '/',
  backLabel = 'Back to Movies'
}) => {
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex justify-between items-center mb-8">
        {backUrl && (
          <Link 
            to={backUrl} 
            className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <ArrowLeft size={16} className="mr-2" />
            <span>{backLabel}</span>
          </Link>
        )}
        <h1 className="text-2xl font-bold flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          <span>{title}</span>
        </h1>
      </div>
    </div>
  );
};

export default NavBar;
