'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { fetchBanners, createBanner, deleteBanner } from '@/lib/api';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ image: '', title: '', link: '' });

  useEffect(() => {
    fetchBanners().then(setBanners).catch(() => {});
  }, []);

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

  const toggleActive = async (id: string, current: boolean) => {
    const updated = banners.map((b) => (b._id === id ? { ...b, active: !b.active } : b));
    setBanners(updated);
  };

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-xs text-text-muted hover:text-white transition-colors">&larr; Dashboard</Link>
            <h1 className="mt-1 text-3xl font-display text-white">Banners</h1>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#0341F6] text-sm font-medium rounded transition-colors hover:bg-white/90">
            <Plus size={16} /> Add Banner
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-surface rounded-lg p-6 border border-border mb-6 space-y-4 overflow-hidden">
              <input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full bg-surface-light border border-border rounded px-3 py-2.5 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-white/50" />
              <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-surface-light border border-border rounded px-3 py-2.5 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-white/50" />
              <input placeholder="Link URL (e.g. /shop)" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="w-full bg-surface-light border border-border rounded px-3 py-2.5 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-white/50" />
              <div className="flex gap-2">
                <button onClick={addBanner} className="px-4 py-2 bg-white text-[#0341F6] text-sm font-medium rounded hover:bg-white/90">Save</button>
                <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-border text-text-secondary text-sm rounded hover:text-white">Cancel</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {banners.map((banner, i) => (
            <motion.div key={banner._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-surface rounded-lg border border-border overflow-hidden flex">
              <img src={banner.image} alt={banner.title} className="w-40 object-cover shrink-0" />
              <div className="flex-1 p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">{banner.title}</h3>
                  <p className="text-xs text-text-muted mt-0.5">{banner.link || 'No link'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleActive(banner._id, banner.active)}
                    className={`px-3 py-1 text-xs rounded ${banner.active ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                    {banner.active ? 'Active' : 'Inactive'}
                  </button>
                  <button onClick={() => removeBanner(banner._id)} className="p-1.5 text-text-muted hover:text-error transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            </motion.div>
          ))}
          {banners.length === 0 && <p className="text-center text-text-muted py-12">No banners yet.</p>}
        </div>
      </div>
    </div>
  );
}
