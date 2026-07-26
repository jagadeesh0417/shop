'use client';

import { Camera } from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';

const posts = [
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400',
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400',
  'https://images.unsplash.com/photo-1598033129183-c4f50c736e10?w=400',
  'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400',
  'https://images.unsplash.com/photo-1594930328898-3bb320e2f9dd?w=400',
];

export default function InstagramGallery() {
  return (
    <RevealOnScroll>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-light">Instagram</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display text-white">@arhuuoutfits</h2>
          <p className="mt-3 text-sm text-text-secondary">Follow us for style inspiration and new drops.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {posts.map((src, i) => (
            <a
              key={i}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-lg bg-surface-light"
            >
              <img
                src={src}
                alt={`Instagram post ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#0341F6]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Camera size={24} className="text-white" />
              </div>
            </a>
          ))}
        </div>
      </section>
    </RevealOnScroll>
  );
}
