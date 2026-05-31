// client/src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // --- ADD THE LOGIN AND LOGOUT FUNCTIONS ---

  // This function will be called from our LoginPage after a successful API call.
  const login = (newToken) => {
    // 1. Store the new token in localStorage for session persistence.
    localStorage.setItem('token', newToken);
    // 2. Update our component's state. This will trigger a re-render.
    setToken(newToken);
    setIsAuthenticated(true);
  };

  // This function can be called from anywhere (e.g., a "Logout" button).
  const logout = () => {
    // 1. Remove the token from localStorage.
    localStorage.removeItem('token');
    // 2. Update our state to reflect the user is no longer authenticated.
    setToken(null);
    setIsAuthenticated(false);
  };

  // --- ASSEMBLE THE CONTEXT VALUE ---
  // We package up our state and functions into a single object.
  // This is what consuming components will receive.
  const contextValue = {
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return (
    // Pass the assembled context value to the provider.
    <AuthContext.Provider value={contextValue}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// --- CREATE A CUSTOM HOOK FOR EASIER CONSUMPTION ---
// This is a best practice that makes using your context cleaner.
export const useAuth = () => {
  const context = useContext(AuthContext);
  // This check ensures that any component using this hook is a child
  // of the AuthProvider, preventing common errors.
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};