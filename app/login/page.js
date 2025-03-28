"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getFCMToken } from "@/services/firebase"; // ✅ Import FCM helper
import { FaUser, FaLock, FaMotorcycle } from "react-icons/fa";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Login() {
  const [user, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ Check if user is already logged in
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      console.log("🔑 User already logged in:", token);
      router.replace("/dashboard"); // ✅ Redirect if authenticated
    }
  }, [router]);

  // ✅ Handle Login Process
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // ✅ Step 1: Get FCM Token
      console.log("📡 Fetching FCM Token...");
      let fcmToken = await getFCMToken();

      if (!fcmToken) {
        console.warn("🚫 No FCM token received, notifications may not work.");
      }

      // ✅ Step 2: Send Login Request
      const response = await fetch(`${apiBaseUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, password ,fcm_token:fcmToken}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid credentials");
      }

      const data = await response.json();

      // ✅ Step 3: Store authentication token
      Cookies.set("token", data.token, {
        expires: 3,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      console.log("🚀 Logged in successfully, storing FCM token...");


      // ✅ Step 5: Redirect to Dashboard
      console.log("🔄 Redirecting to dashboard...");
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("❌ Login Error:", err);
      setError(err.message || "❌ حدث خطأ أثناء تسجيل الدخول.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper flex items-center justify-center min-h-screen bg-[#70a2f3]">
      <div className="login-container bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-8 mt-3 flex items-center justify-center">
          تطبيق عزو للتوصيل <FaMotorcycle className="mr-2 text-4xl" />
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
              className="w-full px-3 outline-none"
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
              className="w-full px-3 outline-none"
            />
          </div>

          {error && <p className="text-xs text-red-600 my-2 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded text-lg font-semibold  transition disabled:bg-green-700"
            disabled={loading}
          >
          {loading ? (
            <span className="flex justify-center gap-2">
              <svg className="animate-spin h-5 w-5 self-center text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              جاري تسجيل الدخول
            </span>
          ) : (
            "تسجيل الدخول"
          )}

          </button>
        </form>

        <div className="text-center mt-4 text-gray-500 text-sm">Powered By @ Tasameem</div>
      </div>
    </div>
  );
}
