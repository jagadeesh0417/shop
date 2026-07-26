'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { categories } from '@/lib/products';
import RevealOnScroll from './RevealOnScroll';
import StaggerGrid from './StaggerGrid';

export default function CategoryGrid() {
  return (
    <RevealOnScroll>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-light">Categories</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display text-text-primary">Shop by Category</h2>
        </div>

        <StaggerGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6" staggerDelay={0.1}>
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/shop?category=${cat.slug}`} className="group relative block aspect-[4/5] rounded-lg overflow-hidden bg-surface-light">
              <motion.img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0341F6]/90 via-[#0341F6]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-display text-white">{cat.name}</h3>
                <span className="inline-flex items-center gap-1 text-xs text-text-secondary group-hover:text-accent-light transition-colors mt-1">
                  {cat.count} Items <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </StaggerGrid>
      </section>
    </RevealOnScroll>
  );
}
