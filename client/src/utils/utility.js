import * as idb from 'idb';

export const DB_TABLES = [
  'current-user',
  'user-settings',
  'send-splash',
  'notification-groups',
  'winners',
  'winner-years',
  'pereritto-players',
  'awards',
  'group-members',
  'location-groups'
];

const seanDB = idb.openDB('sean-db', 2, {
  upgrade(db) {
    DB_TABLES.forEach(table => {
      if (!db.objectStoreNames.contains(table)) {
        db.createObjectStore(table, { keyPath: 'id' });
      }
    });
  }
});

// Write data to db
export const writeData = (table, data) => {
  // console.log('writeData:', table, data);
  return seanDB.then(db => {
    const tx = db.transaction(table, 'readwrite');
    const store = tx.objectStore(table);
    store.put(data);
    return tx.complete;
  });
};

export const readAllData = table => {
  return seanDB.then(db => {
    // Every operation has to be wrapped in a transaction
    var tx = db.transaction(table, 'readonly');
    var store = tx.objectStore(table);
    return store.getAll();
  });
};

export const clearAllData = table => {
  return seanDB.then(db => {
    var tx = db.transaction(table, 'readwrite');
    var store = tx.objectStore(table);
    // Clear all from store
    store.clear();
    return tx.complete;
  });
};

export const clearAllTables = () => {
  return seanDB.then(db => {
    DB_TABLES.forEach(table => {
      var tx = db.transaction(table, 'readwrite');
      var store = tx.objectStore(table);
      // Clear all from store
      store.clear();
      return tx.complete;
    });
  });
};

export const deleteItemFromData = (table, id) => {
  return seanDB
    .then(db => {
      var tx = db.transaction(table, 'readwrite');
      var store = tx.objectStore(table);
      store.delete(id);
      return tx.complete;
    })
    .then(() => {
      console.log('Item deleted!');
    });
};

export const urlBase64ToUint8Array = base64String => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  let outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
