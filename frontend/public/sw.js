const CACHE_NAME = 'geo-attendance-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
];


self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Handle requests - serve from cache or fetch from network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('sync', event => {
  if (event.tag === 'sync-attendance') {
    event.waitUntil(syncAttendanceData());
  }
});

async function syncAttendanceData() {
  const attendanceRecords = await getOfflineAttendanceRecords();
  if (attendanceRecords.length > 0) {
    fetch('/api/sync-attendance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ attendanceRecords })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Attendance synced:', data);
      clearOfflineAttendanceRecords();
    })
    .catch(err => {
      console.error('Failed to sync attendance:', err);
    });
  }
}

function getOfflineAttendanceRecords() {
  return JSON.parse(localStorage.getItem('attendanceRecords')) || [];
}

function clearOfflineAttendanceRecords() {
  localStorage.removeItem('attendanceRecords');
}