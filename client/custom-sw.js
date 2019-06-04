/* eslint-disable */
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('fetch', function(event) {
  // console.log('[Service Worker] Fetch:', event);
});

self.addEventListener('notificationclick', event => {
  let notification = event.notification;
  let action = event.action;

  console.log(notification);

  if (action === 'confirm') {
    console.log('Confirm was chosen');
    notification.close();
  } else {
    console.log(action);
    notification.close();
  }
});

self.addEventListener('notificationclose', event => {
  console.log('Notification was closed', event);
});

self.addEventListener('push', event => {
  console.log('Push Notification received', event);

  // Fallback
  let data = {
    title: 'New',
    content: 'Something new happened!',
    openUrl: '/'
  };

  if (event.data) {
    data = JSON.parse(event.data.text());
  }

  var options = {
    body: data.content,
    icon: './icons/spash1.png',
    badge: './icons/bat.png',
    vibrate: [100, 50, 100, 50, 100],
    data: {
      url: data.openUrl
    }
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});
