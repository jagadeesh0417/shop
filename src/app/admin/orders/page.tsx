'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { sampleOrders } from '@/lib/orders';
import { formatPrice, cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  placed: 'bg-warning/20 text-warning',
  shipped: 'bg-accent/20 text-accent-light',
  'out-for-delivery': 'bg-accent/20 text-accent-light',
  delivered: 'bg-success/20 text-success',
};

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
    <div className="pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/admin" className="text-xs text-text-muted hover:text-white transition-colors">&larr; Dashboard</Link>
          <h1 className="mt-1 text-3xl font-display text-white">Orders</h1>
        </div>

        <div className="bg-surface rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
                  <th className="text-left p-4 font-medium">Order ID</th>
                  <th className="text-left p-4 font-medium">Customer</th>
                  <th className="text-left p-4 font-medium">Total</th>
                  <th className="text-left p-4 font-medium">Payment</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-right p-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-border/50 hover:bg-surface-light transition-colors"
                  >
                    <td className="p-4 text-white font-medium">{order.id}</td>
                    <td className="p-4">
                      <p className="text-white">{order.shippingAddress.fullName}</p>
                      <p className="text-xs text-text-muted">{order.shippingAddress.city}</p>
                    </td>
                    <td className="p-4 text-white font-semibold">{formatPrice(order.total)}</td>
                    <td className="p-4 text-text-secondary">{order.paymentMethod}</td>
                    <td className="p-4">
                      <span className={cn('px-2 py-0.5 text-xs rounded capitalize', statusColors[order.status])}>
                        {order.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-text-secondary">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      {order.status !== 'delivered' && (
                        <button
                          onClick={() => advanceStatus(order.id)}
                          className="px-3 py-1.5 text-xs bg-white hover:bg-white/90 text-[#0341F6] rounded transition-colors"
                        >
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
