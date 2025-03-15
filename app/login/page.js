'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { FaUser, FaLock, FaMotorcycle } from 'react-icons/fa';
import './login.css'; // Ensure styling aligns with the delivery app theme

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Login() {
  const [user, setUsername] = useState('driver1');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      console.log("API Base URL:", token);

      router.replace('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid credentials');
      }

      const data = await response.json();


      Cookies.set('token', data.token, {
        expires: 3,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

     window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message || 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper flex items-center justify-center min-h-screen bg-[f6e087]">
      <div className="login-container bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-4 flex items-center justify-center">
           تطبيق عزو للتوصيل    <FaMotorcycle className="mr-2 text-4xl" />
        </h2>
        <form onSubmit={handleLogin}>
          <div className="input-group flex items-center border border-gray-300 rounded p-2 mb-4">
            <FaUser className="text-gray-500 mr-2" />
            <input
              type="text"
              id="user"
              name="user"
              value={user}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="اسم المستخدم"
              className="w-full outline-none"
            />
          </div>
          <div className="input-group flex items-center border border-gray-300 rounded p-2 mb-4">
            <FaLock className="text-gray-500 mr-2" />
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="كلمة المرور"
              className="w-full outline-none"
            />
          </div>
          {error && (
            <p className="text-xs text-red-600 my-2 text-center">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded text-lg font-semibold hover:bg-green-700 transition"
            disabled={loading}
          >
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>

        <div className="text-center mt-4 text-gray-500 text-sm">
          Powered By @ Tasameem
        </div>
      </div>
    </div>
  );
}
