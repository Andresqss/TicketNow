'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Bienvenido al Dashboard 🎉</h1>
    </div>
  );
}
