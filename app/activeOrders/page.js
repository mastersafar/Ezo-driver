'use client';

import { useEffect, useState } from 'react';
import { getRequest } from '@/services/apiClient';
import PageTitle from '@/components/PageTitle';
import Card from './Card';
import Loader from './Loader';
import { FaSync } from 'react-icons/fa';

export default function activeOrders() {
  const [orders, setOrders] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [disappearingOrders, setDisappearingOrders] = useState(new Set()); // Track removed orders

  const fetchOrders = async () => {
    setIsRefreshing(true);
    try {
      const data = await getRequest('/active');
      
      // Get the current order IDs
      const newOrderIds = new Set(data.orders.map(order => order.id));

      // Find orders that are missing in the new response
      const removedOrders = orders.filter(order => !newOrderIds.has(order.id));

      // Animate disappearing orders
      if (removedOrders.length > 0) {
        setDisappearingOrders(new Set(removedOrders.map(order => order.id)));

        // Wait for animation to finish before updating state
        setTimeout(() => {
          setOrders(data.orders);
          setStatuses(data.statuses);
          setDisappearingOrders(new Set()); // Clear disappearing orders
        }, 500); // Matches CSS animation duration
      } else {
        setOrders(data.orders);
        setStatuses(data.statuses);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <PageTitle title="متابعة الرحلات">
      {loading && <Loader />}

      {error && <div className="text-center text-red-500 mt-6">❌ حدث خطأ: {error}</div>}

      {!loading && !error && orders.length > 0 ? (
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          {orders.map((order) => (
            <li
              key={order.id}
              className={`transition-opacity duration-500 ${disappearingOrders.has(order.id) ? 'opacity-0' : 'opacity-100'}`}
            >
              <Card initialOrder={order} statuses={statuses} />
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p className="text-center text-gray-600 mt-6">⚠️ لا توجد طلبات متاحة</p>
      )}

      {/* 🔄 Floating Refresh Button */}
      <button
        onClick={fetchOrders}
        className={`fixed bottom-4 left-4 flex items-center gap-2 p-3 rounded-full
          bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition
          ${isRefreshing ? 'cursor-not-allowed opacity-70' : ''}`}
        disabled={isRefreshing}
      >
        <FaSync className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
      </button>
    </PageTitle>
  );
}
