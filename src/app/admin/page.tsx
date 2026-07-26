'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, ShoppingBag, DollarSign, TrendingUp, Image, Ticket, ChevronRight, Loader } from 'lucide-react';
import { isCODEnabled, setCODEnabled } from '@/lib/settings';
import { fetchSettings } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

const page = { padding: '112px 0 80px' };
const container = { maxWidth: '1280px', margin: '0 auto', padding: '0 24px' };
const label = { fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.2em', color: '#0341F6' };
const title = { fontSize: '30px', fontWeight: 700, color: '#000000', marginTop: '8px' };
const card = { background: '#ffffff', borderRadius: '8px', padding: '20px', border: '1px solid #e5e7eb' };
const cardLabel = { fontSize: '12px', color: '#6b7280', marginTop: '4px' };
const cardVal = { fontSize: '24px', fontWeight: 700, color: '#000000', marginTop: '8px' };

const statusColors: Record<string, string> = {
  placed: '#92400e', shipped: '#1e40af', 'out-for-delivery': '#1e40af', delivered: '#065f46',
};
const statusBg: Record<string, string> = {
  placed: '#fef3c7', shipped: '#dbeafe', 'out-for-delivery': '#dbeafe', delivered: '#d1fae5',
};

export default function AdminPage() {
  const [codOn, setCodOn] = useState(true);
  const [stats, setStats] = useState<any>({
    productCount: 0, orderCount: 0, couponCount: 0, bannerCount: 0,
    totalRevenue: 0, statusBreakdown: {}, recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCodOn(isCODEnabled());
    fetchSettings().then(setStats).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const toggleCOD = () => {
    const next = !codOn;
    setCodOn(next);
    setCODEnabled(next);
  };

  if (loading) return <div style={page}><div style={container}><p style={{ color: '#9ca3af' }}>Loading dashboard...</p></div></div>;

  return (
    <div style={page}>
      <div style={container}>
        <div style={{ marginBottom: '32px' }}>
          <div style={label}>Admin</div>
          <h1 style={title}>Dashboard</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div style={card}>
            <DollarSign size={20} color="#059669" />
            <div style={cardVal}>{formatPrice(stats.totalRevenue)}</div>
            <div style={cardLabel}>Total Revenue</div>
          </div>
          <div style={card}>
            <ShoppingBag size={20} color="#0341F6" />
            <div style={cardVal}>{stats.productCount}</div>
            <div style={cardLabel}>Total Products</div>
          </div>
          <div style={card}>
            <Package size={20} color="#d97706" />
            <div style={cardVal}>{stats.orderCount}</div>
            <div style={cardLabel}>Total Orders</div>
          </div>
          <div style={card}>
            <TrendingUp size={20} color="#059669" />
            <div style={cardVal}>{Object.keys(stats.statusBreakdown).length || 0}</div>
            <div style={cardLabel}>Active Statuses</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div style={card}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#000000', marginBottom: '16px' }}>Orders by Status</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(stats.statusBreakdown).length === 0 ? (
                <div style={{ fontSize: '13px', color: '#9ca3af' }}>No orders yet</div>
              ) : (
                Object.entries(stats.statusBreakdown).map(([status, count]) => (
                  <div key={status} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColors[status] || '#9ca3af' }} />
                      <span style={{ fontSize: '13px', color: '#374151', textTransform: 'capitalize' }}>{status.replace('-', ' ')}</span>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#000000' }}>{String(count)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div style={card}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#000000', marginBottom: '16px' }}>Quick Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href="/admin/products" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '6px', background: '#f9fafb', color: '#000000', fontSize: '13px' }}>
                <span>Manage Products</span> <ChevronRight size={14} color="#9ca3af" />
              </Link>
              <Link href="/admin/orders" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '6px', background: '#f9fafb', color: '#000000', fontSize: '13px' }}>
                <span>View Orders</span> <ChevronRight size={14} color="#9ca3af" />
              </Link>
              <Link href="/admin/banners" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '6px', background: '#f9fafb', color: '#000000', fontSize: '13px' }}>
                <span>Manage Banners</span> <ChevronRight size={14} color="#9ca3af" />
              </Link>
              <Link href="/admin/coupons" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '6px', background: '#f9fafb', color: '#000000', fontSize: '13px' }}>
                <span>Manage Coupons</span> <ChevronRight size={14} color="#9ca3af" />
              </Link>
            </div>
          </div>
        </div>

        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#000000' }}>Recent Orders</div>
            <Link href="/admin/orders" style={{ fontSize: '13px', color: '#0341F6', textDecoration: 'none' }}>View All</Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <div style={{ fontSize: '13px', color: '#9ca3af', padding: '24px 0', textAlign: 'center' }}>No orders placed yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {stats.recentOrders.map((order: any, i: number) => (
                <div key={order._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < stats.recentOrders.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#000000' }}>
                      Order #{order._id?.slice(-6).toUpperCase()}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                      {new Date(order.createdAt).toLocaleDateString()} &middot; {formatPrice(order.total)}
                    </div>
                  </div>
                  <span style={{ padding: '2px 8px', fontSize: '11px', borderRadius: '4px', background: statusBg[order.status] || '#f3f4f6', color: statusColors[order.status] || '#6b7280', textTransform: 'capitalize' }}>
                    {order.status?.replace('-', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ ...card, marginTop: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <DollarSign size={24} color="#0341F6" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#000000' }}>Cash on Delivery</div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{codOn ? 'COD enabled at checkout' : 'COD hidden — Razorpay only'}</div>
              </div>
            </div>
            <button onClick={toggleCOD} style={{ position: 'relative', width: '48px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer', background: codOn ? '#16A34A' : '#d1d5db', transition: 'background 0.3s' }}>
              <span style={{ position: 'absolute', top: '2px', left: '2px', width: '20px', height: '20px', background: '#ffffff', borderRadius: '50%', transform: codOn ? 'translateX(24px)' : 'translateX(0)', transition: 'transform 0.3s' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
