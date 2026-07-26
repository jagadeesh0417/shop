'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { products, categories } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import RevealOnScroll from '@/components/RevealOnScroll';
import { cn } from '@/lib/utils';

const allSizes = ['S', 'M', 'L', 'XL', 'XXL'];
const priceRanges = [
  { label: 'Under ₹1,500', min: 0, max: 1500 },
  { label: '₹1,500 – ₹2,000', min: 1500, max: 2000 },
  { label: 'Above ₹2,000', min: 2000, max: Infinity },
];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category.toLowerCase() === selectedCategory);
    }

    if (selectedSizes.length > 0) {
      result = result.filter((p) => p.sizes.some((s) => selectedSizes.includes(s)));
    }

    if (selectedPrice !== null) {
      const range = priceRanges[selectedPrice];
      result = result.filter((p) => p.price >= range.min && p.price < range.max);
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [selectedCategory, selectedSizes, selectedPrice, sortBy]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-light">Catalog</span>
              <h1 className="mt-2 text-3xl sm:text-4xl font-display text-white">All Products</h1>
              <p className="mt-1 text-sm text-text-secondary">{filtered.length} styles available</p>
            </div>
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-lg text-text-secondary hover:text-accent hover:border-white/50 transition-colors"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
          </div>
        </RevealOnScroll>

        <div className="flex gap-8">
          <AnimatePresence>
            {filtersOpen && (
              <motion.aside
                initial={{ opacity: 0, x: -20, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 'auto' }}
                exit={{ opacity: 0, x: -20, width: 0 }}
                className="hidden md:block w-60 shrink-0"
              >
                <div className="space-y-6 sticky top-28">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">Category</h3>
                    <div className="space-y-1">
                      <button
                        onClick={() => setSelectedCategory('all')}
                        className={cn(
                          'block w-full text-left px-3 py-1.5 text-sm rounded transition-colors',
                          selectedCategory === 'all' ? 'bg-white text-[#0341F6]' : 'text-text-secondary hover:text-accent'
                        )}
                      >
                        All
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.slug}
                          onClick={() => setSelectedCategory(cat.slug)}
                          className={cn(
                            'block w-full text-left px-3 py-1.5 text-sm rounded transition-colors',
                            selectedCategory === cat.slug ? 'bg-white text-[#0341F6]' : 'text-text-secondary hover:text-accent'
                          )}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">Size</h3>
                    <div className="flex flex-wrap gap-2">
                      {allSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => toggleSize(size)}
                          className={cn(
                            'w-9 h-9 text-xs font-medium rounded border transition-colors',
                            selectedSizes.includes(size)
? 'bg-white text-[#0341F6] border-white'
                              : 'border-border text-text-secondary hover:text-accent hover:border-text-muted'
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">Price</h3>
                    <div className="space-y-1">
                      {priceRanges.map((range, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedPrice(selectedPrice === i ? null : i)}
                          className={cn(
                            'block w-full text-left px-3 py-1.5 text-sm rounded transition-colors',
                            selectedPrice === i ? 'bg-white text-[#0341F6]' : 'text-text-secondary hover:text-accent'
                          )}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">Sort By</h3>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full bg-surface-light border border-border rounded px-3 py-2 text-sm text-text-secondary focus:outline-none focus:border-accent"
                    >
                      <option value="newest">Newest</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Top Rated</option>
                    </select>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          <div className="flex-1">
            {filtersOpen && (
              <div className="md:hidden mb-4 p-4 bg-surface rounded-lg border border-border space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Filters</h3>
                  <button onClick={() => setFiltersOpen(false)} className="text-text-muted hover:text-white"><X size={16} /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => setSelectedCategory(selectedCategory === cat.slug ? 'all' : cat.slug)}
                      className={cn(
                        'px-3 py-1 text-xs rounded-full border transition-colors',
                        selectedCategory === cat.slug ? 'bg-white text-[#0341F6] border-white' : 'border-border text-text-secondary'
                      )}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-surface-light border border-border rounded px-3 py-2 text-sm text-text-secondary focus:outline-none focus:border-accent"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            )}

            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <p className="text-text-muted">No products match your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
