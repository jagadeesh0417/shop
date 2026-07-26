'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, ShoppingBag, TrendingUp, Users, DollarSign, Image, Ticket } from 'lucide-react';
import { isCODEnabled, setCODEnabled } from '@/lib/settings';
import { fetchSettings } from '@/lib/api';

const iconMap: Record<string, any> = { ShoppingBag, Package, TrendingUp, Users };

const s = {
  page: { padding: '112px 0 80px' },
  container: { maxWidth: '1280px', margin: '0 auto', padding: '0 24px' },
  header: { marginBottom: '32px' },
  label: { fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#0341F6' },
  title: { fontSize: '30px', fontWeight: 700, color: '#111827', marginTop: '8px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' },
  card: { background: '#ffffff', borderRadius: '8px', padding: '20px', border: '1px solid #e5e7eb' },
  cardVal: { fontSize: '24px', fontWeight: 700, color: '#111827', marginTop: '8px' },
  cardLabel: { fontSize: '12px', color: '#9ca3af', marginTop: '4px' },
  codRow: { background: '#ffffff', borderRadius: '8px', padding: '24px', border: '1px solid #e5e7eb', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  codText: { display: 'flex', alignItems: 'center', gap: '12px' },
  codTitle: { fontSize: '14px', fontWeight: 600, color: '#111827' },
  codDesc: { fontSize: '12px', color: '#9ca3af', marginTop: '2px' },
  toggle: (on: boolean) => ({ position: 'relative' as const, width: '48px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer', background: on ? '#059669' : '#d1d5db', transition: 'background 0.3s' }),
  toggleDot: (on: boolean) => ({ position: 'absolute' as const, top: '2px', left: '2px', width: '20px', height: '20px', background: '#ffffff', borderRadius: '50%', transform: on ? 'translateX(24px)' : 'translateX(0)', transition: 'transform 0.3s' }),
  navGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' },
  navLink: { background: '#ffffff', borderRadius: '8px', padding: '24px', border: '1px solid #e5e7eb', textDecoration: 'none', display: 'block' },
  navIcon: { color: '#0341F6', marginBottom: '12px' },
  navTitle: { fontSize: '14px', fontWeight: 600, color: '#111827' },
  navDesc: { fontSize: '12px', color: '#6b7280', marginTop: '4px' },
};

export default function AdminPage() {
  const [codOn, setCodOn] = useState(true);
  const [stats, setStats] = useState({ productCount: 0, orderCount: 0, couponCount: 0, bannerCount: 0 });

  useEffect(() => {
    setCodOn(isCODEnabled());
    fetchSettings().then(setStats).catch(() => {});
  }, []);

  const toggleCOD = () => {
    const next = !codOn;
    setCodOn(next);
    setCODEnabled(next);
  };

  const statCards = [
    { label: 'Total Products', value: String(stats.productCount), icon: ShoppingBag, color: '#0341F6' },
    { label: 'Active Orders', value: String(stats.orderCount), icon: Package, color: '#d97706' },
    { label: 'Coupons', value: String(stats.couponCount), icon: Ticket, color: '#059669' },
    { label: 'Banners', value: String(stats.bannerCount), icon: Image, color: '#0341F6' },
  ];

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.header}>
          <div style={s.label}>Admin</div>
          <h1 style={s.title}>Dashboard</h1>
        </div>

        <div style={s.grid}>
          {statCards.map((stat) => (
            <div key={stat.label} style={s.card}>
              <div style={{ color: stat.color }}><stat.icon size={20} /></div>
              <div style={s.cardVal}>{stat.value}</div>
              <div style={s.cardLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={s.codRow}>
          <div style={s.codText}>
            <DollarSign size={24} color="#0341F6" />
            <div>
              <div style={s.codTitle}>Cash on Delivery</div>
              <div style={s.codDesc}>{codOn ? 'COD enabled at checkout' : 'COD hidden — Razorpay only'}</div>
            </div>
          </div>
          <button onClick={toggleCOD} style={s.toggle(codOn)}>
            <span style={s.toggleDot(codOn)} />
          </button>
        </div>

        <div style={s.navGrid}>
          {[
            { href: '/admin/products', icon: ShoppingBag, title: 'Products', desc: 'Manage inventory' },
            { href: '/admin/orders', icon: Package, title: 'Orders', desc: 'View & update orders' },
            { href: '/admin/banners', icon: Image, title: 'Banners', desc: 'Add or remove banners' },
            { href: '/admin/coupons', icon: Ticket, title: 'Coupons', desc: 'Manage coupon codes' },
          ].map((item) => (
            <Link key={item.href} href={item.href} style={s.navLink}>
              <div style={s.navIcon}><item.icon size={24} /></div>
              <div style={s.navTitle}>{item.title}</div>
              <div style={s.navDesc}>{item.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
