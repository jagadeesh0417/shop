'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
  }, [router]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (loading) return <div className="admin-root" />;
  if (!authed) return null;

  return <div className="admin-root">{children}</div>;
}
