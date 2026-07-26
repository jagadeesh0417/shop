'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { getCoupons, saveCoupons, Coupon } from '@/lib/adminStore';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', type: 'percentage' as 'percentage' | 'flat', value: '', minAmount: '' });

  useEffect(() => {
    setCoupons(getCoupons());
  }, []);

  const addCoupon = () => {
    if (!form.code || !form.value) return;
    const updated = [
      ...coupons,
      {
        id: String(Date.now()),
        code: form.code.toUpperCase(),
        type: form.type,
        value: Number(form.value),
        minAmount: Number(form.minAmount) || 0,
        active: true,
      },
    ];
    saveCoupons(updated);
    setCoupons(updated);
    setForm({ code: '', type: 'percentage', value: '', minAmount: '' });
    setShowForm(false);
  };

  const removeCoupon = (id: string) => {
    const updated = coupons.filter((c) => c.id !== id);
    saveCoupons(updated);
    setCoupons(updated);
  };

  const toggleActive = (id: string) => {
    const updated = coupons.map((c) => (c.id === id ? { ...c, active: !c.active } : c));
    saveCoupons(updated);
    setCoupons(updated);
  };

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-xs text-text-muted hover:text-white transition-colors">&larr; Dashboard</Link>
            <h1 className="mt-1 text-3xl font-display text-white">Coupon Codes</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#0341F6] text-sm font-medium rounded transition-colors hover:bg-white/90"
          >
            <Plus size={16} /> Add Coupon
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-surface rounded-lg p-6 border border-border mb-6 space-y-4 overflow-hidden"
            >
              <input
                placeholder="Coupon Code (e.g. SAVE20)"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="w-full bg-surface-light border border-border rounded px-3 py-2.5 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-white/50"
              />
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-text-secondary">
                  <input type="radio" name="type" checked={form.type === 'percentage'} onChange={() => setForm({ ...form, type: 'percentage' })} />
                  Percentage
                </label>
                <label className="flex items-center gap-2 text-sm text-text-secondary">
                  <input type="radio" name="type" checked={form.type === 'flat'} onChange={() => setForm({ ...form, type: 'flat' })} />
                  Flat Amount
                </label>
              </div>
              <div className="flex gap-4">
                <input
                  placeholder={form.type === 'percentage' ? 'Discount %' : 'Discount ₹'}
                  type="number"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  className="flex-1 bg-surface-light border border-border rounded px-3 py-2.5 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-white/50"
                />
                <input
                  placeholder="Min order ₹"
                  type="number"
                  value={form.minAmount}
                  onChange={(e) => setForm({ ...form, minAmount: e.target.value })}
                  className="flex-1 bg-surface-light border border-border rounded px-3 py-2.5 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-white/50"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={addCoupon} className="px-4 py-2 bg-white text-[#0341F6] text-sm font-medium rounded hover:bg-white/90">Save</button>
                <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-border text-text-secondary text-sm rounded hover:text-white">Cancel</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-surface rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
                <th className="text-left p-4 font-medium">Code</th>
                <th className="text-left p-4 font-medium">Type</th>
                <th className="text-left p-4 font-medium">Value</th>
                <th className="text-left p-4 font-medium">Min Order</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-right p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c, i) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-border/50 hover:bg-surface-light transition-colors"
                >
                  <td className="p-4 text-white font-semibold">{c.code}</td>
                  <td className="p-4 text-text-secondary capitalize">{c.type}</td>
                  <td className="p-4 text-white">{c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`}</td>
                  <td className="p-4 text-text-secondary">₹{c.minAmount}</td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleActive(c.id)}
                      className={`px-2 py-0.5 text-xs rounded ${c.active ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}
                    >
                      {c.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => removeCoupon(c.id)} className="p-1.5 text-text-muted hover:text-error transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {coupons.length === 0 && <p className="text-center text-text-muted py-8">No coupons yet.</p>}
        </div>
      </div>
    </div>
  );
}
