'use client';

import { useState, useEffect } from 'react';
import { postRequest } from '@/services/apiClient';
import { FaCheckCircle, FaRegCircle, FaTruck, FaClipboardList, FaPlus, FaMinus ,FaStore, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';



// ✅ Card Component - Displays Order Information with Status Progress Bar (RTL)
export default function Card({ initialOrder, statuses }) {
  const [order, setOrder] = useState(initialOrder);
  const [isUpdating, setIsUpdating] = useState(false);
  const [price, setPrice] = useState(parseFloat(initialOrder.delivery_fee));
  const [priceChanged, setPriceChanged] = useState(false);

  useEffect(() => {
    if (!order || !order.status) {
      console.warn("⚠️ Order data is missing or incomplete!", order);
    }
  }, [order]);

  if (!order || !order.status) {
    return <p className="text-red-500 font-bold text-center">❌ لا يمكن تحميل تفاصيل الطلب</p>;
  }

  // Get the index of the current order status in the statuses array
  const currentStatusIndex = statuses.findIndex((s) => s.id === order.status?.id);
  const nextStatus = statuses[currentStatusIndex + 1] || null;

  // Icon mapping based on status ID
  const statusIcons = {
    1: <FaClipboardList className="w-5 h-5" />,
    2: <FaCheckCircle className="w-5 h-5" />,
    3: <FaStore className="w-5 h-5" />,
    4: <FaTruck className="w-5 h-5" />,
    5: <FaCheckCircle className="w-5 h-5" />,
  };

  // 🔄 Handle Status Update using `postRequest`
  const updateStatus = async () => {
    if (!nextStatus || isUpdating) return;

    setIsUpdating(true);

    try {
      const response = await postRequest('/update-order-status', {
        orderId: order.id,
        statusId: nextStatus.id,
      });

      if (response?.order) {
        setOrder(response.order);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      alert('❌ حدث خطأ أثناء تحديث الحالة');
    } finally {
      setIsUpdating(false);
    }
  };

  // 🔄 Handle Price Change
  const adjustPrice = (amount) => {
    let newPrice = Math.round(price + amount); // ✅ Always round to the nearest integer
    const minPrice = Math.round(parseFloat(order.min_price));
    const maxPrice = Math.round(parseFloat(order.max_price));
  
    if (!isNaN(maxPrice) && newPrice > maxPrice) return;
  
    setPrice(newPrice);
    setPriceChanged(true);
  };
  
  

  // 🔄 Submit New Price
  const submitNewPrice = async () => {
    setIsUpdating(true);

    try {
      const response = await postRequest('/update-order-price', {
        orderId: order.id,
        newPrice: price,
      });

      if (response?.order) {
        setOrder(response.order);
        setPriceChanged(false); // Reset modification state
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      alert('❌ حدث خطأ أثناء تحديث السعر');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-lg border border-gray-300 text-right">

      <h3 className="text-xl mb-2 w-fit font-bold text-gray-900 bg-gradient-to-r from-green-400 to-green-500 
                    px-5 py-1 rounded-tl-3xl rounded-br-3xl shadow-lg shadow-gray-400/50 flex items-center 
                    gap-2 transition-all border border-green-600 hover:border-green-700">
        <FaClipboardList className="text-white text-lg drop-shadow-md hover:scale-110 transition-transform" />
        <span className="drop-shadow-md">{order.order_number || 'N/A'}</span>
      </h3>


      <p className="text-gray-700 flex items-center gap-2">
        <FaStore className="text-amber-500" />
        <strong>المطعم:</strong> {order.restaurant?.name || 'غير معروف'}
      </p>

      <p className="text-gray-700 flex items-center gap-2">
        <FaMapMarkerAlt className="text-red-500" />
        <strong>المنطقة:</strong> {order.area?.name || 'غير معروف'}
      </p>

      <p className="text-gray-700 flex items-center gap-2">
        <FaPhoneAlt className="text-green-500" />
        <strong>الهاتف:</strong>
        {order.phone ? (
          <a href={`tel:${order.phone}`} className="text-green-600 font-bold hover:underline">
            {order.phone}
          </a>
        ) : 'غير معروف'}
      </p>
      

      {/* 🛒 Order Status Progress Bar (RTL) */}
      <div className="mt-4">
        <p className="font-bold text-gray-700">🛒 حالة الطلب:</p>
        <div className="relative w-full bg-gray-200 rounded-lg h-6 mt-2 overflow-hidden">
          <div 
            className="absolute top-0 right-0 h-6 bg-blue-600 text-white text-center text-xs font-semibold rounded-lg flex items-center justify-center transition-all whitespace-nowrap overflow-hidden"
            style={{
              width: `${((currentStatusIndex + 1) / statuses.length) * 100}%`,
            }}
          >
            {order.status?.label || 'N/A'}
          </div>
        </div>
      </div>

      {/* 🔄 Status Steps with Clickable Next Status Icon (RTL) */}
      <div className="flex mt-3 gap-5 text-xs text-gray-600 flex-wrap">
        {statuses.map((status, index) => (
          <div key={status.id} className="flex flex-col items-center">
            {index === currentStatusIndex + 1 ? (
              // ✅ Next status is clickable
              <button
                onClick={updateStatus}
                disabled={isUpdating}
                className={`h-10 w-10 flex items-center justify-center rounded-full shadow-md transition-all ${
                  isUpdating ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isUpdating ? '⏳' : statusIcons[status.id] || <FaRegCircle className="w-5 h-5" />}
              </button>
            ) : (
              // 🔄 Normal status icon (past & current)
              <div
                className={`h-10 w-10 flex items-center justify-center rounded-full shadow-md ${
                  index <= currentStatusIndex ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}
              >
                {statusIcons[status.id] || <FaRegCircle className="w-5 h-5" />}
              </div>
            )}
            <span className={`mt-1 text-sm ${index <= currentStatusIndex ? 'text-blue-700 font-bold' : ''}`}>
              {status.label}
            </span>
          </div>
        ))}
      </div>

      {/* 💰 Order Pricing Info with Adjustment */}
      <div className="mt-4 bg-gray-100 p-3 rounded-md shadow-sm">
        <p className="text-gray-700 font-bold">💰 سعر التوصيل:</p>
        
        <div className="flex items-center justify-between">
        {/* ➖ Decrease Button - Disabled if price <= minPrice */}
        <button
          onClick={() => adjustPrice(-1)}
          disabled={price <= Math.round(parseFloat(order.min_price)) || order.status_id >= 5} 
          className={`px-3 py-1 rounded-lg transition shadow-md ${
            price <= Math.round(parseFloat(order.min_price)) || order.status_id >= 5
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-red-500 text-white hover:bg-red-600'
          }`}
        >
          <FaMinus />
        </button>

        {/* 🏷️ Price Display - Changes color if modified */}
        <p className={`text-lg font-bold px-4 py-1 rounded-md transition ${
          priceChanged ? 'text-orange-600 bg-yellow-100/70' : 'text-gray-700'
        }`}>
          {price.toFixed(2)} دينار
        </p>

        {/* ➕ Increase Button - Disabled if price >= maxPrice */}
        <button
          onClick={() => adjustPrice(1)}
          disabled={price >= Math.round(parseFloat(order.max_price)) || order.status_id >= 5}
          className={`px-3 py-1 rounded-lg transition shadow-md ${
            price >= Math.round(parseFloat(order.max_price)) || order.status_id >= 5
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          <FaPlus />
        </button>
      </div>



        <p className="text-gray-500 text-sm">
          ({order.min_price || 'N/A'} - {order.max_price || 'N/A'}) دينار
        </p>

        {/* Submit Button */}
        {priceChanged && (order.status_id < 5) && (
          <button
          onClick={submitNewPrice}
          className="mt-2 w-full px-5 py-2 border-2 border-blue-600 text-blue-600 font-bold rounded-lg 
                    transition-all shadow-md hover:bg-blue-600 hover:text-white 
                    active:scale-95 focus:ring-2 focus:ring-blue-300"
        >
          تحديث السعر
        </button>
        )}
      </div>
    </div>
  );
}
