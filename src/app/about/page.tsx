'use client';

import { Quote, Target, Eye, Heart } from 'lucide-react';
import RevealOnScroll from '@/components/RevealOnScroll';

export default function AboutPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <RevealOnScroll>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-light">About Us</span>
            <h1 className="mt-3 text-4xl sm:text-6xl lg:text-7xl font-display text-white">Our Story</h1>
          </RevealOnScroll>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <RevealOnScroll>
          <div className="bg-surface rounded-lg p-8 sm:p-12 border border-border">
            <Quote size={32} className="text-accent/30 mb-4" />
            <p className="text-lg sm:text-xl text-white leading-relaxed font-medium">
              Every man deserves to feel confident in what he wears.
            </p>
            <p className="mt-4 text-sm text-text-secondary leading-relaxed">
              ARHUU Outfits was founded by Harshad in Railway Kodur, a small town in Andhra Pradesh with a big dream — 
              to bring premium, trend-driven men&apos;s fashion to every corner of India. What started as a passion project 
              has grown into a brand that celebrates quality, fit, and timeless style.
            </p>
            <p className="mt-3 text-sm text-text-secondary leading-relaxed">
              We believe fashion should be accessible without compromising on quality. Every piece in our collection is 
              crafted from carefully sourced fabrics, designed for the modern Indian man who values both style and comfort. 
              From the bustling streets of Kodur to homes across the country, ARHUU is built on a foundation of trust, 
              craftsmanship, and an unwavering commitment to excellence.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid sm:grid-cols-3 gap-6 mt-8">
          {[
            { icon: Target, title: 'Our Mission', text: 'To redefine men\'s fashion in India with premium quality clothing that blends modern trends with timeless design.' },
            { icon: Eye, title: 'Our Vision', text: 'To become India\'s most trusted men\'s clothing brand, known for uncompromising quality and style.' },
            { icon: Heart, title: 'Our Values', text: 'Quality, integrity, and customer satisfaction are at the heart of everything we do at ARHUU.' },
          ].map((item, i) => (
            <RevealOnScroll key={i} delay={i * 0.1}>
              <div className="bg-surface rounded-lg p-6 border border-border text-center">
                <item.icon size={24} className="mx-auto text-accent-light mb-3" />
                <h3 className="text-sm font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{item.text}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={0.2}>
          <div className="mt-12 bg-surface rounded-lg p-8 sm:p-12 border border-border text-center">
            <h2 className="text-2xl sm:text-3xl font-display text-white mb-4">Meet the Founder</h2>
            <div className="w-24 h-24 rounded-full bg-accent/20 mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl font-display text-accent-light">H</span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed max-w-lg mx-auto">
              Harshad founded ARHUU Outfits with a vision to create a men&apos;s clothing brand that combines premium 
              fabrics with contemporary design. His journey from Railway Kodur to building a pan-India fashion label 
              is driven by a deep passion for style and an entrepreneurial spirit.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  );
}
