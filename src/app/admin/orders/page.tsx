'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const statusStyles: Record<string, { bg: string; color: string; next: string }> = {
  placed: { bg: '#fef3c7', color: '#92400e', next: 'shipped' },
  shipped: { bg: '#dbeafe', color: '#1e40af', next: 'out-for-delivery' },
  'out-for-delivery': { bg: '#dbeafe', color: '#1e40af', next: 'delivered' },
  delivered: { bg: '#d1fae5', color: '#065f46', next: '' },
};


const th = { textAlign: 'left' as const, padding: '16px', fontWeight: 500, fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase' as const, letterSpacing: '0.05em', borderBottom: '1px solid #e5e7eb' };
const td = { padding: '16px', borderBottom: '1px solid #f3f4f6' };

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const advanceStatus = async (id: string, current: string) => {
    const next = statusStyles[current]?.next;
    if (!next) return;
    setUpdating(id);
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: next }),
      });
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
    } catch {}
    setUpdating(null);
  };

  return (
    <div>
      <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#000000', marginBottom: '24px' }}>Orders</h2>

        <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ ...th, width: '40px' }} />
                  <th style={th}>Order</th>
                  <th style={th}>Customer</th>
                  <th style={th}>Items</th>
                  <th style={th}>Total</th>
                  <th style={th}>Payment</th>
                  <th style={th}>Status</th>
                  <th style={th}>Date</th>
                  <th style={{ ...th, textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} style={{ textAlign: 'center', padding: '48px', color: '#9ca3af' }}>Loading orders...</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={9} style={{ textAlign: 'center', padding: '48px', color: '#9ca3af' }}>No orders yet.</td></tr>
                ) : (
                  orders.map((order, i) => (
                    <motion.tr key={order._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} style={{ background: i % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                      <td style={td}>
                        <button onClick={() => setExpandedId(expandedId === order._id ? null : order._id)} style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                          {expandedId === order._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </td>
                      <td style={{ ...td, fontWeight: 600, color: '#000000', fontSize: '12px' }}>#{order._id?.slice(-8).toUpperCase()}</td>
                      <td style={td}>
                        <div style={{ color: '#000000' }}>{order.shippingAddress?.fullName}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{order.shippingAddress?.city}, {order.shippingAddress?.state}</div>
                      </td>
                      <td style={{ ...td, color: '#6b7280' }}>{order.items?.length || 0}</td>
                      <td style={{ ...td, fontWeight: 600, color: '#000000' }}>{formatPrice(order.total)}</td>
                      <td style={{ ...td, color: '#6b7280', fontSize: '12px' }}>{order.paymentMethod || '-'}</td>
                      <td style={td}>
                        <span style={{ padding: '2px 8px', fontSize: '11px', borderRadius: '4px', background: statusStyles[order.status]?.bg || '#f3f4f6', color: statusStyles[order.status]?.color || '#6b7280', textTransform: 'capitalize' }}>
                          {order.status?.replace('-', ' ') || 'placed'}
                        </span>
                      </td>
                      <td style={{ ...td, color: '#6b7280', fontSize: '12px' }}>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</td>
                      <td style={{ ...td, textAlign: 'right' }}>
                        {order.status !== 'delivered' && (
                          <button onClick={() => advanceStatus(order._id, order.status)} disabled={updating === order._id} style={{ padding: '6px 12px', fontSize: '12px', background: '#000000', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: updating === order._id ? 0.6 : 1 }}>
                            {updating === order._id ? '...' : 'Advance'}
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {expandedId && (() => {
          const o = orders.find((o) => o._id === expandedId);
          if (!o) return null;
          return (
            <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '24px', marginTop: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#000000', marginBottom: '16px' }}>
                Order Details — #{o._id?.slice(-8).toUpperCase()}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Shipping Address</div>
                  <div style={{ fontSize: '13px', color: '#000000', lineHeight: 1.6 }}>
                    {o.shippingAddress?.fullName}<br />
                    {o.shippingAddress?.street}<br />
                    {o.shippingAddress?.city}, {o.shippingAddress?.state} — {o.shippingAddress?.pincode}<br />
                    {o.shippingAddress?.phone}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Payment & Delivery</div>
                  <div style={{ fontSize: '13px', color: '#000000', lineHeight: 1.6 }}>
                    Method: {o.paymentMethod || '-'}<br />
                    Status: <span style={{ textTransform: 'capitalize' }}>{o.status?.replace('-', ' ') || 'placed'}</span><br />
                    Ordered: {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '-'}<br />
                    Est. Delivery: {o.estimatedDelivery || '-'}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Items</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {o.items?.map((item: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', background: '#f9fafb', borderRadius: '6px' }}>
                    {item.image && <img src={item.image} alt={item.name} style={{ width: '40px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: '#000000' }}>{item.name}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Size: {item.size} × {item.quantity}</div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#000000' }}>{formatPrice(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>Subtotal: {formatPrice(o.subtotal)}</div>
                {o.discount > 0 && <div style={{ fontSize: '13px', color: '#059669' }}>Discount: -{formatPrice(o.discount)}</div>}
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#000000' }}>Total: {formatPrice(o.total)}</div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
