'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const { items, isDrawerOpen, toggleDrawer, removeItem, updateQuantity, subtotal } = useCart();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleDrawer(false)}
            className="fixed inset-0 bg-[#0225a0]/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-surface border-l border-border z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-display tracking-wider">Cart ({items.length})</h2>
              <button onClick={() => toggleDrawer(false)} className="p-1 text-text-secondary hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-text-muted gap-3">
                  <ShoppingBag size={40} />
                  <p className="text-sm">Your cart is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={`${item.product.id}-${item.size}`}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-3 bg-surface-light rounded-lg p-3"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-24 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate">{item.product.name}</h3>
                      <p className="text-xs text-text-muted">Size: {item.size}</p>
                      <p className="text-sm font-semibold text-accent-light mt-1">{formatPrice(item.product.price)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                          className="p-1 border border-border rounded hover:border-text-muted transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                          className="p-1 border border-border rounded hover:border-text-muted transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id, item.size)}
                      className="p-1 text-text-muted hover:text-error transition-colors self-start"
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-[11px] text-text-muted">Shipping calculated at checkout</p>
                <Link
                  href="/checkout"
                  onClick={() => toggleDrawer(false)}
                  className="block w-full py-3 text-center text-sm font-medium uppercase tracking-wider bg-white hover:bg-white/90 text-[#0341F6] rounded transition-colors"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
