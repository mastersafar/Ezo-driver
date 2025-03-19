"use client";

import { useEffect, useState } from "react";
import { onMessageListener } from "@/services/firebase";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function NotificationHandler() {
  const [notification, setNotification] = useState(null);
  const [userInteracted, setUserInteracted] = useState(false);
  const router = useRouter();

  // ✅ Track user interaction to allow sound playback
  useEffect(() => {
    const handleUserInteraction = () => {
      console.log("✅ User interacted, enabling sound playback...");
      setUserInteracted(true);
    };

    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("keydown", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    console.log("📡 Listening for foreground notifications...");
    onMessageListener()
      .then((payload) => {
        console.log("📩 Foreground Notification:", payload);

        // ✅ Extract Order ID from data
        const orderId = payload?.data?.order_id;

        // ✅ Show Toast Notification with Click Handling
        toast.success(payload.notification?.title || "📢 إشعار جديد", {
          duration: 5000,
          position: "top-right",
          icon: "📢",
          style: {
            background: "#1e293b",
            color: "#f8fafc",
            padding: "10px",
            borderRadius: "10px",
          },
          onClick: () => {
            if (orderId) {
              console.log("🔄 Redirecting to order:", orderId);
          
              if (currentPath.startsWith("/activeOrders")) {
                // ✅ Update the URL without reloading the page
                const newUrl = `/activeOrders?orderId=${orderId}`;
                window.history.pushState(null, "", newUrl);
                window.dispatchEvent(new Event("orderUpdated"));
              } else {
                // ✅ Redirect normally if not on the page
                router.push(`/activeOrders?orderId=${orderId}`);
              }
            }
          },
          
        });

        // ✅ Play Notification Sound for Every Message

        
      
          playNotificationSound();
 

        // ✅ Automatically Redirect to Order After 3 Seconds (Optional)
        setTimeout(() => {         
            router.push(`/activeOrders?orderId=${orderId}`);          
        }, 1500);
      })
      .catch((err) => console.error("❌ Error handling notification:", err));
  }, [userInteracted]);

  // ✅ Function to Play Custom Sound
  const playNotificationSound = () => {
    console.log("🔊 Playing Notification Sound");
    const audio = new Audio("/notification.wav"); // ✅ Ensure file is in `/public/`
    audio.play().then(() => {
      console.log("✅ Sound played successfully");
    }).catch((err) => {
      console.error("❌ Error playing sound:", err);
      if (!userInteracted) {
        console.warn("🚫 User interaction required. Waiting for user action...");
      }
    });
  };

  return null; // This component listens for notifications, no UI needed
}
