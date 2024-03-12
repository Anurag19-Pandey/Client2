// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.0.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: 'AIzaSyBpPeRLuOqzE2NxFxuu5dtOwGTgvwC05hw',
  authDomain: 'ingenium-backend-197210.firebaseapp.com',
  databaseURL: 'https://ingenium-backend-197210.firebaseio.com',
  projectId: 'ingenium-backend-197210',
  storageBucket: 'ingenium-backend-197210.appspot.com',
  messagingSenderId: '686232401045',
  appId: '1:686232401045:web:c7523d06f9907d37f9d79c',
  measurementId: 'G-15RBG7S51T',
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// messaging.onMessage((payload) => {
//   console.log(
//     "[firebase-messaging-sw.js] Received forehand message ",
//     payload
//   );
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: payload.notification.image,
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

// messaging
//   .subscribeToTopic('priyamkhatri')
//   .then((response) => {
//     // See the MessagingTopicManagementResponse reference documentation
//     // for the contents of response.
//     console.log('Successfully subscribed to topic:', response);
//   })
//   .catch((error) => {
//     console.log('Error subscribing to topic:', error);
//   });

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background messagee ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'https://d150gnfeuxp7r1.cloudfront.net/1625650948251.png',
    image: 'https://d150gnfeuxp7r1.cloudfront.net/1631163495304.png',
    url: payload.notification.url,
    action_name: payload.notification.action_name,
    action_url: payload.notification.action_url,
    click_action: payload.notification.click_action,
  };
  window.open(payload.notification.click_action, '_blank');

  // self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
  const url = event.notification.data['gcm.notification.url'];
  event.notification.close(); // Android needs explicit close.
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        // If so, just focus it.
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        console.log(clients);
        return clients.openWindow(url);
      }
    }),
  );
});
