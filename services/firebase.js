import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// ✅ Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Only Initialize Messaging in Browser
let messaging = null;

if (typeof window !== "undefined") {
  messaging = getMessaging(app);
}

// ✅ Function to Get FCM Token
export const getFCMToken = async () => {
  if (!messaging) {
    console.warn("⚠️ Firebase Messaging is not available on the server.");
    return null;
  }

  try {
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.error("❌ Missing VAPID key in .env.local");
      return null;
    }

    const token = await getToken(messaging, { vapidKey });

    if (token) {
      console.log("🔑 FCM Token:", token);
      return token;
    } else {
      console.warn("⚠️ No FCM token available. Permission denied?");
      return null;
    }
  } catch (error) {
    console.error("❌ Error getting FCM token:", error);
    return null;
  }
};

// ✅ Function to Listen for Notifications
export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) {
      console.warn("⚠️ Firebase Messaging is not available on the server.");
      return;
    }

    onMessage(messaging, (payload) => {
      console.log("🔔 Notification Received:", payload);
      resolve(payload);
    });
  });

  export const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
      try {
        await navigator.serviceWorker.register("/firebase-messaging-sw.js");
        console.log("✅ Service Worker Registered!");
      } catch (error) {
        console.error("❌ Service Worker Registration Failed:", error);
      }
    }
  };


  
  
