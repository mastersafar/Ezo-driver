importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js");

// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// ✅ Handle Background Push Notification
messaging.onBackgroundMessage((payload) => {
  console.log("🔔 Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icons/icon-192x192.png", // Ensure you have this icon
    badge: "/icons/badge.png", // Optional badge icon
    vibrate: [200, 100, 200], // ✅ Custom vibration pattern
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// ✅ Handle Click Events on Notifications
self.addEventListener("notificationclick", (event) => {
  console.log("🔔 Notification clicked:", event);
  event.notification.close();

  event.waitUntil(
    clients.openWindow("/active-orders") // ✅ Redirect to active orders page
  );
});
