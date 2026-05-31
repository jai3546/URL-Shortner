// client/src/services/linkService.js

import axios from 'axios';

// The base URL for our link-related endpoints.
const API_URL = '/api/links/';

/**
 * @desc    Fetches all links associated with the currently authenticated user.
 * @param   {string} token The JSON Web Token for authentication.
 * @returns {Promise<object>} A promise that resolves to the API response data (the user's links).
 * @throws  Will throw an error if the API request fails (e.g., token is invalid).
 */
export const getUserLinks = async (token) => {
  // 1. THIS IS THE CRITICAL STEP: Configure the request headers.
  //    To access a protected endpoint, we must include the user's JWT.
  //    The backend's 'auth' middleware is specifically designed to look for this header.
  const config = {
    headers: {
      // The 'Authorization' header is the standard for sending credentials.
      // The 'Bearer' scheme is a common standard for sending JWTs. It tells the
      // server what kind of token it is. The format is "Bearer <token>".
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    // 2. Make the authenticated GET request using axios.
    //    The first argument is the endpoint URL.
    //    The second argument is the 'config' object, which attaches our
    //    custom Authorization header to the request.
    const response = await axios.get(API_URL + 'my-links', config);
    return response.data;
  } catch (error) {
    // 3. Handle errors gracefully, just as you've done in other services.
    console.error('API Error: Failed to fetch user links', error);

    // Re-throw the specific error message from the backend if it exists.
    // This allows the component to display a meaningful error to the user.
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw new Error('An unexpected error occurred while fetching your links.');
    }
  }
};