'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, ShoppingBag, TrendingUp, Users, DollarSign } from 'lucide-react';
import { isCODEnabled, setCODEnabled } from '@/lib/settings';

const stats = [
  { label: 'Total Products', value: '48', icon: ShoppingBag, color: 'text-accent-light' },
  { label: 'Active Orders', value: '12', icon: Package, color: 'text-warning' },
  { label: 'Revenue (MTD)', value: '₹84,500', icon: TrendingUp, color: 'text-success' },
  { label: 'Customers', value: '1,024', icon: Users, color: 'text-accent-light' },
];

export default function AdminPage() {
  const [codOn, setCodOn] = useState(true);

  useEffect(() => {
    setCodOn(isCODEnabled());
  }, []);

  const toggleCOD = () => {
    const next = !codOn;
    setCodOn(next);
    setCODEnabled(next);
  };

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-light">Admin</span>
          <h1 className="mt-2 text-3xl font-display text-white">Dashboard</h1>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-surface rounded-lg p-5 border border-border">
              <stat.icon size={20} className={stat.color} />
              <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
              <p className="text-xs text-text-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-surface rounded-lg p-6 border border-border mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign size={24} className="text-accent-light" />
              <div>
                <h2 className="text-sm font-semibold text-white">Cash on Delivery</h2>
                <p className="text-xs text-text-muted mt-0.5">
                  {codOn ? 'Customers can pay with COD at checkout' : 'COD is hidden — Razorpay only'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleCOD}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                codOn ? 'bg-success' : 'bg-border'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                  codOn ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/admin/products"
            className="bg-surface rounded-lg p-6 border border-border hover:border-accent/50 transition-colors group"
          >
            <ShoppingBag size={24} className="text-accent-light mb-3" />
            <h2 className="text-lg font-semibold text-white group-hover:text-accent-light transition-colors">Manage Products</h2>
            <p className="text-sm text-text-secondary mt-1">Add, edit, or remove products from inventory.</p>
          </Link>
          <Link
            href="/admin/orders"
            className="bg-surface rounded-lg p-6 border border-border hover:border-accent/50 transition-colors group"
          >
            <Package size={24} className="text-accent-light mb-3" />
            <h2 className="text-lg font-semibold text-white group-hover:text-accent-light transition-colors">Manage Orders</h2>
            <p className="text-sm text-text-secondary mt-1">View and update order statuses.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
