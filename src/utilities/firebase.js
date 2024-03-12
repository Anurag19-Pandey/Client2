import firebase from 'firebase/app';
// import { getMessaging, getToken } from 'firebase/messaging';
import 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyDoEkOV1ro1RQIIcKHDHJ4wIiCQHQRrdmI',
  authDomain: 'pointai-4eb6e.firebaseapp.com',
  projectId: 'pointai-4eb6e',
  storageBucket: 'pointai-4eb6e.appspot.com',
  messagingSenderId: '1065733671807',
  appId: '1:1065733671807:web:df252e8631ec154e4e284a',
  measurementId: 'G-67BTEGMR41',
};
// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// firebase.analytics();
let messaging = null;

if (firebase.messaging.isSupported()) {
  firebase.initializeApp(firebaseConfig);
  messaging = firebase.messaging();
} else {
  console.log('no-support :(');
}

export const getTokenn = (setTokenFound) => {
  return messaging
    ? messaging
        .getToken({
          vapidKey:
            'BB8uebqgBfNhB5Pm0yRwHvKC-HXjetM1DAUFbLLbVKyFBc_gWYDATjO-nSD_KmdqqVMOEoWoblZbznqGyvW4cy8',
        })
        .then((currentToken) => {
          if (currentToken) {
           
            setTokenFound(true);

            // messaging
            //   .getMessaging()
            //   .subscribeToTopic([currentToken], 'mohitpatel')
            //   .then((response) => {
            //     // See the MessagingTopicManagementResponse reference documentation
            //     // for the contents of response.
            //     console.log('Successfully subscribed to topic:', response);
            //   })
            //   .catch((error) => {
            //     console.log('Error subscribing to topic:', error);
            //   });

            return currentToken;

            // Track the token -> client mapping, by sending to backend server
            // show on the UI that permission is secured
          }
          
          setTokenFound(false);
          return '';
          // shows on the UI that permission is required
        })
        .catch((err) => {
          console.log('An error occurred while retrieving token. ', err);
          // catch error while creating client token
        })
    : null;
};

export const sibscribeToTopic = (tokensArray, topic) => {
  // These registration tokens come from the client FCM SDKs.
  fetch(`https://iid.googleapis.com/iid/v1/${tokensArray[0]}/rel/topics/priyamkhatri`, {
    method: 'POST',
    headers: {
      Authorization: `key=AAAA-CKtS38:APA91bECNiPZ8HAtSvapEcvjot3yL5aNI6AEBL8vZl5w5vPCsjca8hgKhs05qJTMFb08VBlvocvWQKTKZS6oa4E_hxV5TacLLmYlaFxpuc6MIpFEyouZiMQrdyZb5fXkU8sqwzmKIqIB`,
    },
    body: {
      data: {
        token: tokensArray[0],
      },
    },
  })
    .then((res) => res.json())
    .then((data) => console.log(data, 'hahahahahahahahaha'))
    .catch((err) => console.log(err, 'huhuhuhuhuhuhuhuhh'));
};

export const onMessageListener = () => {
 
  messaging.onMessage((payload) => {
    
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: payload.notification.image,
      image: payload.notification.image,
      url: payload.notification.url,
      action_name: payload.notification.action_name,
      action_url: payload.notification.action_url,
      click_action: payload.notification.click_action,
    };

    // self.registration.showNotification(notificationTitle, notificationOptions);

    if (!('Notification' in window)) {
      console.log('This browser does not support system notifications.');
    } else if (Notification.permission === 'granted') {
      // If it's okay let's create a notification

      const notification = new Notification(notificationTitle, notificationOptions);
      notification.onclick = function (event) {
        // event.preventDefault();
        window.open(payload.notification.click_action, '_blank');
        notification.close();
      };
    }
  });
};
