import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { Toaster } from 'react-hot-toast';
import ProtectRoute from './auth/ProtectedRoute'
export default function App() {
  const Home = React.lazy(() => import('./pages/Home'));
  const AdminBoard = React.lazy(() => import('./pages/admin/Dashboard'));
  const UserBoard = React.lazy(() => import('./pages/employee/Dashboard'));

  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <AuthProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/admin' element={<AdminBoard />} />
            <Route element={<ProtectRoute requiredRole="Employee" />}>
              <Route path="/Employee" element={<UserBoard></UserBoard>} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

// import React, { useState } from 'react';

// function App() {
//   const [status, setStatus] = useState('Welcome! Please check in.');
//   const [location, setLocation] = useState(null);

//   // Register the Service Worker
//   if ('serviceWorker' in navigator && 'SyncManager' in window) {
//     navigator.serviceWorker.register('/sw.js').then(reg => {
//       console.log('Service Worker registered', reg);
//     }).catch(err => {
//       console.error('Service Worker registration failed:', err);
//     });
//   }

//   // Check-in functionality
//   const handleCheckIn = () => {
//     if ('geolocation' in navigator) {
//       navigator.geolocation.getCurrentPosition(position => {
//         const { latitude, longitude } = position.coords;

//         // Store the location
//         const attendanceRecord = {
//           latitude,
//           longitude,
//           timestamp: new Date().toISOString(),
//           userId: 'user-123'  // Use real userId when authentication is implemented
//         };

//         saveAttendanceOffline(attendanceRecord);
//         setLocation({ latitude, longitude });
//         setStatus('Attendance recorded offline!');
//       });
//     } else {
//       setStatus('Geolocation not supported by this browser.');
//     }
//   };

//   // Save attendance record locally
//   const saveAttendanceOffline = (attendanceRecord) => {
//     const existingRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
//     existingRecords.push(attendanceRecord);
//     localStorage.setItem('attendanceRecords', JSON.stringify(existingRecords));

//     // Register sync event with the service worker
//     if ('serviceWorker' in navigator && 'SyncManager' in window) {
//       navigator.serviceWorker.ready.then(reg => {
//         return reg.sync.register('sync-attendance');
//       }).then(() => {
//         console.log('Sync event registered');
//       }).catch(err => {
//         console.error('Sync registration failed', err);
//       });
//     }
//   };

//   return (
//     <div className="App">
//       <h1>Geo-Attendance System</h1>
//       <button onClick={handleCheckIn}>Check In</button>
//       <p>{status}</p>
//       {location && (
//         <p>Location: {location.latitude}, {location.longitude}</p>
//       )}
//     </div>
//   );
// }

// export default App;