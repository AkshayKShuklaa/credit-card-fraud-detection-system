import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Bell, UserCircle } from 'lucide-react';

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <header className="h-16 bg-dark-800 border-b border-dark-700 flex items-center justify-between px-6 z-10 shadow-sm">
      <div className="flex items-center">
        {/* Placeholder for potential breadcrumbs or search */}
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-dark-700">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-danger rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-2 pl-4 border-l border-dark-700">
          <UserCircle className="w-8 h-8 text-primary-500" />
          <div className="hidden md:block">
            <p className="text-sm font-medium text-white leading-tight">{user?.username}</p>
            <p className="text-xs text-gray-400">{user?.role === 'ADMIN' ? 'Administrator' : 'Analyst'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
