'use strict';

let cacheFileName = "legonnaryCache-v{timestamp}";
let cacheCdnName = "legonnaryCdnCache-v1";

let filesToCache = [
    './',
    './index.html',
    './bundle_phone.js',
    './css/phone.css',
    './assets/img/favicon.ico',
    './assets/img/launcher_144.png',
    './assets/img/launcher_192.png',
    './assets/img/launcher_512.png',
    './assets/img/launcher_1024.png',
    './assets/img/icon_128.png',
    './assets/fonts/Crazy-Sixties.ttf',
    './assets/fonts/Stanberry.ttf',
    './manifest_phone.json'
];


let cdnToCache = [
    "/libs_offline/"
];

self.addEventListener('push', function (event) {
    console.log('Received a push message', event);

    var title = 'Yay a message.';
    var body = 'We have received a push message.';
    var icon = '/images/icon-192x192.png';
    var tag = 'simple-push-demo-notification-tag';

    event.waitUntil(
        self.registration.showNotification(title, {
            body: body,
            icon: icon,
            tag: tag
        })
    );
});

self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheFileName)
        .then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheFileName && key != cacheCdnName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener('fetch', function (e) {
    console.log('[ServiceWorker] Fetch', e.request.url);
    if (cdnToCache.find((element) => {
            return e.request.url.indexOf(element) === 0;
        })) {
        e.respondWith(
            caches.match(e.request.url).then(function (response) {
                if (response) {
                    return response
                } else {
                    return fetch(e.request)
                        .then(function (response) {
                            return caches.open(cacheCdnName).then(function (cache) {
                                cache.put(e.request.url, response.clone());
                                console.log('[ServiceWorker] Fetched&Cached Data');
                                return response;
                            });
                        })
                }
            })
        );
    } else {
        e.respondWith(
            caches.match(e.request).then(function (response) {
                return response || fetch(e.request);
            })
        );
    }
});