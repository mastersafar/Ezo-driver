import Cookies from 'js-cookie';
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// const api2 = async (url, options = {}) => {
//   let token;

//   if (typeof window === 'undefined') {
//     // Server-side: Use headers passed explicitly
//     const { headers } = options;
//     token = headers?.Authorization?.replace('Bearer ', '');
//     console.log('Server-side token in api2:', token);
//   } else {
//     // Client-side: Use Cookies API
//     token = Cookies.get('token');
//     console.log('Client-side token in api2:', token);
//   }

//   const headers = {
//     'Content-Type': 'application/json',
//     ...options.headers,
//   };

//   if (token) {
//     headers.Authorization = `Bearer ${token}`;
//   } else {
//     console.error('Token is missing, API request may fail.');
//   }

//   try {
//     const response = await fetch(`${apiBaseUrl}/api${url}?t=${Date.now()}`, {
//       cache: 'no-store',
//       ...options,
//       headers,

//     });

//     console.log('Response status:', response.status);

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('Fetch error:', error.message);
//     throw error;
//   }
// };

const api2 = async (url, options = {}) => {
  let token = Cookies.get('token');
  console.log('Client-side token in api2:', token);

  const headers = {


    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else {
    console.error('Token is missing, API request may fail.');
  }

  console.log('Sending request to:', `${apiBaseUrl}/api${url}`);
  console.log('Headers:', headers);

  try {
    const response = await fetch(`${apiBaseUrl}/api${url}?t=${Date.now()}`, {
      cache: 'no-store',
      ...options,
      headers,
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text(); // Capture API response text
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error.message);
    throw error;
  }
};


export default api2;
