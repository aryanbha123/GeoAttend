import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { Toaster } from 'react-hot-toast';

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
            <Route path='/user' element={<UserBoard />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
