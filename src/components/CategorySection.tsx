'use client';

import { products } from '@/lib/products';
import RevealOnScroll from './RevealOnScroll';
import StaggerGrid from './StaggerGrid';
import ProductCard from './ProductCard';

interface Props {
  name: string;
}

export default function CategorySection({ name }: Props) {
  const categoryProducts = products.filter((p) => p.category === name);

  if (categoryProducts.length === 0) return null;

  return (
    <RevealOnScroll>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">{name}</span>
          <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-display text-white">{name}</h2>
          <p className="mt-2 text-sm text-white/60">Explore our collection of premium {name.toLowerCase()}.</p>
        </div>

        <StaggerGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6" staggerDelay={0.08}>
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </StaggerGrid>

        <div className="text-center mt-8">
          <a
            href={`/shop?category=${name.toLowerCase().replace(' ', '-')}`}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded transition-all duration-300"
          >
            View All {name}
          </a>
        </div>
      </section>
    </RevealOnScroll>
  );
}
