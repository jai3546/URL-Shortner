// client/src/services/apiService.js

// 1. Import the axios library, which we will use to make HTTP requests.
import axios from 'axios';

/**
 * @desc    Sends a long URL to the backend API to be shortened.
 * @param   {string} longUrl The URL that the user wants to shorten.
 * @returns {Promise<object>} A promise that resolves to the data returned from the API.
 *          On success, this will be an object like: { success: true, data: { ...urlObject } }.
 *          On failure, the promise will be rejected with an error object.
 */
export const createShortUrl = async (longUrl) => {
  // 2. Use a try...catch block to handle potential network errors gracefully.
  try {
    // 3. Make the asynchronous POST request using axios.
    //    - The first argument is the URL of the API endpoint. We use a relative path
    //      because our Vite proxy will automatically forward this request to our
    //      backend server (http://localhost:5000/api/shorten).
    //    - The second argument is the request body (the payload). Our backend
    //      expects an object with a 'longUrl' property.
    const response = await axios.post('/api/shorten', { longUrl });

    // 4. If the request is successful, axios wraps the response in a 'data' object.
    //    We return this data so the component that called this function can use it.
    return response.data;

  } catch (error) {
    // 5. If the request fails, axios throws an error.
    console.error('API Error: Failed to create short URL', error);

    // We check if the error object has a 'response' and 'data' property.
    // This is where axios places the error response sent from our backend.
    // Re-throwing this allows our component to catch a more specific error message.
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      // If it's a network error or something else, throw a generic error.
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
};
