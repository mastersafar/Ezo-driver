const SW_VERSION = "1.2.0"; // Change this version number


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



self.addEventListener("push", function (event) {
  console.log("Push event received!", event);

  const notificationData = event.data.json();
  const notificationTitle = notificationData.notification.title;
  const notificationOptions = {
      body: notificationData.notification.body,
      icon: "/logo.png",
      data: notificationData.data
  };

  event.waitUntil(
      self.registration.showNotification(notificationTitle, notificationOptions)
  );
});

// Keep service worker running in background
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// self.addEventListener("notificationclick", function (event) {
//   console.log("🔔 Notification Clicked NOOOO:", event.notification);

//   event.notification.close();

//   // ✅ Extract order_id from `data` (most reliable source)
//   const orderId = event.notification.data?.order_id || 
//                   (event.notification.fcmOptions?.link?.includes("orderId=") 
//                     ? event.notification.fcmOptions.link.split("orderId=")[1] 
//                     : null);

//   event.waitUntil(
//     clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
//       if (clientList.length > 0) {
//         let client = clientList[0];
//         return client.navigate(`/active-orders?orderId=${orderId}`).then(() => client.focus());
//       }
//       if (orderId) {
//         return clients.openWindow(`/active-orders?orderId=${orderId}`);
//       }
//       return clients.openWindow("/active-orders");
//     })
//   );
// });


self.addEventListener("notificationclick", function (event) {
  console.log("🔔 Notification Clicked222:", event.notification);

  event.notification.close(); // Close notification

  // ✅ Extract order_id from the notification
  const orderId = event.notification?.data?.order_id;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList[0];
        return client.focus();
      }
      
      if (orderId) {
        console.log("✅ Opening Order: -----", orderId);
        return clients.openWindow(`/activeOrders?orderId=${orderId}`);
      }
      
      return clients.openWindow("/activeOrders"); // Default route if order ID is missing
    })
  );
});

