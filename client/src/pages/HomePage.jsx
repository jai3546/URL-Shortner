// client/src/pages/HomePage.jsx

import React, { useState } from 'react';
import { createShortUrl } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const HomePage = () => {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrlData, setShortUrlData] = useState(null);
  const [error, setError] = useState(''); // Handles server crashes/network errors
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- 1. Client-side inline error state ---
  const [formErrors, setFormErrors] = useState({});

  const { token } = useAuth();

  // --- 2. Regex validator routine ---
  const validateUrl = () => {
    const errors = {};
    const urlPattern = new RegExp('^(https?:\\/\\/)' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

    if (!longUrl.trim()) {
      errors.longUrl = 'URL field cannot be empty.';
    } else if (!urlPattern.test(longUrl)) {
      errors.longUrl = 'Please enter a valid URL (e.g., https://example.com).';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCopied(false);
    setError('');
    setShortUrlData(null);

    // --- 3. FIX: Run validation before hitting the API ---
    const validationErrors = validateUrl();
    setFormErrors(validationErrors);
    
    // If there is an validation error, STOP here!
    if (Object.keys(validationErrors).length > 0) {
      return; 
    }

    setIsLoading(true);

    try {
      const response = await createShortUrl(longUrl, token);
      setShortUrlData(response.data);
    } catch (err) {
      // Safely check err.message from our custom centralized handler
      const errorMessage = err.message || 'An unexpected error occurred.';
      setError(errorMessage);
      setShortUrlData(null);
      console.error('Error from API:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (shortUrlData?.shortUrl) {
      try {
        await navigator.clipboard.writeText(shortUrlData.shortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy link text: ', err);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center mt-10">
      <h1 className="text-4xl font-bold mb-2">URL Shortener</h1>
      <p className="text-lg text-slate-600">Enter a long URL to make it short and easy to share!</p>
      
      <div className="mt-8 bg-white p-8 rounded-lg shadow-lg">
        {/* Added items-start to keep elements aligned properly when error shows */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-start">
          
          <div className="flex-grow w-full text-left">
            <input 
              type="text" // Changed to text to let our custom regex work smoothly
              placeholder="https://example.com/very/long/url"
              value={longUrl}
              onChange={(e) => {
                setLongUrl(e.target.value);
                if (formErrors.longUrl) {
                  setFormErrors({}); // Clears red border as user types
                }
              }}
              disabled={isLoading}
              // --- 4. FIX: Conditionally apply red border outline ---
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors ${
                formErrors.longUrl ? 'border-red-500 focus:ring-red-400' : 'border-gray-300'
              }`}
            />
            
            {/* --- 5. FIX: Render the inline red error text --- */}
            {formErrors.longUrl && (
              <p className="text-red-500 text-sm mt-1 ml-1 font-medium">⚠️ {formErrors.longUrl}</p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-400 w-full sm:w-auto flex items-center justify-center gap-2 min-w-[140px] h-[46px]"
          >
            {isLoading ? (
              <>
                <Spinner size="small" />
                <span>Shortening...</span>
              </>
            ) : (
              'Shorten'
            )}
          </button>
        </form>

        {/* Short URL Result Card */}
        {shortUrlData?.shortUrl && (
          <div className="mt-6 pt-6 border-t text-left">
            <h3 className="font-semibold text-slate-700 mb-2">Your Short URL is ready!</h3>
            <div className="flex justify-between items-center bg-slate-100 p-3 rounded-md">
              <a 
                href={shortUrlData.shortUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-mono text-blue-600 break-all font-semibold hover:underline"
              >
                {shortUrlData.shortUrl}
              </a>
              <button 
                type="button"
                onClick={handleCopy} 
                className="bg-slate-200 hover:bg-slate-300 px-4 py-1.5 rounded-md text-sm font-semibold ml-4 transition-colors min-w-[80px]"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-500 word-break-all">
              Original URL: {shortUrlData.longUrl.substring(0, 65)}...
            </p>
          </div>
        )}

        {/* Global Server Error Display */}
        {error && <p className="mt-4 text-sm font-semibold text-red-500">❌ {error}</p>}
      </div>
    </div>
  );
};

export default HomePage;