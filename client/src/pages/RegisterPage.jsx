// client/src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerUser } from '../services/authService';
import Spinner from '../components/Spinner'; // Reusing our custom micro-interaction spinner

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState(''); // Holds global server errors (like duplicate email)
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Controls real-time submission loading states

  // --- INTEGRATED CHANGE 1: State for client-side inline form errors ---
  const [formErrors, setFormErrors] = useState({});

  // --- INTEGRATED CHANGE 2: Comprehensive validation function ---
  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      errors.name = 'Name is required.';
    }

    if (!formData.email) {
      errors.email = 'Email is required.';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Email address is invalid.';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    return errors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear specific error as the user types in that field
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: null,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // --- INTEGRATED CHANGE 3: Run comprehensive validation before submitting ---
    const validationErrors = validate();
    setFormErrors(validationErrors);

    // If validationErrors object has any keys, halt the API call
    if (Object.keys(validationErrors).length > 0) return;

    setIsLoading(true);

    try {
      const response = await registerUser(formData);
      console.log('Registration successful:', response);
      setSuccess('Registration successful! Please log in.');
      // Clear form inputs and custom field errors upon successful account registration
      setFormData({ name: '', email: '', password: '' });
      setFormErrors({});
    } catch (err) {
      console.error('Registration error:', err);
      // Fixed to read the clean string err.message thrown from authService
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Main container for the authentication form
    // - max-w-md mx-auto: Limits container dimensions and centers it horizontally on screen.
    <div className="max-w-md mx-auto">
      
      {/* - bg-white p-8 mt-10 rounded-lg shadow-lg: Elevated clean card layer with shadow depth padding. */}
      <div className="bg-white p-8 mt-10 rounded-lg shadow-lg">
        
        <h2 className="text-2xl font-bold text-center mb-2">Create Your Account</h2>
        <p className="text-center text-slate-500 mb-6">Join us to start creating your own short links!</p>
        
        {/* - space-y-6: Provides clean, uniform layout gaps between field rows automatically. */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Name Field Block */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1 text-left">
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
              // --- INTEGRATED CHANGE 4: Conditional red border style ---
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors ${
                formErrors.name ? 'border-red-500 focus:ring-red-400' : 'border-slate-300'
              }`}
            />
            {/* Inline error display layout */}
            {formErrors.name && (
              <p className="text-red-500 text-xs mt-1 text-left font-medium">⚠️ {formErrors.name}</p>
            )}
          </div>

          {/* Email Address Field Block */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1 text-left">
              Email Address
            </label>
            <input
              id="email"
              type="text" // Changed to text to let custom regex error display instead of browser default popup
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              // --- INTEGRATED CHANGE 4: Conditional red border style ---
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors ${
                formErrors.email ? 'border-red-500 focus:ring-red-400' : 'border-slate-300'
              }`}
            />
            {/* Inline error display layout */}
            {formErrors.email && (
              <p className="text-red-500 text-xs mt-1 text-left font-medium">⚠️ {formErrors.email}</p>
            )}
          </div>
          
          {/* Password Field Block */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1 text-left">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Choose a strong password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              // --- INTEGRATED CHANGE 4: Conditional red border style ---
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors ${
                formErrors.password ? 'border-red-500 focus:ring-red-400' : 'border-slate-300'
              }`}
            />
            {/* Inline error display layout */}
            {formErrors.password && (
              <p className="text-red-500 text-xs mt-1 text-left font-medium">⚠️ {formErrors.password}</p>
            )}
          </div>

          {/* Full-width Submission Button with Integrated Spinner Tracking */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center justify-center gap-2 h-[48px]"
          >
            {isLoading ? (
              <>
                <Spinner size="small" />
                <span>Registering...</span>
              </>
            ) : (
              'Register'
            )}
          </button>
        </form>
        
        {/* Success Feedback Display Block */}
        {success && <p className="mt-4 text-center text-sm font-semibold text-green-600">✅ {success}</p>}
        
        {/* Error Feedback Display Block */}
        {error && <p className="mt-4 text-center text-sm font-semibold text-red-500 bg-red-50 p-2 rounded-md">❌ {error}</p>}
        
        {/* Exact Tutorial Footer Link Naming Match */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
        
      </div>
    </div>
  );
};

export default RegisterPage;