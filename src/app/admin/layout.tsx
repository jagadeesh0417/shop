'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.replace('/admin/login');
    } else {
      setAuthed(true);
    }
    setLoading(false);
  }, [router]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (loading) return <div style={{ minHeight: '100vh', background: '#ffffff' }} />;
  if (!authed) return null;

  return <>{children}</>;
}
