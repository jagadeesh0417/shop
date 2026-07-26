'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { fetchCoupons, createCoupon, deleteCoupon } from '@/lib/api';

const page = { padding: '112px 0 80px' };
const container = { maxWidth: '896px', margin: '0 auto', padding: '0 24px' };
const backLink = { fontSize: '12px', color: '#9ca3af', textDecoration: 'none' };
const title = { fontSize: '30px', fontWeight: 700, color: '#111827', marginTop: '4px' };
const input = { background: '#f9fafb', border: '1px solid #d1d5db', borderRadius: '6px', padding: '10px 12px', fontSize: '14px', color: '#111827' };
const th = { textAlign: 'left' as const, padding: '16px', fontWeight: 500, fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase' as const, letterSpacing: '0.05em', borderBottom: '1px solid #e5e7eb' };
const td = { padding: '16px', borderBottom: '1px solid #f3f4f6' };

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', type: 'percentage' as 'percentage' | 'flat', value: '', minAmount: '' });

  useEffect(() => { fetchCoupons().then(setCoupons).catch(() => {}); }, []);

  const addCoupon = async () => {
    if (!form.code || !form.value) return;
    const newCoupon = await createCoupon({ code: form.code.toUpperCase(), type: form.type, value: Number(form.value), minAmount: Number(form.minAmount) || 0, active: true });
    setCoupons((prev) => [...prev, newCoupon]);
    setForm({ code: '', type: 'percentage', value: '', minAmount: '' });
    setShowForm(false);
  };

  const removeCoupon = async (id: string) => {
    await deleteCoupon(id);
    setCoupons((prev) => prev.filter((c) => c._id !== id));
  };

  const toggleActive = (id: string) => setCoupons((prev) => prev.map((c) => (c._id === id ? { ...c, active: !c.active } : c)));

  return (
    <div style={page}>
      <div style={container}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <Link href="/admin" style={backLink}>&larr; Dashboard</Link>
            <h1 style={title}>Coupon Codes</h1>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#0341F6', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
            <Plus size={16} /> Add Coupon
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ background: '#ffffff', borderRadius: '8px', padding: '24px', border: '1px solid #e5e7eb', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden' }}>
              <input placeholder="Coupon Code (e.g. SAVE20)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} style={{ ...input, width: '100%' }} />
              <div style={{ display: 'flex', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}><input type="radio" name="type" checked={form.type === 'percentage'} onChange={() => setForm({ ...form, type: 'percentage' })} /> Percentage</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}><input type="radio" name="type" checked={form.type === 'flat'} onChange={() => setForm({ ...form, type: 'flat' })} /> Flat Amount</label>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <input placeholder={form.type === 'percentage' ? 'Discount %' : 'Discount ₹'} type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} style={{ ...input, flex: 1 }} />
                <input placeholder="Min order ₹" type="number" value={form.minAmount} onChange={(e) => setForm({ ...form, minAmount: e.target.value })} style={{ ...input, flex: 1 }} />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={addCoupon} style={{ padding: '8px 16px', background: '#0341F6', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Save</button>
                <button onClick={() => setShowForm(false)} style={{ padding: '8px 16px', background: '#ffffff', color: '#6b7280', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>Code</th><th style={th}>Type</th><th style={th}>Value</th><th style={th}>Min Order</th><th style={th}>Status</th><th style={{ ...th, textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c, i) => (
                <motion.tr key={c._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} style={{ background: i % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                  <td style={{ ...td, color: '#111827', fontWeight: 600 }}>{c.code}</td>
                  <td style={{ ...td, color: '#6b7280', textTransform: 'capitalize' }}>{c.type}</td>
                  <td style={{ ...td, color: '#111827' }}>{c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`}</td>
                  <td style={{ ...td, color: '#6b7280' }}>₹{c.minAmount}</td>
                  <td style={td}>
                    <button onClick={() => toggleActive(c._id)} style={{ padding: '2px 8px', fontSize: '12px', borderRadius: '4px', border: 'none', cursor: 'pointer', background: c.active ? '#d1fae5' : '#fee2e2', color: c.active ? '#065f46' : '#991b1b' }}>{c.active ? 'Active' : 'Inactive'}</button>
                  </td>
                  <td style={{ ...td, textAlign: 'right' }}>
                    <button onClick={() => removeCoupon(c._id)} style={{ padding: '6px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {coupons.length === 0 && <p style={{ textAlign: 'center', color: '#9ca3af', padding: '32px 0' }}>No coupons yet.</p>}
        </div>
      </div>
    </div>
  );
}
