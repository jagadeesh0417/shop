'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { sampleOrders } from '@/lib/orders';
import { formatPrice } from '@/lib/utils';

const statusStyles: Record<string, { bg: string; color: string }> = {
  placed: { bg: '#fef3c7', color: '#92400e' },
  shipped: { bg: '#dbeafe', color: '#1e40af' },
  'out-for-delivery': { bg: '#dbeafe', color: '#1e40af' },
  delivered: { bg: '#d1fae5', color: '#065f46' },
};

const page = { padding: '112px 0 80px' };
const container = { maxWidth: '1152px', margin: '0 auto', padding: '0 24px' };
const backLink = { fontSize: '12px', color: '#9ca3af', textDecoration: 'none' };
const title = { fontSize: '30px', fontWeight: 700, color: '#111827', marginTop: '4px' };
const tableWrap = { background: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' };
const th = { textAlign: 'left' as const, padding: '16px', fontWeight: 500, fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase' as const, letterSpacing: '0.05em', borderBottom: '1px solid #e5e7eb' };
const td = { padding: '16px', borderBottom: '1px solid #f3f4f6' };

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(sampleOrders);

  const nextStatus: Record<string, string> = {
    placed: 'shipped',
    shipped: 'out-for-delivery',
    'out-for-delivery': 'delivered',
  };

  const advanceStatus = (id: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id && o.status !== 'delivered'
          ? { ...o, status: nextStatus[o.status] as typeof o.status }
          : o
      )
    );
  };

  return (
    <div style={page}>
      <div style={container}>
        <div style={{ marginBottom: '32px' }}>
          <Link href="/admin" style={backLink}>&larr; Dashboard</Link>
          <h1 style={title}>Orders</h1>
        </div>

        <div style={tableWrap}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={th}>Order ID</th>
                  <th style={th}>Customer</th>
                  <th style={th}>Total</th>
                  <th style={th}>Payment</th>
                  <th style={th}>Status</th>
                  <th style={th}>Date</th>
                  <th style={{ ...th, textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <motion.tr key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} style={{ background: i % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                    <td style={{ ...td, fontWeight: 600, color: '#111827' }}>{order.id}</td>
                    <td style={td}>
                      <div style={{ color: '#111827' }}>{order.shippingAddress.fullName}</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af' }}>{order.shippingAddress.city}</div>
                    </td>
                    <td style={{ ...td, fontWeight: 600, color: '#111827' }}>{formatPrice(order.total)}</td>
                    <td style={{ ...td, color: '#6b7280' }}>{order.paymentMethod}</td>
                    <td style={td}>
                      <span style={{ padding: '2px 8px', fontSize: '12px', borderRadius: '4px', background: statusStyles[order.status].bg, color: statusStyles[order.status].color, textTransform: 'capitalize' }}>
                        {order.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td style={{ ...td, color: '#6b7280' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td style={{ ...td, textAlign: 'right' }}>
                      {order.status !== 'delivered' && (
                        <button onClick={() => advanceStatus(order.id)} style={{ padding: '6px 12px', fontSize: '12px', background: '#0341F6', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                          Advance
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
