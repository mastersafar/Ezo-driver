"use client";

import { useEffect, useState } from "react";
import { onMessageListener } from "@/services/firebase";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function NotificationHandler() {
  const [notification, setNotification] = useState(null);
  const [userInteracted, setUserInteracted] = useState(false);
  const router = useRouter();

  // ✅ Track if user interacted with the page
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
  
        // ✅ Parse order data
        let orderData = null;
        if (payload?.data?.order) {
          try {
            orderData = JSON.parse(payload.data.order);
          } catch (error) {
            console.error("❌ Error parsing order data:", error);
          }
        }
  
        setNotification({ 
          title: payload.notification?.title || "📢 إشعار جديد", 
          body: payload.notification?.body || "", 
          order: orderData 
        });
  
        // ✅ Show Toast Notification with Click Handling
        toast.success(payload.notification?.title, {
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
            if (orderData?.id) {
              console.log("🔄 Redirecting to order:", orderData.id);
              router.push(`/active-orders?orderId=${orderData.id}`);
            }
          },
        });
  
        // ✅ Play Notification Sound for Every Message
        if (userInteracted) {
          playNotificationSound();
        } else {
          console.warn("🚫 Waiting for user interaction before playing sound...");
        }
        
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
