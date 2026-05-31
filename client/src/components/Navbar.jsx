// client/src/components/Navbar.jsx

import React from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom'; // Added NavLink here
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    // Updated background to bg-slate-900 to exactly match your gorgeous screenshot dark theme
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Brand/Logo Section */}
        <div className="text-2xl font-bold">
          <Link to="/">Short.ly</Link>
        </div>
        
        {/* Navigation Links */}
        <ul className="flex gap-6 items-center">
          {isAuthenticated ? (
            <>
              <li>
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => 
                    `text-sm font-semibold transition-all duration-200 ${
                      isActive 
                        ? 'text-white border-b-2 border-blue-500 pb-1' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <button 
                  onClick={handleLogout} 
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-md text-sm font-semibold transition-colors shadow-sm"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              {/* --- INTEGRATED NAVLINK HIGHLIGHTS FOR LOGIN & REGISTER --- */}
              <li>
                <NavLink 
                  to="/login" 
                  className={({ isActive }) => 
                    `text-sm font-semibold transition-all duration-200 ${
                      isActive 
                        ? 'text-white border-b-2 border-blue-500 pb-1' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`
                  }
                >
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/register" 
                  className={({ isActive }) => 
                    `text-sm font-semibold transition-all duration-200 ${
                      isActive 
                        ? 'text-white border-b-2 border-blue-500 pb-1' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`
                  }
                >
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;