"use client";

import { useEffect, useState } from "react";
import { getRequest } from "@/services/apiClient";
import PageTitle from "@/components/PageTitle";
import { Bar } from "react-chartjs-2";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Loader from './Loader';

// ✅ Import Chart.js Components & Register Required Scales
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [weeklyOrders, setWeeklyOrders] = useState({});
  const [monthlyOrderCount, setMonthlyOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // ✅ Fetch User Info & Order Stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Fetch User Data
        const userData = await getRequest("/user");
        setUser(userData);

        // ✅ Fetch Order Statistics
        const data = await getRequest("/order-stats");
        setWeeklyOrders(data.orders_this_week);
        setMonthlyOrderCount(data.orders_this_month);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Handle Logout
  const handleLogout = () => {
    Cookies.remove("token", { path: "/" });
    router.replace("/login");
    router.refresh();
  };

  // ✅ Arabic Day Names Mapping
  const arabicDays = {
    "Saturday": "السبت",
    "Sunday": "الأحد",
    "Monday": "الإثنين",
    "Tuesday": "الثلاثاء",
    "Wednesday": "الأربعاء",
    "Thursday": "الخميس",
    "Friday": "الجمعة"
  };

  // ✅ Chart Data for Weekly Orders
  const chartData = {
    labels: Object.keys(weeklyOrders).map(day => arabicDays[day] || day), // Convert English days to Arabic
    datasets: [
      {
        label: "عدد الطلبات في الأسبوع",
        data: Object.values(weeklyOrders),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // ✅ Chart Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Prevents infinite resizing
    scales: {
      x: { type: "category" }, // Ensures correct scaling
      y: { beginAtZero: true },
    },
  };

  return (
    <PageTitle title="📊 لوحة التحكم">
      {loading && <Loader />}
      
      {/* ✅ User Greeting */}
      <div className="bg-white p-4 rounded-lg shadow-lg mb-6 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-gray-800">👋 مرحبًا, {user?.name || "المستخدم"}!</h2>
      </div>

      {/* ✅ Grid Layout for Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 📊 Weekly Orders Chart */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-3">📅 الطلبات الأسبوعية</h3>
          {loading ? (
            <p className="text-gray-500">جارٍ تحميل البيانات...</p>
          ) : (
            <div className="h-64"> {/* Fixed height to prevent infinite resizing */}
              <Bar data={chartData} options={chartOptions} />
            </div>
          )}
        </div>

        {/* 🔢 Monthly Order Count */}
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold mb-2">📆 الطلبات هذا الشهر</h3>
          <p className="text-4xl font-bold text-blue-600">{monthlyOrderCount}</p>
        </div>
      </div>

      {/* 🔴 Logout Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition shadow-md"
        >
          تسجيل الخروج
        </button>
      </div>
    </PageTitle>
  );
}
