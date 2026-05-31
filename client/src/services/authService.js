// client/src/services/authService.js

import axios from 'axios';

const API_URL = '/api/auth/';

/**
 * Service to handle user registration routine
 */
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(API_URL + 'register', userData);
    
    // CHANGE 1: Save token automatically on success
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('API Error: Registration routine failed', error);
    
    // CHANGE 2: Just throw the exact string message from backend, not the whole object!
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Registration failed.');
    }
  }
};

/**
 * Service to handle user login routine
 */
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(API_URL + 'login', credentials);
    
    // CHANGE 1: Save token automatically on success
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('API Error: Login routine failed', error);
    
    // CHANGE 2: Just throw the exact string message from backend, not the whole object!
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Login failed.');
    }
  }
};