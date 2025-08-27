// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import GuestList from './pages/GuestList';
import AddGuest from './pages/AddGuest';
import GuestDetail from './pages/GuestDetail';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-800">
        {/* Main area: full-width so pages can stretch edge-to-edge */}
        <main className="w-full">
          <Routes>
            <Route path="/" element={<Navigate to="/guests" replace />} />
            <Route path="/guests" element={<GuestList />} />
            <Route path="/guests/new" element={<AddGuest />} />
            <Route path="/guests/:id" element={<GuestDetail />} />
            {/* Fallback */}
            <Route path="*" element={<div className="p-8">Page not found — <Link to="/guests" className="text-indigo-600">go back</Link></div>} />
          </Routes>
        </main>
        {/* Footer */}        
        <footer className="w-full text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Hotel Guest Management
        </footer>
      </div>
    </BrowserRouter>
  );
}
