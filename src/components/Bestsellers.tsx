'use client';

import { products } from '@/lib/products';
import RevealOnScroll from './RevealOnScroll';
import StaggerGrid from './StaggerGrid';
import ProductCard from './ProductCard';

export default function Bestsellers() {
  const bestsellers = products.filter((p) => p.isBestseller);

  return (
    <RevealOnScroll>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-light">Bestsellers</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display text-white">Most Loved Styles</h2>
          <p className="mt-3 text-sm text-text-secondary max-w-md mx-auto">
            The pieces our customers reach for again and again.
          </p>
        </div>

        <StaggerGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6" staggerDelay={0.08}>
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </StaggerGrid>
      </section>
    </RevealOnScroll>
  );
}
