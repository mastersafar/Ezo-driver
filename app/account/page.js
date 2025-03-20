"use client";

import { useEffect, useState } from "react";
import { getRequest } from "@/services/apiClient";
import PageTitle from "@/components/PageTitle";
import Loader from "./Loader";
import { FaCalendarAlt, FaSync } from "react-icons/fa";
import { format } from "date-fns";

export default function AccountPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState(format(new Date(), "yyyy-MM-01")); // First day of this month
  const [toDate, setToDate] = useState(format(new Date(), "yyyy-MM-dd")); // Today’s date
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ✅ Fetch Transactions from Backend
  const fetchTransactions = async () => {
    setIsRefreshing(true);
    try {
      const data = await getRequest(`/getBalance/${fromDate}/${toDate}`);
      //const data = await getRequest(`/try`);

      setTransactions(data.processes);
      setError(null);
    } catch (err) {
      setError("❌ حدث خطأ أثناء تحميل البيانات");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <PageTitle title=" كشف حساب">
      {/* ✅ Date Pickers */}
      <div className="flex flex-wrap md:flex-row items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-blue-600" />
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded p-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-blue-600" />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded p-2"
          />
        </div>

        <button
          onClick={fetchTransactions}
          className={`px-4 py-2 flex items-center gap-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition ${
            isRefreshing ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={isRefreshing}
        >
          <FaSync className={`${isRefreshing ? "animate-spin" : ""}`} />
          تحديث البيانات
        </button>
      </div>

      {/* ✅ Loading State */}
      {loading && <Loader />}

      {/* ✅ Error Message */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* ✅ Transactions Table */}
      {!loading && !error && transactions.length > 0 ? (
 <div className="overflow-x-auto">
 <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
   <thead className="bg-gray-200">
     <tr>
       <th className="border p-2">التاريخ</th>
       <th className="border p-2">العملية</th>
       <th className="border p-2">دائن</th>
       <th className="border p-2">مدين</th>
       <th className="border p-2">الرصيد</th>
       <th className="border p-2">ملاحظات</th>
     </tr>
   </thead>
   <tbody>
     {transactions.map((transaction, index) => (
       <tr key={index} className="text-center hover:bg-gray-100">
         <td className="border p-2">{transaction.date}</td>
         <td className="border p-2">{transaction.process_ch}</td>
         <td className="border p-2">{transaction.daen}</td>
         <td className="border p-2">{transaction.madin}</td>
         <td className={`border p-2 font-bold ${transaction.balance < 0 ? 'text-red-500' : 'text-green-500'}`}>
           {transaction.balance}
         </td>
         <td className="border p-2">{transaction.note || "—"}</td>
       </tr>
     ))}
   </tbody>
 </table>
</div>

      ) : (
        !loading && <p className="text-center text-gray-600 mt-6">⚠️ لا توجد بيانات متاحة</p>
      )}
    </PageTitle>
  );
}
