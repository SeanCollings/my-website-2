/* eslint-disable */
/* eslint no-restricted-globals: "off" */
import * as precaching from 'workbox-precaching';
// your own imports

if (self.__precacheManifest) {
  precaching.precacheAndRoute(self.__precacheManifest);
}

// your own code

self.addEventListener('install', event => {
  console.log('[Service Worker] Installing Service Worker ...', event);
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ...', event);
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  // console.log('[Service Worker] Fetch:', event);
  console.log('[Service Worker] Event.Request:', event.request);
  event.respondWith(fetch(event.request));
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
    event.waitUntil(
      clients.matchAll().then(clis => {
        const client = clis.find(c => {
          return c.visibilityState === 'visible';
        });

        if (client !== undefined) {
          client.navigate(notification.data.url);
          client.focus();
        } else {
          clients.openWindow(notification.data.url);
        }
        notification.close();
      })
    );
  }
});

self.addEventListener('notificationclose', event => {
  console.log('Notification was closed', event);
});

self.addEventListener('push', event => {
  try {
    console.log('Push Notification received', event);

    // Fallback
    let data = {
      title: 'New',
      content: 'Something new happened!',
      openUrl: '/'
    };

    if (event.data) {
      console.log('Event.data:', event.data);
      data = JSON.parse(event.data.text());
    }
    console.log('DATA:', data);
    var options = {
      body: data.content,
      icon: './icons/spash1.png',
      badge: './icons/bat.png',
      vibrate: [100, 50, 100, 50, 100],
      tag: 'splashed-notification',
      // renotify: true,
      data: {
        url: data.openUrl
      }
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  } catch (err) {
    console.log('ERROR:', err);
    throw err;
  }
});

self.addEventListener('sync', function(event) {
  console.log('[Service Worker] Background syncing', event);
});
