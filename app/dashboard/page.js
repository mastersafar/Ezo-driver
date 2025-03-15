'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '../../services/api';
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await api(`${apiBaseUrl}/api/user`);
        //console.log(userData)
        setUser(userData);
      } catch (error) {
        Cookies.remove('token'); // Clear token if unauthenticated
        router.push('/login'); // Redirect to login
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
  // Remove the token from cookies
  Cookies.remove('token', { path: '/' });

  // Force navigation to the login page
  router.replace('/login');
  router.refresh(); // Ensure middleware is reevaluated
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
