'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Star } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const { addItem } = useCart();

  return (
    <motion.div
      className="group relative bg-surface rounded-lg overflow-hidden border border-border hover:border-accent/30 transition-colors duration-300"
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link href={`/shop/${product.slug}`}>
        <div className="aspect-[3/4] overflow-hidden bg-surface-light relative">
          {!imgLoaded && <div className="absolute inset-0 shimmer" />}
          <motion.img
            src={product.images[0]}
            alt={product.name}
            onLoad={() => setImgLoaded(true)}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          />
          {product.isNew && (
            <span className="absolute top-3 left-3 px-2 py-1 bg-white/15 text-white text-[10px] font-semibold uppercase tracking-wider rounded">
              New
            </span>
          )}
          {product.originalPrice && (
            <span className="absolute top-3 right-3 px-2 py-1 bg-error/90 text-white text-[10px] font-semibold uppercase tracking-wider rounded">
              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
            </span>
          )}
        </div>
      </Link>

      <div className="p-3 sm:p-4">
        <div className="flex items-center gap-1 mb-1">
          <Star size={12} className="fill-warning text-warning" />
          <span className="text-[11px] text-text-muted">{product.rating} ({product.reviews})</span>
        </div>
        <Link href={`/shop/${product.slug}`}>
          <h3 className="text-sm sm:text-base font-medium text-white truncate group-hover:text-accent-light transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold text-text-primary">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-text-muted line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        <button
          onClick={() => addItem(product, product.sizes[0])}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2 text-xs font-medium uppercase tracking-wider bg-white hover:bg-white/90 text-[#0341F6] rounded transition-all duration-300"
        >
          <ShoppingBag size={14} />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
