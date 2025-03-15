'use client';

import Cookies from 'js-cookie'; // Import js-cookie for client-side token management
import api2 from '../services/api2';

const clientFetchWithAuth = async (endpoint) => {
  try {
    // Get the token from cookies
    const token = Cookies.get('token');

    if (!token) {
      throw new Error('Token is missing.');
    }

    // console.log('Fetching:', endpoint);
    // console.log('Using Token:', token);

    // Call the API service with the token in headers
    const response = await api2(endpoint, {
      headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store', // Force fresh data
    });


    return response.data; // Return the fetched data
  } catch (error) {
    console.error('Fetch Error:', error.response?.data || error.message);
    throw error; // Re-throw the error for the calling component to handle
  }
};

export default clientFetchWithAuth;
