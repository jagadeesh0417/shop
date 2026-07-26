'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { products } from '@/lib/products';
import { formatPrice } from '@/lib/utils';

const page = { padding: '112px 0 80px' };
const container = { maxWidth: '1152px', margin: '0 auto', padding: '0 24px' };
const backLink = { fontSize: '12px', color: '#9ca3af', textDecoration: 'none' };
const title = { fontSize: '30px', fontWeight: 700, color: '#111827', marginTop: '4px' };
const th = { textAlign: 'left' as const, padding: '16px', fontWeight: 500, fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase' as const, letterSpacing: '0.05em', borderBottom: '1px solid #e5e7eb' };
const td = { padding: '16px', borderBottom: '1px solid #f3f4f6' };

export default function AdminProductsPage() {
  const [productList, setProductList] = useState(products);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', inStock: true });

  const startEdit = (id: string) => {
    const p = productList.find((x) => x.id === id);
    if (p) setEditForm({ name: p.name, price: String(p.price), inStock: p.inStock });
    setEditingId(id);
  };

  const saveEdit = () => {
    setProductList((prev) =>
      prev.map((p) => p.id === editingId ? { ...p, name: editForm.name, price: Number(editForm.price), inStock: editForm.inStock } : p)
    );
    setEditingId(null);
  };

  const deleteProduct = (id: string) => setProductList((prev) => prev.filter((p) => p.id !== id));

  return (
    <div style={page}>
      <div style={container}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <Link href="/admin" style={backLink}>&larr; Dashboard</Link>
            <h1 style={title}>Products</h1>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#0341F6', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
            <Plus size={16} /> Add Product
          </button>
        </div>

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
                <AnimatePresence>
                  {productList.map((p) => (
                    <motion.tr key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ background: editingId === p.id ? '#fefce8' : undefined }}>
                      {editingId === p.id ? (
                        <>
                          <td style={td}>
                            <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} style={{ width: '100%', background: '#f9fafb', border: '1px solid #d1d5db', borderRadius: '4px', padding: '4px 8px', fontSize: '14px', color: '#111827' }} />
                          </td>
                          <td style={{ ...td, color: '#6b7280' }}>{p.category}</td>
                          <td style={td}>
                            <input type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} style={{ width: '96px', background: '#f9fafb', border: '1px solid #d1d5db', borderRadius: '4px', padding: '4px 8px', fontSize: '14px', color: '#111827' }} />
                          </td>
                          <td style={td}>
                            <button onClick={() => setEditForm({ ...editForm, inStock: !editForm.inStock })} style={{ padding: '2px 8px', fontSize: '12px', borderRadius: '4px', border: 'none', cursor: 'pointer', background: editForm.inStock ? '#d1fae5' : '#fee2e2', color: editForm.inStock ? '#065f46' : '#991b1b' }}>
                              {editForm.inStock ? 'In Stock' : 'Out of Stock'}
                            </button>
                          </td>
                          <td style={{ ...td, color: '#6b7280' }}>{p.rating}</td>
                          <td style={{ ...td, textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                              <button onClick={saveEdit} style={{ padding: '6px', color: '#059669', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '4px' }}><Check size={16} /></button>
                              <button onClick={() => setEditingId(null)} style={{ padding: '6px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '4px' }}><X size={16} /></button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={td}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <img src={p.images[0]} alt={p.name} style={{ width: '40px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />
                              <span style={{ color: '#111827', fontWeight: 500 }}>{p.name}</span>
                            </div>
                          </td>
                          <td style={{ ...td, color: '#6b7280' }}>{p.category}</td>
                          <td style={{ ...td, color: '#111827', fontWeight: 600 }}>{formatPrice(p.price)}</td>
                          <td style={td}>
                            <span style={{ padding: '2px 8px', fontSize: '12px', borderRadius: '4px', background: p.inStock ? '#d1fae5' : '#fee2e2', color: p.inStock ? '#065f46' : '#991b1b' }}>
                              {p.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td style={{ ...td, color: '#6b7280' }}>{p.rating}</td>
                          <td style={{ ...td, textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                              <button onClick={() => startEdit(p.id)} style={{ padding: '6px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '4px' }}><Pencil size={16} /></button>
                              <button onClick={() => deleteProduct(p.id)} style={{ padding: '6px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '4px' }}><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </>
                      )}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
