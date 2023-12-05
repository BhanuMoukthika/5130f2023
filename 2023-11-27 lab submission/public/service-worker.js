const cacheName = 'appCache-v1';

const assetsToCache = [

 '/',

 '/index.html',

 '/icons/icon-144x144.png',

 '/icons/icon-72x72.png',

];

self.addEventListener('install', (event) => {

 event.waitUntil(

  caches.open(cacheName)

   .then((cache) => {

    console.log('Opened cache');

    return cache.addAll(assetsToCache);

   })

 );

});

self.addEventListener('fetch', (event) => {

 event.respondWith(

  caches.match(event.request)

   .then((response) => {

    if (response) {

     return response;

    }

    return fetch(event.request);

   })

 );

});





