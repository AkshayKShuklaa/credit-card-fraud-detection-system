import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, LogOut, ShieldAlert } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { logout, user } = useContext(AuthContext);

  return (
    <div className="w-64 bg-dark-800 border-r border-dark-700 h-full flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-dark-700">
        <ShieldAlert className="w-8 h-8 text-primary-500 mr-2" />
        <span className="text-xl font-bold text-white tracking-wide">FraudDetect</span>
      </div>
      
      <div className="flex-1 py-6 flex flex-col gap-2 px-4">
        <NavLink 
          to="/dashboard" 
          className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary-500/10 text-primary-500' : 'text-gray-400 hover:bg-dark-700 hover:text-white'}`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium">Dashboard</span>
        </NavLink>
        
        <NavLink 
          to="/transactions" 
          className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary-500/10 text-primary-500' : 'text-gray-400 hover:bg-dark-700 hover:text-white'}`}
        >
          <Receipt className="w-5 h-5" />
          <span className="font-medium">Transactions</span>
        </NavLink>
      </div>

      <div className="p-4 border-t border-dark-700">
        <div className="mb-4 px-4">
          <p className="text-sm text-gray-400">Logged in as</p>
          <p className="text-white font-medium truncate">{user?.username}</p>
          <span className="text-xs px-2 py-0.5 rounded-full bg-dark-700 text-primary-400 mt-1 inline-block">{user?.role}</span>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2 w-full text-left text-gray-400 hover:text-accent-danger transition-colors rounded-lg hover:bg-dark-700"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
