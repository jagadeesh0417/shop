'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.replace('/admin/login');
    } else {
      setAuthed(true);
    }
  }, [router]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (!authed) return null;

  return (
    <div className="admin-layout">
      <div className="admin-content">{children}</div>
    </div>
  );
}
