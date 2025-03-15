import { cookies } from 'next/headers';
import api2 from '../services/api2';

const fetchWithAuth = async (endpoint) => {
  try {
    // Get the token from cookies
    const token = cookies().get('token')?.value;

    if (!token) {
      throw new Error('Token is missing.');
    }

    // Call the API service with the token in headers
    const response = await api2(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store', // Force fresh data
    });

    return response.data; // Return the fetched data
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error; // Re-throw the error for the calling component to handle
  }
};

export default fetchWithAuth;
