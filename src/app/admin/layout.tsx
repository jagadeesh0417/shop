'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import './admin.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.classList.add('admin-active');
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.replace('/admin/login');
    } else {
      setAuthed(true);
    }
    setLoading(false);
    return () => document.body.classList.remove('admin-active');
  }, []); // only run on mount/unmount, not on every navigation

  const isLogin = pathname === '/admin/login';

  if (isLogin) return <>{children}</>;
  if (loading) return <div className="admin-root" style={{ display: 'flex' }}><div style={{ width: '240px' }} /><div style={{ flex: 1, padding: '32px' }}>Loading...</div></div>;
  if (!authed) return null;

  return (
    <div className="admin-root" style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '32px', overflowX: 'auto', background: '#f9fafb' }}>
        {children}
      </main>
    </div>
  );
}
