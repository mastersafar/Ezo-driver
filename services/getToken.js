'use client';

import Cookies from 'js-cookie';


const getToken = () => {

let token = Cookies.get('token');
    
  console.log('🔑 Retrieved Token:', token);

  return token;
};

export default getToken;
