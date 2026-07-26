'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import RevealOnScroll from '@/components/RevealOnScroll';

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="pt-28 pb-20 text-center">
        <div className="max-w-md mx-auto px-4">
          <ShoppingBag size={48} className="mx-auto text-text-muted mb-4" />
          <h1 className="text-2xl font-display text-text-primary mb-2">Your Cart is Empty</h1>
          <p className="text-sm text-text-secondary mb-6">Looks like you haven&apos;t added anything yet.</p>
          <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0341F6] text-sm font-medium rounded">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <h1 className="text-3xl font-display text-text-primary mb-8">Shopping Cart</h1>
        </RevealOnScroll>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-4">
            <RevealOnScroll>
              {items.map((item) => (
                <motion.div
                  key={`${item.product.id}-${item.size}`}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex gap-4 bg-surface rounded-lg p-4 border border-border"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-24 h-28 object-cover rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <Link href={`/shop/${item.product.slug}`} className="text-sm font-medium text-text-primary hover:text-accent-light transition-colors">
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-text-muted mt-0.5">Size: {item.size}</p>
                    <p className="text-sm font-semibold text-accent-light mt-1">{formatPrice(item.product.price)}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-border rounded">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                          className="p-1.5 hover:text-accent transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                          className="p-1.5 hover:text-accent transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id, item.size)}
                        className="p-1.5 text-text-muted hover:text-error transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-text-primary">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                </motion.div>
              ))}
            </RevealOnScroll>
          </div>

          <div className="lg:sticky lg:top-28 self-start">
            <RevealOnScroll>
              <div className="bg-surface rounded-lg p-6 border border-border space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider">Order Summary</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-text-secondary">
                    <span>Subtotal</span>
                    <span className="text-text-primary">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Shipping</span>
                    <span className="text-success">Free</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between font-semibold">
                    <span className="text-text-primary">Total</span>
                    <span className="text-text-primary">{formatPrice(subtotal)}</span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  className="block w-full py-3 text-center text-sm font-medium uppercase tracking-wider bg-white hover:bg-white/90 text-[#0341F6] rounded transition-colors"
                >
                  Proceed to Checkout
                </Link>
                <Link href="/shop" className="block text-center text-xs text-text-secondary hover:text-accent transition-colors">
                  Continue Shopping
                </Link>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </div>
  );
}
