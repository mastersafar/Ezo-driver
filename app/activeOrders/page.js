"use client";

import { useEffect, useState, useRef } from "react";
import { getRequest } from "@/services/apiClient";
import PageTitle from "@/components/PageTitle";
import Card from "./Card";
import Loader from "./Loader";
import { FaSync } from "react-icons/fa";
import { useSearchParams, useRouter } from "next/navigation";

export default function ActiveOrders() {
  const [orders, setOrders] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [disappearingOrders, setDisappearingOrders] = useState(new Set());
  const [highlightedOrderId, setHighlightedOrderId] = useState(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const orderRefs = useRef({}); // Store refs for each order

  // ✅ Function to Fetch Active Orders & Handle Disappearing Orders
  const fetchOrders = async (clearOrderId = false) => {
    setIsRefreshing(true);

    try {
      const data = await getRequest("/active");

      // ✅ Get Current Order IDs
      const newOrderIds = new Set(data.orders.map((order) => order.id));

      // ✅ Identify Orders That Have Disappeared
      const removedOrders = orders.filter((order) => !newOrderIds.has(order.id));

      // ✅ Animate Disappearing Orders
      if (removedOrders.length > 0) {
        setDisappearingOrders(new Set(removedOrders.map((order) => order.id)));

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

      // ✅ Clear orderId from URL if refreshing manually
      if (clearOrderId) {
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.delete("orderId");
        router.replace(`/activeOrders?${currentParams.toString()}`, { scroll: false });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const handleOrderUpdate = () => {
      fetchOrders(); // ✅ Re-fetch orders when a new order is assigned
    };
  
    window.addEventListener("orderUpdated", handleOrderUpdate);
    return () => window.removeEventListener("orderUpdated", handleOrderUpdate);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [searchParams]); // ✅ Re-fetch orders when URL changes
  
  

  // ✅ Detect `orderId` from URL & Highlight + Scroll to Order
  useEffect(() => {
    const orderId = searchParams.get("orderId");
    if (orderId) {
      setHighlightedOrderId(orderId);

      // ✅ Scroll to the order smoothly
      setTimeout(() => {
        if (orderRefs.current[orderId]) {
          orderRefs.current[orderId].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 500);

      // ✅ Remove highlight after 5 seconds
      setTimeout(() => {
        setHighlightedOrderId(null);
      }, 5000);
    }
  }, [searchParams, orders]);

  useEffect(() => {
    const handleFocusOrder = (event) => {
      const orderId = event.detail;
      console.log("🎯 Focusing Order:", orderId);
      setHighlightedOrderId(orderId);
  
      // ✅ Scroll to the order smoothly
      setTimeout(() => {
        if (orderRefs.current[orderId]) {
          orderRefs.current[orderId].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 500);
  
      // ✅ Remove highlight after 5 seconds
      setTimeout(() => {
        setHighlightedOrderId(null);
      }, 5000);
    };
  
    // ✅ Listen for `focusOrder` event
    window.addEventListener("focusOrder", handleFocusOrder);
    return () => window.removeEventListener("focusOrder", handleFocusOrder);
  }, []);
  

  return (
    <PageTitle title="📦 متابعة الرحلات">
      {/* ✅ Show Loader While Fetching */}
      {loading && <Loader />}

      {/* ❌ Show Error Message */}
      {error && <div className="text-center text-red-500 mt-6">❌ حدث خطأ: {error}</div>}

      {/* ✅ Orders Grid */}
      {!loading && !error && orders.length > 0 ? (
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          {orders.map((order) => (
            <li
              key={order.id}
              ref={(el) => (orderRefs.current[order.id] = el)}
              className={`transition-opacity duration-500 p-2 rounded-lg
                ${disappearingOrders.has(order.id) ? "opacity-0" : "opacity-100"}
                ${highlightedOrderId == order.id ? "shadow-[0_0_15px_5px_#007bff]" : ""}`}
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
        onClick={() => fetchOrders(true)} // ✅ Pass `true` to clear `orderId`
        className={`fixed bottom-4 left-4 flex items-center gap-2 p-3 rounded-full
          bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition
          ${isRefreshing ? "cursor-not-allowed opacity-70" : ""}`}
        disabled={isRefreshing}
      >
        <FaSync className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`} />
      </button>
    </PageTitle>
  );
}
