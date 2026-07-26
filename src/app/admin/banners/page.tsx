'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { fetchBanners, createBanner, deleteBanner } from '@/lib/api';

const page = { padding: '112px 0 80px' };
const container = { maxWidth: '896px', margin: '0 auto', padding: '0 24px' };
const backLink = { fontSize: '12px', color: '#9ca3af', textDecoration: 'none' };
const title = { fontSize: '30px', fontWeight: 700, color: '#111827', marginTop: '4px' };
const input = { width: '100%', background: '#f9fafb', border: '1px solid #d1d5db', borderRadius: '6px', padding: '10px 12px', fontSize: '14px', color: '#111827' };
const card = { background: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden', display: 'flex' };

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ image: '', title: '', link: '' });

  useEffect(() => { fetchBanners().then(setBanners).catch(() => {}); }, []);

  const addBanner = async () => {
    if (!form.image || !form.title) return;
    const newBanner = await createBanner({ ...form, active: true });
    setBanners((prev) => [...prev, newBanner]);
    setForm({ image: '', title: '', link: '' });
    setShowForm(false);
  };

  const removeBanner = async (id: string) => {
    await deleteBanner(id);
    setBanners((prev) => prev.filter((b) => b._id !== id));
  };

  const toggleActive = (id: string) => {
    setBanners((prev) => prev.map((b) => (b._id === id ? { ...b, active: !b.active } : b)));
  };

  return (
    <div style={page}>
      <div style={container}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <Link href="/admin" style={backLink}>&larr; Dashboard</Link>
            <h1 style={title}>Banners</h1>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#0341F6', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
            <Plus size={16} /> Add Banner
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ background: '#ffffff', borderRadius: '8px', padding: '24px', border: '1px solid #e5e7eb', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden' }}>
              <input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} style={input} />
              <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={input} />
              <input placeholder="Link URL (e.g. /shop)" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} style={input} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={addBanner} style={{ padding: '8px 16px', background: '#0341F6', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Save</button>
                <button onClick={() => setShowForm(false)} style={{ padding: '8px 16px', background: '#ffffff', color: '#6b7280', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {banners.map((banner, i) => (
            <motion.div key={banner._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} style={card}>
              <img src={banner.image} alt={banner.title} style={{ width: '160px', objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ flex: 1, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{banner.title}</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{banner.link || 'No link'}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button onClick={() => toggleActive(banner._id)} style={{ padding: '4px 12px', fontSize: '12px', borderRadius: '4px', border: 'none', cursor: 'pointer', background: banner.active ? '#d1fae5' : '#fee2e2', color: banner.active ? '#065f46' : '#991b1b' }}>
                    {banner.active ? 'Active' : 'Inactive'}
                  </button>
                  <button onClick={() => removeBanner(banner._id)} style={{ padding: '6px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                </div>
              </div>
            </motion.div>
          ))}
          {banners.length === 0 && <p style={{ textAlign: 'center', color: '#9ca3af', padding: '48px 0' }}>No banners yet.</p>}
        </div>
      </div>
    </div>
  );
}
