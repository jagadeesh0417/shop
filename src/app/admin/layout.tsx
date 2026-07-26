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
    <>
      <style>{`
        .admin-panel,
        .admin-panel .text-white { color: #111827 !important; }
        .admin-panel .text-text-secondary { color: #4b5563 !important; }
        .admin-panel .text-text-muted { color: #9ca3af !important; }
        .admin-panel .text-accent-light { color: #0341F6 !important; }
        .admin-panel .text-success { color: #059669 !important; }
        .admin-panel .text-error { color: #dc2626 !important; }
        .admin-panel .text-warning { color: #d97706 !important; }
        .admin-panel .bg-surface { background-color: #ffffff !important; }
        .admin-panel .border-border { border-color: #e5e7eb !important; }
        .admin-panel .bg-surface-light { background-color: #f9fafb !important; }
        .admin-panel input,
        .admin-panel select,
        .admin-panel textarea { color: #111827 !important; background: #f9fafb !important; border-color: #d1d5db !important; }
        .admin-panel input::placeholder,
        .admin-panel select::placeholder,
        .admin-panel textarea::placeholder { color: #9ca3af !important; }
      `}</style>
      <div className="admin-panel">{children}</div>
    </>
  );
}
