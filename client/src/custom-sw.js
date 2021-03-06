/* eslint-disable */
/* eslint no-restricted-globals: "off" */
import * as precaching from 'workbox-precaching';
import {
  readAllData,
  writeData,
  deleteItemFromData,
  clearAllData
} from './utils/utility';

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

self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating Service Worker ...', event);
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(function(key) {
          if (key !== CACHE_STATIC) {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

const isInCache = (requestURL, cacheArr) =>
  cacheArr.some(url => url === requestURL.replace(self.origin, ''));

self.addEventListener('fetch', event => {
  // console.log('[Service Worker] Fetch:', event);

  const urlGetCurrentUser = '/api/current_user';
  const urlGetUserSettings = '/api/get_usersettings';
  const urlAddNotificationGroups = '/api/add_notificationgroup';
  const urlGetNotificationGroups = '/api/get_notificationgroups';
  const urlGetLocationGroups = '/api/get_locationgroups';
  const urlGetWinners = '/api/get_winners';
  const urlGetWinnerYears = '/api/get_winneryears';
  const urlGetPererittoPlayers = '/api/get_pereritto';
  const urlGetSlates = '/api/get_slates';
  const urlCompletedSlates = '/api/get_completed_slates';
  const urlGetSavedQuizzes = '/api/get_saved_quizzes';
  const urlGetTotalQuestions = '/api/get_total_questions';

  // If request url is the same as 'url'
  if (event.request.url.indexOf(urlGetCurrentUser) > -1) {
    event.respondWith(
      fetch(event.request).then(res => {
        var clonedRes = res.clone();

        clearAllData('current-user')
          .then(() => {
            const jsonRes = clonedRes.json();
            return jsonRes;
          })
          .then(data => {
            writeData('current-user', {
              ...data,
              id: new Date()
            });
          })
          .catch(err => console.log(err));

        return res;
      })
    );
  } else if (event.request.url.indexOf(urlGetUserSettings) > -1) {
    event.respondWith(
      fetch(event.request).then(res => {
        var clonedRes = res.clone();

        clearAllData('user-settings')
          .then(() => {
            return clonedRes.json();
          })
          .then(data => {
            writeData('user-settings', {
              ...data,
              id: new Date()
            });
          })
          .catch(err => console.log(err));

        return res;
      })
    );
  } else if (event.request.url.indexOf(urlAddNotificationGroups) > -1) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          var clonedRes = res.clone();
          console.log('ClonedRes:', clonedRes);
          return res;
        })
        .catch(err => console.log(err))
    );
  } else if (event.request.url.indexOf(urlGetNotificationGroups) > -1) {
    event.respondWith(
      fetch(event.request).then(res => {
        var clonedRes = res.clone();

        clearAllData('notification-groups')
          .then(() => {
            return clonedRes.json();
          })
          .then(data => {
            for (let key in data) {
              writeData('notification-groups', {
                ...data[key],
                id: data[key]._id
              });
            }
          })
          .catch(err => console.log(err));

        return res;
      })
    );
  } else if (event.request.url.indexOf(urlGetLocationGroups) > -1) {
    event.respondWith(
      fetch(event.request).then(res => {
        var clonedRes = res.clone();

        clearAllData('location-groups')
          .then(() => {
            return clonedRes.json();
          })
          .then(data => {
            for (let key in data) {
              writeData('location-groups', {
                ...data[key],
                id: data[key]._id
              });
            }
          })
          .catch(err => console.log(err));

        return res;
      })
    );
  } else if (event.request.url.indexOf(urlGetWinners) > -1) {
    event.respondWith(
      fetch(event.request).then(res => {
        var clonedRes = res.clone();

        clearAllData('winners')
          .then(() => {
            return clonedRes.json();
          })
          .then(data => {
            for (let key in data) {
              writeData('winners', {
                ...data[key],
                id: data[key]._id
              });
            }
          })
          .catch(err => console.log(err));
        return res;
      })
    );
  } else if (event.request.url.indexOf(urlGetWinnerYears) > -1) {
    event.respondWith(
      fetch(event.request).then(res => {
        var clonedRes = res.clone();

        clearAllData('winner-years')
          .then(() => {
            return clonedRes.json();
          })
          .then(data => {
            writeData('winner-years', {
              data,
              id: new Date()
            });
          })
          .catch(err => console.log(err));
        return res;
      })
    );
  } else if (event.request.url.indexOf(urlGetPererittoPlayers) > -1) {
    event.respondWith(
      fetch(event.request).then(res => {
        var clonedRes = res.clone();

        clearAllData('pereritto-players')
          .then(() => {
            return clonedRes.json();
          })
          .then(data => {
            for (let key in data) {
              writeData('pereritto-players', {
                ...data[key],
                id: data[key]._id
              });
            }
          })
          .catch(err => console.log(err));
        return res;
      })
    );
  } else if (event.request.url.indexOf(urlGetSlates) > -1) {
    event.respondWith(
      fetch(event.request).then(res => {
        var clonedRes = res.clone();

        clearAllData('slates')
          .then(() => {
            return clonedRes.json();
          })
          .then(data => {
            for (let key in data) {
              writeData('slates', {
                ...data[key],
                id: data[key]._id
              });
            }
          })
          .catch(err => console.log(err));
        return res;
      })
    );
  } else if (event.request.url.indexOf(urlCompletedSlates) > -1) {
    event.respondWith(
      fetch(event.request).then(res => {
        var clonedRes = res.clone();

        clearAllData('completed-slates')
          .then(() => {
            return clonedRes.json();
          })
          .then(data => {
            writeData('completed-slates', {
              data,
              id: new Date()
            });
          })
          .catch(err => console.log(err));
        return res;
      })
    );
  } else if (event.request.url.indexOf(urlGetSavedQuizzes) > -1) {
    event.respondWith(
      fetch(event.request).then(res => {
        var clonedRes = res.clone();

        clearAllData('saved-quizzes')
          .then(() => {
            return clonedRes.json();
          })
          .then(data => {
            for (let key in data) {
              writeData('saved-quizzes', {
                ...data[key],
                id: key
              });
            }
          })
          .catch(err => console.log(err));
        return res;
      })
    );
  } else if (event.request.url.indexOf(urlGetTotalQuestions) > -1) {
    event.respondWith(
      fetch(event.request).then(res => {
        var clonedRes = res.clone();

        clearAllData('total-questions')
          .then(() => {
            return clonedRes.json();
          })
          .then(data => {
            writeData('total-questions', {
              ...data,
              id: new Date()
            });
          })
          .catch(err => console.log(err));
        return res;
      })
    );
  } else if (isInCache(event.request.url, STATIC_FILES)) {
    event.respondWith(caches.match(event.request));
  } else {
    try {
      event.respondWith(fetch(event.request));
    } catch (err) {
      console.log(err);
    }
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

            const msgChannel = new MessageChannel();
            self.clients.matchAll().then(clients => {
              clients.forEach(client => {
                client.postMessage('Your splash has been sent', [
                  msgChannel.port2
                ]);
              });
            });
          })
          .catch(function(err) {
            console.log('Error while sending data', err);
          });
      })
    );
  }
});
