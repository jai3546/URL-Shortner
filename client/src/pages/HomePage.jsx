// client/src/pages/HomePage.jsx

import React, { useState } from 'react';
import { createShortUrl } from '../services/apiService';

const HomePage = () => {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrlData, setShortUrlData] = useState(null);
  const [error, setError] = useState('');

  // The handleSubmit function remains exactly the same.
  // It already does the hard work of updating our state.
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!longUrl) {
      setError('Please enter a URL to shorten.');
      setShortUrlData(null);
      return;
    }

    try {
      setError('');
      const response = await createShortUrl(longUrl);
      setShortUrlData(response.data);
    } catch (err) {
      const errorMessage = err.error || 'An unexpected error occurred.';
      setError(errorMessage);
      setShortUrlData(null);
      console.error('Error from API:', err);
    }
  };

  return (
    <div>
      <h2>URL Shortener</h2>
      <p>Enter a long URL to make it short and easy to share!</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="longUrl-input">Your Long URL:</label>
          <input
            id="longUrl-input"
            type="url"
            placeholder="https://example.com/very/long/url/to/shorten"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            required
          />
        </div>
        <button type="submit">Shorten</button>
      </form>
      
      {/* --- ADD THIS NEW JSX BLOCK BELOW THE FORM --- */}

      {/* 1. Conditionally render the error message */}
      {/* The expression 'error && ...' means this JSX will only be rendered
          if the 'error' state variable is a truthy value (i.e., not an empty string). */}
      {error && (
        <div className="error-container" style={{ color: 'red', marginTop: '1rem' }}>
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}

      {/* 2. Conditionally render the success message and short URL */}
      {/* This JSX will only be rendered if 'shortUrlData' is not null. */}
      {shortUrlData && (
        <div className="result-container" style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '5px' }}>
          <h3>Your Short URL is ready!</h3>
          <p>
            <strong>Short Link:</strong> 
            {/* We make the short URL a clickable link for a better user experience.
                'target="_blank"' opens the link in a new tab.
                'rel="noopener noreferrer"' is a security best practice for new tabs. */}
            <a 
              href={shortUrlData.shortUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ marginLeft: '0.5rem', fontWeight: 'bold', color: '#007bff' }}
            >
              {shortUrlData.shortUrl}
            </a>
          </p>
          <p style={{ fontSize: '0.8rem', color: '#555' }}>
            Original URL: {shortUrlData.longUrl.substring(0, 70)}...
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;