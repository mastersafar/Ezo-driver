'use client';

import getToken from '@/services/getToken';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL+'/api';




export const getRequest = async (endpoint) => {

const token = getToken();
  
  if (!token) {
    throw new Error('Unauthorized: No Token Found');
  }

  console.log(`🚀 [GET] Fetching: ${apiBaseUrl}${endpoint}`);

  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  console.log(`📡 Response Status: ${response.status}`);

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status} - ${await response.text()}`);
  }

  const data = await response.json();
  console.log('✅ [GET] Response Data:', data);
  return data;
};







export const postRequest = async (endpoint, body) => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Unauthorized: No Token Found');
  }

  console.log(`🚀 [POST] Sending to: ${apiBaseUrl}${endpoint}`);
  console.log(`📦 Request Body:`, body);

  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  console.log(`📡 Response Status: ${response.status}`);

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status} - ${await response.text()}`);
  }

  const data = await response.json();
  console.log('✅ [POST] Response Data:', data);
  return data;
};
