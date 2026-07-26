'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Package, Image, Ticket, LogOut } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: ShoppingBag },
  { href: '/admin/orders', label: 'Orders', icon: Package },
  { href: '/admin/banners', label: 'Banners', icon: Image },
  { href: '/admin/coupons', label: 'Coupons', icon: Ticket },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  return (
    <div style={{ width: '240px', minHeight: '100vh', background: '#ffffff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <div style={{ padding: '24px 20px', borderBottom: '1px solid #e5e7eb' }}>
        <Link href="/admin" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: '20px', fontWeight: 700, color: '#000000', letterSpacing: '-0.5px' }}>ARHUU</span>
          <span style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginTop: '2px' }}>Admin Panel</span>
        </Link>
      </div>

      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: active ? 600 : 400,
                color: '#000000',
                background: active ? '#f3f4f6' : 'transparent',
                borderLeft: active ? '3px solid #000000' : '3px solid transparent',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = '#f9fafb'; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <item.icon size={18} color={active ? '#000000' : '#6b7280'} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '12px 8px', borderTop: '1px solid #e5e7eb' }}>
        <button
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '6px', width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', color: '#000000', textAlign: 'left' }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut size={18} color="#6b7280" />
          Logout
        </button>
      </div>
    </div>
  );
}
