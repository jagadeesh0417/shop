'use client';

import { Star, Quote } from 'lucide-react';
import { testimonials } from '@/lib/products';
import RevealOnScroll from './RevealOnScroll';
import StaggerGrid from './StaggerGrid';

export default function Testimonials() {
  return (
    <RevealOnScroll>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-light">Testimonials</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display text-text-primary">What Our Customers Say</h2>
        </div>

        <StaggerGrid className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
          {testimonials.map((t) => (
            <div key={t.id} className="bg-surface rounded-lg p-6 border border-border relative">
              <Quote size={24} className="text-accent/30 absolute top-4 right-4" />
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < t.rating ? 'fill-warning text-warning' : 'text-border'}
                  />
                ))}
              </div>
              <p className="text-sm text-text-secondary leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
              <div>
                <p className="text-sm font-medium text-text-primary">{t.name}</p>
                <p className="text-xs text-text-muted">{t.location}</p>
              </div>
            </div>
          ))}
        </StaggerGrid>
      </section>
    </RevealOnScroll>
  );
}
