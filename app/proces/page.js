'use client';

import { useEffect, useState } from 'react';
import { getRequest } from '@/services/apiClient';
import PageTitle from '@/components/PageTitle';
import Loader from './Loader';
import { 
  FaBoxOpen, FaUser, FaMoneyBillWave, FaShippingFast, FaPhoneAlt, FaStore, FaMapMarkerAlt, 
  FaClock, FaCheckCircle, FaBox, FaTruck, FaThumbsUp, FaBan, FaPhoneSlash, FaExclamationTriangle, FaClipboardList 
} from 'react-icons/fa';

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getRequest('/orders');
        setOrders(data.orders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const statusColors = {
    1: { bg: 'bg-yellow-500', icon: <FaClock className="text-white" />, text: 'text-yellow-50' }, // في انتظار الموافقة
    2: { bg: 'bg-green-500', icon: <FaThumbsUp className="text-white" />, text: 'text-green-50' }, // تمت الموافقة
    3: { bg: 'bg-blue-500', icon: <FaStore className="text-white" />, text: 'text-blue-50' }, // السائق وصل للمطعم
    4: { bg: 'bg-indigo-500', icon: <FaTruck className="text-white" />, text: 'text-indigo-50' }, // السائق استلم الطلبية
    5: { bg: 'bg-teal-500', icon: <FaCheckCircle className="text-white" />, text: 'text-teal-50' }, // تم التسليم
    6: { bg: 'bg-gray-500', icon: <FaBan className="text-white" />, text: 'text-gray-50' }, // مقفل
    7: { bg: 'bg-red-500', icon: <FaPhoneSlash className="text-white" />, text: 'text-red-50' }, // لم يرد
    8: { bg: 'bg-orange-500', icon: <FaExclamationTriangle className="text-white" />, text: 'text-orange-50' }, // تأخير في التوصيل
  };

  return (
    <PageTitle title="📜 قائمة الطلبات">

      {loading && <Loader />}

      {error && <div className="text-center text-red-500 mt-6">❌ حدث خطأ: {error}</div>}

      {!loading && !error && orders.length > 0 ? (
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {orders.map((order) => {
            // ✅ Move status logic inside the map function
            const orderStatus = order.status?.id;
            const statusStyle = statusColors[orderStatus] || { 
              bg: 'bg-gray-400', 
              icon: <FaBox className="text-white" />, 
              text: 'text-gray-50' 
            };

            return (
              <li key={order.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-transform hover:scale-105">
                {/* 🔷 Order Number with Styled Header */}
                <h3 className="text-xl mb-3 font-bold text-gray-900 bg-gradient-to-r from-blue-300 to-blue-400 
                              px-5 py-1 rounded-tl-3xl rounded-br-3xl shadow-md shadow-gray-400/50 
                              flex items-center gap-2 transition-all border border-blue-500 hover:border-blue-700 w-fit">
                  <FaBoxOpen className=" text-white text-lg drop-shadow-md" />
                  <span className="drop-shadow-md">{order.order_number || 'N/A'}</span>
                </h3>

                {/* 🔹 Order Details */}
                <p className="text-gray-700 flex items-center gap-2">
                  <FaUser className="text-indigo-500" />
                  <strong>المستخدم:</strong> {order.user_id}
                </p>

                <p className="text-gray-700 flex items-center gap-2">
                  <FaMoneyBillWave className="text-green-500" />
                  <strong>إجمالي السعر:</strong> {order.total_price} LYD
                </p>

                <p className="text-gray-700 flex items-center gap-2">
                  <FaShippingFast className="text-red-500" />
                  <strong>رسوم التوصيل:</strong> {order.delivery_fee} LYD
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

                <p className="text-gray-700 flex items-center gap-2">
                  <FaStore className="text-amber-500" />
                  <strong>المطعم:</strong> {order.restaurant?.name || 'غير معروف'}
                </p>

                <p className="text-gray-700 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-500" />
                  <strong>المنطقة:</strong> {order.area?.name || 'غير معروف'}
                </p>

                <p className="text-gray-700 flex items-center gap-2">
                  <FaClock className="text-gray-500" />
                  <strong>تاريخ الإنشاء:</strong> {new Date(order.created_at).toLocaleString()}
                </p>

                {/* 🔹 Status Indicator */}
                <p className={`flex items-center gap-2 font-semibold text-sm mt-2 p-2 rounded-lg shadow-sm ${statusStyle.bg} ${statusStyle.text}`}>
                  {statusStyle.icon}
                  <span>{order.status?.name || 'غير معروف'}</span>
                </p>
              </li>
            );
          })}
        </ul>
      ) : (
        !loading && <p className="text-center text-gray-600 mt-6">⚠️ لا توجد طلبات متاحة</p>
      )}
    </PageTitle>
  );
}
