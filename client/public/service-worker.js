// اسم ملف التخزين المؤقت
const CACHE_NAME = 'quick-recipe-v1';

// قائمة الملفات التي سيتم تخزينها مؤقتًا
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/index.js',
  '/assets/index.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// تثبيت Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('فتح ذاكرة التخزين المؤقت');
        return cache.addAll(urlsToCache);
      })
  );
});

// استراتيجية "الشبكة أولاً مع احتياطي التخزين المؤقت"
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // إنشاء نسخة من الاستجابة لتخزينها في التخزين المؤقت
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME)
          .then(cache => {
            // تجاهل خطأ CORS في التخزين المؤقت
            if (event.request.url.startsWith('http')) {
              cache.put(event.request, responseToCache);
            }
          });
        
        return response;
      })
      .catch(() => {
        // استخدام التخزين المؤقت إذا فشل الاتصال بالشبكة
        return caches.match(event.request);
      })
  );
});

// تحديث Service Worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // حذف ذاكرة التخزين المؤقت القديمة
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});