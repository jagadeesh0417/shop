'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import { fetchBanners, createBanner, deleteBanner } from '@/lib/api';

const input = { width: '100%', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '6px', padding: '10px 12px', fontSize: '14px', color: '#000000' };

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ image: '', title: '', link: '' });

  useEffect(() => { fetchBanners().then(setBanners).catch(() => {}); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) setForm((prev) => ({ ...prev, image: data.url }));
    } catch {}
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

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
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#000000' }}>Banners</h2>
        <button onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#000000', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
          <Plus size={16} /> Add Banner
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ background: '#ffffff', borderRadius: '8px', padding: '24px', border: '1px solid #e5e7eb', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden' }}>
            {form.image && (
              <div style={{ position: 'relative', width: '100%', maxHeight: '200px', overflow: 'hidden', borderRadius: '6px' }}>
                <img src={form.image} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
                <button onClick={() => setForm({ ...form, image: '' })} style={{ position: 'absolute', top: '8px', right: '8px', width: '24px', height: '24px', borderRadius: '50%', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={14} /></button>
              </div>
            )}
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', border: '1px dashed #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', color: '#6b7280' }}>
              <Upload size={16} /> {uploading ? 'Uploading...' : form.image ? 'Change Image' : 'Upload Banner Image'}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
            </label>
            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={input} />
            <input placeholder="Link URL (e.g. /shop)" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} style={input} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={addBanner} disabled={!form.image || !form.title} style={{ padding: '10px 20px', background: '#000000', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', opacity: (!form.image || !form.title) ? 0.5 : 1 }}>Save</button>
              <button onClick={() => setShowForm(false)} style={{ padding: '10px 20px', background: '#ffffff', color: '#000000', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {banners.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#9ca3af', padding: '48px 0' }}>No banners yet.</p>
        ) : (
          banners.map((banner, i) => (
            <motion.div key={banner._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden', display: 'flex' }}>
              <img src={banner.image} alt={banner.title} style={{ width: '160px', objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ flex: 1, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#000000' }}>{banner.title}</div>
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
          ))
        )}
      </div>
    </div>
  );
}
