'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { products } from '@/lib/products';
import { formatPrice } from '@/lib/utils';

export default function AdminProductsPage() {
  const [productList, setProductList] = useState(products);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', inStock: true });

  const startEdit = (id: string) => {
    const p = productList.find((x) => x.id === id);
    if (p) {
      setEditingId(id);
      setEditForm({ name: p.name, price: String(p.price), inStock: p.inStock });
    }
  };

  const saveEdit = () => {
    setProductList((prev) =>
      prev.map((p) =>
        p.id === editingId
          ? { ...p, name: editForm.name, price: Number(editForm.price), inStock: editForm.inStock }
          : p
      )
    );
    setEditingId(null);
  };

  const deleteProduct = (id: string) => {
    setProductList((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-xs text-text-muted hover:text-white transition-colors">&larr; Dashboard</Link>
            <h1 className="mt-1 text-3xl font-display text-white">Products</h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-white/90 text-[#0341F6] text-sm font-medium rounded transition-colors">
            <Plus size={16} /> Add Product
          </button>
        </div>

        <div className="bg-surface rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
                  <th className="text-left p-4 font-medium">Product</th>
                  <th className="text-left p-4 font-medium">Category</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-left p-4 font-medium">Stock</th>
                  <th className="text-left p-4 font-medium">Rating</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {productList.map((p) => (
                    <motion.tr
                      key={p.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-border/50 hover:bg-surface-light transition-colors"
                    >
                      {editingId === p.id ? (
                        <>
                          <td className="p-4">
                            <input
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="w-full bg-background border border-border rounded px-2 py-1 text-sm text-white"
                            />
                          </td>
                          <td className="p-4 text-text-secondary">{p.category}</td>
                          <td className="p-4">
                            <input
                              type="number"
                              value={editForm.price}
                              onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                              className="w-24 bg-background border border-border rounded px-2 py-1 text-sm text-white"
                            />
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => setEditForm({ ...editForm, inStock: !editForm.inStock })}
                              className={`px-2 py-0.5 text-xs rounded ${editForm.inStock ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}
                            >
                              {editForm.inStock ? 'In Stock' : 'Out of Stock'}
                            </button>
                          </td>
                          <td className="p-4 text-text-secondary">{p.rating}</td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={saveEdit} className="p-1.5 text-success hover:bg-success/10 rounded">
                                <Check size={16} />
                              </button>
                              <button onClick={() => setEditingId(null)} className="p-1.5 text-text-muted hover:text-white rounded">
                                <X size={16} />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img src={p.images[0]} alt={p.name} className="w-10 h-12 object-cover rounded" />
                              <span className="text-white font-medium">{p.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-text-secondary">{p.category}</td>
                          <td className="p-4 text-white font-semibold">{formatPrice(p.price)}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 text-xs rounded ${p.inStock ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                              {p.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="p-4 text-text-secondary">{p.rating}</td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => startEdit(p.id)} className="p-1.5 text-text-muted hover:text-accent-light rounded hover:bg-accent/10 transition-colors">
                                <Pencil size={16} />
                              </button>
                              <button onClick={() => deleteProduct(p.id)} className="p-1.5 text-text-muted hover:text-error rounded hover:bg-error/10 transition-colors">
                                <Trash2 size={16} />
                              </button>
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
