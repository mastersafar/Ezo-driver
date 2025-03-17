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
    icon: "/logo.png",
    data: payload.data, // ✅ Pass data for click event
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// ✅ Handle Notification Click Event
self.addEventListener("notificationclick", function (event) {
  console.log("🔔 Notification clicked:", event.notification);

  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList[0];
        return client.focus();
      }

      // ✅ Redirect to Active Orders with Order ID
      return clients.openWindow("/active-orders?order_id=" + event.notification.data.order_id);
    })
  );
});
