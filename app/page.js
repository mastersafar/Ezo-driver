'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaMotorcycle } from "react-icons/fa"; // Delivery bike icon

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login"); // Redirect to login page after 5 seconds
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-red-400 via-orange-500 to-yellow-400 text-white">
      {/* Moving Delivery Car Animation */}
      <div className="animate-bounce">
        <FaMotorcycle className="text-[140px] text-white drop-shadow-lg animate-pulse" />
      </div>

      {/* Main Container */}
      <div className="text-center max-w-md p-8 bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-xl mt-6 border border-white border-opacity-20">
        <h1 className="text-4xl font-extrabold mb-6 text-white drop-shadow-md">
          🚀 تطبيق عزو للتوصيل
        </h1>
        <p className="text-lg text-gray-200 font-light mb-6">
          أسرع خدمة توصيل ! 🏍️✨
        </p>

        {/* Sign-In Button */}
        <div className="flex justify-center">
          <button 
            onClick={() => router.push('/login')} 
            className="px-6 py-3 bg-green-500 hover:bg-green-700 transition-all duration-300 text-white font-bold rounded-lg shadow-lg transform hover:scale-105">
            صفحة الدخول
          </button>
        </div>
      </div>
    </div>
  );
}
