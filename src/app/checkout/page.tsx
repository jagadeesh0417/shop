'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, CreditCard, TruckIcon, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, cn } from '@/lib/utils';
import { isCODEnabled } from '@/lib/settings';
import { fetchAPI } from '@/lib/api';

const steps = ['Shipping', 'Payment', 'Review'];

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [codAvailable, setCodAvailable] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [couponMsg, setCouponMsg] = useState('');

  const discount = appliedCoupon
    ? appliedCoupon.type === 'percentage'
      ? subtotal - (subtotal - (subtotal * appliedCoupon.value) / 100)
      : appliedCoupon.value
    : 0;
  const total = subtotal - discount;

  useEffect(() => {
    setCodAvailable(isCODEnabled());
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const result = await fetchAPI<{ valid: boolean; coupon?: any; message?: string }>('/api/coupons/validate', {
        method: 'POST',
        body: JSON.stringify({ code: couponCode.trim(), subtotal }),
      });
      if (result.valid && result.coupon) {
        setAppliedCoupon(result.coupon);
        setCouponMsg(`Coupon "${result.coupon.code}" applied!`);
      } else {
        setAppliedCoupon(null);
        setCouponMsg(result.message || 'Invalid coupon');
      }
    } catch {
      setAppliedCoupon(null);
      setCouponMsg('Error validating coupon');
    }
  };

  const [shipping, setShipping] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

  if (items.length === 0 && !completed) {
    return (
      <div className="pt-28 pb-20 text-center">
        <div className="max-w-md mx-auto px-4">
          <Package size={48} className="mx-auto text-text-muted mb-4" />
          <h1 className="text-2xl font-display text-white mb-2">Nothing to Checkout</h1>
          <p className="text-sm text-text-secondary mb-6">Your cart is empty.</p>
          <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0341F6] text-sm font-medium rounded">
            <ArrowLeft size={16} /> Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="pt-28 pb-20">
        <div className="max-w-lg mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <motion.div
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Check size={36} className="text-success" />
            </motion.div>
          </motion.div>
          <h1 className="text-3xl font-display text-white mb-2">Order Confirmed!</h1>
          <p className="text-sm text-text-secondary mb-2">Thank you for your purchase.</p>
          <p className="text-xs text-text-muted mb-6">Your order will be shipped within 2-3 business days.</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/order-tracking" className="px-6 py-3 bg-white text-[#0341F6] text-sm font-medium rounded">
              Track Order
            </Link>
            <Link href="/shop" className="px-6 py-3 border border-border text-text-secondary text-sm font-medium rounded hover:text-white transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const nextStep = () => {
    if (step < 2) setStep(step + 1);
    else {
      clearCart();
      setCompleted(true);
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors',
                i <= step ? 'bg-white text-[#0341F6]' : 'bg-surface-light text-text-muted'
              )}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className={cn('text-xs hidden sm:inline', i <= step ? 'text-white' : 'text-text-muted')}>{s}</span>
              {i < 2 && <div className={cn('w-8 h-[1px]', i < step ? 'bg-accent' : 'bg-border')} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 0 && (
              <div className="bg-surface rounded-lg p-6 border border-border space-y-4">
                <div className="flex items-center gap-2 text-accent-light mb-4">
                  <TruckIcon size={18} />
                  <h2 className="text-sm font-semibold uppercase tracking-wider">Shipping Address</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Full Name', key: 'fullName', placeholder: 'Harshad' },
                    { label: 'Phone', key: 'phone', placeholder: '9876543210', type: 'tel' },
                    { label: 'Street Address', key: 'street', placeholder: '123 Main St, Railway Kodur', span: true },
                    { label: 'City', key: 'city', placeholder: 'Kodur' },
                    { label: 'State', key: 'state', placeholder: 'Andhra Pradesh' },
                    { label: 'Pincode', key: 'pincode', placeholder: '516101' },
                  ].map((field) => (
                    <div key={field.key} className={field.span ? 'sm:col-span-2' : ''}>
                      <label className="text-xs text-text-muted mb-1 block">{field.label}</label>
                      <input
                        type={field.type || 'text'}
                        value={shipping[field.key as keyof typeof shipping]}
                        onChange={(e) => setShipping({ ...shipping, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                        className="w-full bg-surface-light border border-border rounded px-3 py-2.5 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="bg-surface rounded-lg p-6 border border-border space-y-4">
                <div className="flex items-center gap-2 text-accent-light mb-4">
                  <CreditCard size={18} />
                  <h2 className="text-sm font-semibold uppercase tracking-wider">Payment Method</h2>
                </div>
                <div className="space-y-3">
                  {[
                    ...(codAvailable ? [{ label: 'Cash on Delivery', desc: 'Pay when you receive' }] : []),
                    { label: 'Razorpay', desc: 'Cards, UPI, Net Banking' },
                  ].map((method) => (
                    <label key={method.label} className="flex items-center gap-3 p-4 bg-surface-light rounded-lg border border-border cursor-pointer hover:border-accent/50 transition-colors">
                      <input type="radio" name="payment" defaultChecked={method.label === 'Cash on Delivery'} className="accent-accent" />
                      <div>
                        <p className="text-sm font-medium text-white">{method.label}</p>
                        <p className="text-xs text-text-muted">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="bg-surface rounded-lg p-6 border border-border">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-accent-light mb-4">Order Summary</h2>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={`${item.product.id}-${item.size}`} className="flex items-center gap-3">
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

                <div className="bg-surface rounded-lg p-6 border border-border space-y-3 text-sm">
                  <div className="flex gap-2">
                    <input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon code"
                      className="flex-1 bg-surface-light border border-border rounded px-3 py-2 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-white/50"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-white text-[#0341F6] text-sm font-medium rounded hover:bg-white/90 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponMsg && (
                    <p className={`text-xs ${appliedCoupon ? 'text-success' : 'text-error'}`}>{couponMsg}</p>
                  )}
                  <div className="flex justify-between text-text-secondary">
                    <span>Subtotal</span><span className="text-white">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Discount ({appliedCoupon?.code})</span><span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-text-secondary">
                    <span>Shipping</span><span className="text-success">Free</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between font-semibold">
                    <span className="text-white">Total</span><span className="text-white">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="bg-surface rounded-lg p-6 border border-border space-y-2 text-sm">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-accent-light mb-2">Shipping To</h3>
                  <p className="text-white">{shipping.fullName}</p>
                  <p className="text-text-secondary">{shipping.street}</p>
                  <p className="text-text-secondary">{shipping.city}, {shipping.state} — {shipping.pincode}</p>
                  <p className="text-text-secondary">{shipping.phone}</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={prevStep}
            disabled={step === 0}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm rounded transition-colors',
              step === 0 ? 'text-text-muted cursor-not-allowed' : 'text-text-secondary hover:text-white border border-border hover:border-text-muted'
            )}
          >
            <ArrowLeft size={14} /> Back
          </button>
          <button
            onClick={nextStep}
            className="flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-white/90 text-[#0341F6] text-sm font-medium rounded transition-colors"
          >
            {step === 2 ? 'Place Order' : 'Continue'} {step < 2 && <ArrowRight size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
