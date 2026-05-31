// client/src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner'; // Reusing your reusable loading spinner

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Controls loading states for form submission
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Both email and password are required.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginUser(formData);
      
      if (response && response.token) {
        // Hand over security token to AuthContext central state manager
        login(response.token); 
        console.log('Login successful! Redirecting to dashboard...');
        navigate('/dashboard');
      } else {
        setError('Login successful, but no security token was returned.');
      }
    } catch (err) {
      // console.error('Login error caught in UI:', err);
      // const errorMessage = err.error || 'Invalid email or password. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Main container for the authentication form
    // - max-w-md mx-auto: Limits card width and centers it on your layout canvas.
    <div className="max-w-md mx-auto">
      
      {/* - bg-white p-8 mt-10 rounded-lg shadow-lg: Elevated card look with deep shadow depths */}
      <div className="bg-white p-8 mt-10 rounded-lg shadow-lg">
        
        <h2 className="text-2xl font-bold text-center mb-2">Welcome Back!</h2>
        <p className="text-center text-slate-500 mb-6">Log in to access your dashboard.</p>
        
        {/* - space-y-6: Automatically adds perfect vertical margins between all internal fields */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email Form Field Block */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              required
              className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>
          
          {/* Password Form Field Block */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              required
              className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>
          
          {/* Full-width Responsive Submit Button with Spinner Feedback */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Spinner size="small" />
                <span>Logging in...</span>
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
        
        {/* Error Response Box */}
        {error && <p className="mt-4 text-center text-sm font-semibold text-red-500">⚠️ {error}</p>}
        
        {/* Exact Tutorial Footer Link Mapping to /register */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:underline">
            Register now
          </Link>
        </p>
        
      </div>
    </div>
  );
};

export default LoginPage;