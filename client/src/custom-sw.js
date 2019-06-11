/* eslint-disable */
/* eslint no-restricted-globals: "off" */
import * as precaching from 'workbox-precaching';
import axios from './utils/axios';
import { readAllData, deleteItemFromData } from './utils/utility';
// your own imports

if (self.__precacheManifest) {
  precaching.precacheAndRoute(self.__precacheManifest);
}

// your own code
const CACHE_STATIC = 'static-v0';
// const CACHE_DYNAMIC = 'dynamic-v1';

const STATIC_FILES = [
  '/favicon.ico',
  '/css/Roboto.css',
  '/css/MaterialIcons.css',
  '/icons/icon-144x144.png',
  '/icons/icon-96x96.png',
  '/manifest.json'
];

self.addEventListener('install', event => {
  console.log('[Service Worker] Installing Service Worker ...', event);

  event.waitUntil(
    caches.open(CACHE_STATIC).then(cache => {
      console.log('[Service Worker] Precaching the app...');

      cache.addAll(STATIC_FILES);
      self.skipWaiting();
    })
  );
  // self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ...', event);
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  // console.log('[Service Worker] Fetch:', event);
  // console.log('[Service Worker] Event.Request:', event.request);

  const url = '/api/add_notificationgroup';
  // If request url is the same as 'url'
  // console.log(event.request.url);
  if (event.request.url.indexOf(url) > -1) {
    event.respondWith(
      fetch(event.request).then(res => {
        var clonedRes = res.clone();
        console.log('ClonedRes:', clonedRes);
        return res;
      })
    );
  } else {
    event.respondWith(fetch(event.request));
  }
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
  console.log('[Service Worker] Background syncing');
  // console.log('[Service Worker] Background syncing', event);

  if (event.tag === 'sync-new-splash') {
    console.log('[Service Worker] Syncing new Splashes');
    event.waitUntil(
      readAllData('send-splash').then(data => {
        console.log('DATA from sync', data[0].id);

        fetch('/api/send_splash', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ groupId: data[0].id })
        })
          .then(res => {
            console.log('Sent data', res);
            deleteItemFromData('send-splash', data[0].id);
          })
          .catch(function(err) {
            console.log('Error while sending data', err);
          });
        // axios
        //   .post('/api/send_splash', { groupId: data[0].id })
        //   .then(res => {
        //     deleteItemFromData('send-splash', data[0].id);
        //   })
        //   .catch(function(err) {
        //     console.log('Error while sending data', err);
        //   });
      })
    );
  }
});
