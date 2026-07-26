'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ShoppingBag, Check, Star, Truck, RotateCcw, Shield } from 'lucide-react';
import { getProductBySlug, products } from '@/lib/products';
import { formatPrice, cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import RevealOnScroll from '@/components/RevealOnScroll';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const product = getProductBySlug(params.slug as string);
  const { addItem } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [added, setAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  if (!product) {
    return (
      <div className="pt-28 pb-20 text-center">
        <p className="text-text-muted">Product not found.</p>
        <Link href="/shop" className="text-accent-light mt-4 inline-block">Back to Shop</Link>
      </div>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    if (!selectedSize) return;
    addItem(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-accent transition-colors mb-6"
        >
          <ChevronLeft size={14} /> Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <RevealOnScroll>
            <div className="space-y-3">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-surface-light">
                {!imgLoaded && <div className="absolute inset-0 shimmer" />}
                <motion.img
                  key={selectedImage}
                  src={product.images[selectedImage]}
                  alt={product.name}
                  onLoad={() => setImgLoaded(true)}
                  className="w-full h-full object-cover cursor-crosshair"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      'w-16 h-16 rounded-md overflow-hidden border-2 transition-colors',
                      selectedImage === i ? 'border-accent' : 'border-transparent opacity-60 hover:opacity-100'
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-light">{product.category}</span>
              <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-display text-text-primary">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <Star size={14} className="fill-warning text-warning" />
                  <span className="text-sm text-text-secondary">{product.rating}</span>
                </div>
                <span className="text-xs text-text-muted">({product.reviews} reviews)</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-text-primary">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-base text-text-muted line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            <p className="text-sm text-text-secondary leading-relaxed">{product.description}</p>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">Select Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      'relative px-5 py-2.5 text-sm font-medium rounded border transition-all duration-200',
                      selectedSize === size
                        ? 'bg-white text-[#0341F6] border-white'
                        : 'border-border text-text-secondary hover:text-accent hover:border-accent'
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              onClick={handleAdd}
              disabled={!selectedSize}
              whileTap={{ scale: 0.97 }}
              className={cn(
                'w-full py-3.5 text-sm font-medium uppercase tracking-wider rounded flex items-center justify-center gap-2 transition-all duration-300',
                added
                  ? 'bg-success text-white'
                  : selectedSize
                    ? 'bg-white hover:bg-white/90 text-[#0341F6]'
                    : 'bg-surface-light text-text-muted cursor-not-allowed'
              )}
            >
              <AnimatePresence mode="wait">
                {added ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Check size={18} /> Added to Cart
                  </motion.span>
                ) : (
                  <motion.span
                    key="cart"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center gap-2"
                  >
                    <ShoppingBag size={16} /> {selectedSize ? 'Add to Cart' : 'Select a Size'}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
              {[
                { icon: Truck, label: 'Free Shipping', sub: 'on orders above ₹999' },
                { icon: RotateCcw, label: 'Easy Returns', sub: '7-day return policy' },
                { icon: Shield, label: 'Premium Quality', sub: '100% authentic fabric' },
              ].map((item) => (
                <div key={item.label} className="text-center p-3 bg-surface-light rounded-lg">
                  <item.icon size={18} className="mx-auto text-accent-light" />
                  <p className="mt-1 text-[11px] font-medium text-text-primary">{item.label}</p>
                  <p className="text-[10px] text-text-muted">{item.sub}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t border-border text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Fabric</span>
                <span className="text-text-primary">{product.fabric}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Fit</span>
                <span className="text-text-primary">{product.fit}</span>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <RevealOnScroll>
            <section className="mt-20">
              <h2 className="text-2xl font-display text-text-primary mb-6">Complete the Look</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          </RevealOnScroll>
        )}
      </div>
    </div>
  );
}
