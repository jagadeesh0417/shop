'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';

export default function BrandStory() {
  return (
    <RevealOnScroll>
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920')] bg-cover bg-center bg-fixed opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-light">Our Story</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display text-text-primary">
              From Railway Kodur
              <br />
              <span className="text-gradient">to Your Wardrobe</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-text-secondary leading-relaxed">
              ARHUU Outfits was born from a simple belief — every man deserves to feel confident in what he wears. 
              Founded by Harshad in the heart of Railway Kodur, Andhra Pradesh, we set out to bridge the gap between 
              premium quality and everyday affordability. Every stitch, every fabric, every fit is carefully considered 
              to bring you clothing that looks as good as it feels.
            </p>
            <motion.div whileHover={{ x: 4 }} className="mt-6">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-medium text-accent-light hover:text-white transition-colors"
              >
                Read the full story <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </RevealOnScroll>
  );
}
