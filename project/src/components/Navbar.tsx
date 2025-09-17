import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Home, Settings } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to={isAdmin ? '/admin' : '/home'} className="text-xl font-bold text-gray-800">
              BlogPlatform
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user?.username}</span>
            
            <Link 
              to={isAdmin ? '/admin' : '/home'}
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
              {isAdmin ? <Settings size={20} /> : <Home size={20} />}
              <span>{isAdmin ? 'Dashboard' : 'Home'}</span>
            </Link>
            
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};