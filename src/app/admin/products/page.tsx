'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Check, Upload, Loader } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const page = { padding: '112px 0 80px' };
const container = { maxWidth: '1152px', margin: '0 auto', padding: '0 24px' };
const backLink = { fontSize: '12px', color: '#9ca3af', textDecoration: 'none' };
const title = { fontSize: '30px', fontWeight: 700, color: '#111827', marginTop: '4px' };
const th = { textAlign: 'left' as const, padding: '16px', fontWeight: 500, fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase' as const, letterSpacing: '0.05em', borderBottom: '1px solid #e5e7eb' };
const td = { padding: '16px', borderBottom: '1px solid #f3f4f6' };
const input = { width: '100%', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '6px', padding: '10px 12px', fontSize: '14px', color: '#000000' };
const label = { fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '4px' };
const overlay = { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' };
const modal = { background: '#ffffff', borderRadius: '12px', padding: '32px', maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto' as const };

const categories = ['Shirts', 'Pants', 'T-Shirts', 'Hoodies', 'Tracks'];

export default function AdminProductsPage() {
  const [productList, setProductList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: '', slug: '', description: '', price: '', originalPrice: '',
    category: 'Shirts', images: [] as string[], sizes: '', colors: '',
    fabric: '', fit: '', inStock: true, isNewArrival: false, isBestseller: false,
  });

  useEffect(() => {
    fetch('/api/admin/products')
      .then((r) => r.json())
      .then(setProductList)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) setForm((prev) => ({ ...prev, images: [...prev.images, data.url] }));
    } catch {}
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const removeImage = (idx: number) => setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));

  const createSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'product';

  const handleSave = async () => {
    if (!form.name || !form.price || !form.description) return;
    setSaving(true);
    const payload = {
      name: form.name,
      slug: form.slug || createSlug(form.name),
      description: form.description,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      images: form.images,
      category: form.category,
      sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      colors: form.colors ? form.colors.split(',').map((c) => {
        const [name, hex] = c.trim().split(':');
        return { name: name || c.trim(), hex: hex || '#000000' };
      }) : [],
      fabric: form.fabric,
      fit: form.fit,
      inStock: form.inStock,
      isNewArrival: form.isNewArrival,
      isBestseller: form.isBestseller,
    };

    try {
      if (editingId) {
        const res = await fetch('/api/admin/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _id: editingId, ...payload }),
        });
        const updated = await res.json();
        setProductList((prev) => prev.map((p) => (p._id === editingId ? updated : p)));
      } else {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const created = await res.json();
        setProductList((prev) => [created, ...prev]);
      }
    } catch {}
    setSaving(false);
    setShowForm(false);
    setEditingId(null);
    setForm({ name: '', slug: '', description: '', price: '', originalPrice: '', category: 'Shirts', images: [], sizes: '', colors: '', fabric: '', fit: '', inStock: true, isNewArrival: false, isBestseller: false });
  };

  const startEdit = (p: any) => {
    setEditingId(p._id);
    setForm({
      name: p.name, slug: p.slug || '', description: p.description || '',
      price: String(p.price), originalPrice: p.originalPrice ? String(p.originalPrice) : '',
      category: p.category || 'Shirts', images: p.images || [],
      sizes: (p.sizes || []).join(', '), colors: (p.colors || []).map((c: any) => `${c.name}:${c.hex}`).join(', '),
      fabric: p.fabric || '', fit: p.fit || '',
      inStock: p.inStock, isNewArrival: p.isNewArrival || false, isBestseller: p.isBestseller || false,
    });
    setShowForm(true);
  };

  const deleteProduct = async (id: string) => {
    try {
      await fetch('/api/admin/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: id }) });
      setProductList((prev) => prev.filter((p) => p._id !== id));
    } catch {}
  };

  return (
    <div style={page}>
      <div style={container}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <Link href="/admin" style={backLink}>&larr; Dashboard</Link>
            <h1 style={title}>Products</h1>
          </div>
          <button onClick={() => { setEditingId(null); setForm({ name: '', slug: '', description: '', price: '', originalPrice: '', category: 'Shirts', images: [], sizes: '', colors: '', fabric: '', fit: '', inStock: true, isNewArrival: false, isBestseller: false }); setShowForm(true); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#000000', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
            <Plus size={16} /> Add Product
          </button>
        </div>

        {showForm && (
          <div style={overlay} onClick={() => !saving && setShowForm(false)}>
            <div style={modal} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#000000' }}>{editingId ? 'Edit Product' : 'Add Product'}</h2>
                <button onClick={() => !saving && setShowForm(false)} style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><X size={20} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <div style={label}>Name</div>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product name" style={input} />
                  </div>
                  <div>
                    <div style={label}>Slug</div>
                    <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Auto-generated if empty" style={input} />
                  </div>
                </div>
                <div>
                  <div style={label}>Description</div>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Product description" rows={3} style={{ ...input, resize: 'vertical' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div>
                    <div style={label}>Price (₹)</div>
                    <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0" style={input} />
                  </div>
                  <div>
                    <div style={label}>Original Price (₹)</div>
                    <input type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} placeholder="Optional" style={input} />
                  </div>
                  <div>
                    <div style={label}>Category</div>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={input}>
                      {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <div style={label}>Sizes (comma-separated)</div>
                    <input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} placeholder="S, M, L, XL" style={input} />
                  </div>
                  <div>
                    <div style={label}>Colors (name:hex comma-separated)</div>
                    <input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} placeholder="Black:#000000, White:#FFFFFF" style={input} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <div style={label}>Fabric</div>
                    <input value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })} placeholder="Cotton, Linen..." style={input} />
                  </div>
                  <div>
                    <div style={label}>Fit</div>
                    <input value={form.fit} onChange={(e) => setForm({ ...form, fit: e.target.value })} placeholder="Regular, Slim..." style={input} />
                  </div>
                </div>

                <div>
                  <div style={label}>Images</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    {form.images.map((url, i) => (
                      <div key={i} style={{ position: 'relative', width: '72px', height: '72px' }}>
                        <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                        <button onClick={() => removeImage(i)} style={{ position: 'absolute', top: '-6px', right: '-6px', width: '20px', height: '20px', borderRadius: '50%', background: '#ef4444', color: '#fff', border: 'none', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={12} /></button>
                      </div>
                    ))}
                  </div>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', border: '1px dashed #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#6b7280' }}>
                    <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload from device'}
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#000000', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} /> In Stock
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#000000', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.isNewArrival} onChange={(e) => setForm({ ...form, isNewArrival: e.target.checked })} /> New Arrival
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#000000', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.isBestseller} onChange={(e) => setForm({ ...form, isBestseller: e.target.checked })} /> Bestseller
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button onClick={() => setShowForm(false)} disabled={saving} style={{ padding: '10px 20px', background: '#ffffff', color: '#000000', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
                  <button onClick={handleSave} disabled={saving} style={{ padding: '10px 20px', background: '#000000', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {saving ? 'Saving...' : 'Save'} {saving && <Loader size={14} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={th}>Product</th>
                  <th style={th}>Category</th>
                  <th style={th}>Price</th>
                  <th style={th}>Stock</th>
                  <th style={th}>Rating</th>
                  <th style={{ ...th, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '48px', color: '#9ca3af' }}>Loading products...</td></tr>
                ) : productList.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '48px', color: '#9ca3af' }}>No products yet. Click &quot;Add Product&quot; to create one.</td></tr>
                ) : (
                  productList.map((p, i) => (
                    <motion.tr key={p._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} style={{ background: i % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                      <td style={td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {p.images?.[0] && <img src={p.images[0]} alt={p.name} style={{ width: '40px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />}
                          <span style={{ color: '#000000', fontWeight: 500 }}>{p.name}</span>
                        </div>
                      </td>
                      <td style={{ ...td, color: '#6b7280' }}>{p.category}</td>
                      <td style={{ ...td, color: '#000000', fontWeight: 600 }}>{formatPrice(p.price)}</td>
                      <td style={td}>
                        <span style={{ padding: '2px 8px', fontSize: '12px', borderRadius: '4px', background: p.inStock ? '#d1fae5' : '#fee2e2', color: p.inStock ? '#065f46' : '#991b1b' }}>{p.inStock ? 'In Stock' : 'Out of Stock'}</span>
                      </td>
                      <td style={{ ...td, color: '#6b7280' }}>{p.rating || '-'}</td>
                      <td style={{ ...td, textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button onClick={() => startEdit(p)} style={{ padding: '6px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '4px' }}><Pencil size={16} /></button>
                          <button onClick={() => deleteProduct(p._id)} style={{ padding: '6px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '4px' }}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
