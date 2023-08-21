self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('my-cache-name').then(function(cache) {
        return cache.addAll([
          '/',
          '/index.html',
          '/styles.css',
          // Добавьте сюда другие ресурсы, которые вы хотите закэшировать
        ]);
      })
    );
  });