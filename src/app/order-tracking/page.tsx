'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Search } from 'lucide-react';
import { sampleOrders } from '@/lib/orders';
import { formatPrice, cn } from '@/lib/utils';
import RevealOnScroll from '@/components/RevealOnScroll';

const statusSteps = ['placed', 'shipped', 'out-for-delivery', 'delivered'] as const;
const statusIcons = [Package, Truck, Truck, CheckCircle];
const statusLabels = ['Order Placed', 'Shipped', 'Out for Delivery', 'Delivered'];

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<string | null>(null);

  const order = sampleOrders.find((o) => o.id === orderId.toUpperCase()) || null;
  const currentStep = order ? statusSteps.indexOf(order.status) : -1;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedOrder(orderId);
  };

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-light">Tracking</span>
            <h1 className="mt-2 text-3xl sm:text-4xl font-display text-white">Track Your Order</h1>
            <p className="mt-2 text-sm text-text-secondary">Enter your order ID to see the latest status.</p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <form onSubmit={handleSearch} className="flex gap-2 mb-10">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. ORD-001"
              className="flex-1 bg-surface border border-border rounded px-4 py-3 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white hover:bg-white/90 text-[#0341F6] text-sm font-medium rounded transition-colors flex items-center gap-2"
            >
              <Search size={16} /> Track
            </button>
          </form>
        </RevealOnScroll>

        {searchedOrder && (
          <RevealOnScroll delay={0.2}>
            {order ? (
              <div className="space-y-6">
                <div className="bg-surface rounded-lg p-6 border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-text-muted">Order ID</p>
                      <p className="text-sm font-semibold text-white">{order.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-text-muted">Total</p>
                      <p className="text-sm font-semibold text-white">{formatPrice(order.total)}</p>
                    </div>
                  </div>

                  <div className="relative mt-8 mb-2">
                    <div className="absolute top-5 left-0 right-0 h-[2px] bg-border">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep) / (statusSteps.length - 1)) * 100}%` }}
                        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                        className="h-full bg-accent"
                      />
                    </div>
                    <div className="relative flex justify-between">
                      {statusSteps.map((_, i) => {
                        const Icon = statusIcons[i];
                        const isActive = i <= currentStep;
                        const isCurrent = i === currentStep;
                        return (
                          <div key={i} className="flex flex-col items-center">
                            <motion.div
                              initial={false}
                              animate={{
                                scale: isCurrent ? 1.2 : 1,
                                backgroundColor: isActive ? 'rgb(0, 71, 171)' : 'rgb(31, 31, 31)',
                              }}
                              className={cn(
                                'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors',
                                isActive ? 'border-accent' : 'border-border'
                              )}
                            >
                              <Icon size={16} className={isActive ? 'text-white' : 'text-text-muted'} />
                            </motion.div>
                            <p className={cn('text-[10px] mt-2 text-center', isActive ? 'text-white' : 'text-text-muted')}>
                              {statusLabels[i]}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border text-sm text-text-secondary">
                    <p>Estimated delivery: <span className="text-white">{order.estimatedDelivery}</span></p>
                  </div>
                </div>

                <div className="bg-surface rounded-lg p-6 border border-border">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-accent-light mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-14 object-cover rounded" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{item.product.name}</p>
                          <p className="text-xs text-text-muted">Size: {item.size} × {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold">{formatPrice(item.product.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-surface rounded-lg border border-border">
                <p className="text-text-muted">No order found with ID &quot;{searchedOrder}&quot;.</p>
                <p className="text-xs text-text-muted mt-1">Try ORD-001 or ORD-002</p>
              </div>
            )}
          </RevealOnScroll>
        )}
      </div>
    </div>
  );
}
