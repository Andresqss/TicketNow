'use client';

import { useState, useEffect, ReactNode } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.querySelector('html')?.classList.add('dark');
  }, []);

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isSidebarOpen') === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('isSidebarOpen', isSidebarOpen.toString());
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900 text-white">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center space-x-4">
            <button
              className="p-2 text-gray-300 hover:bg-gray-700 rounded-lg md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
            <h1 className="text-xl font-semibold">Inicio</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-800 text-white">
          {children}
        </main>
      </div>
    </div>
  );
}
