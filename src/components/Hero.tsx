'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!blobRef.current) return;
    const blob = blobRef.current;
    let x = 0, y = 0;
    const onMove = (e: MouseEvent) => {
      x = (e.clientX / window.innerWidth - 0.5) * 20;
      y = (e.clientY / window.innerHeight - 0.5) * 20;
      blob.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      <div className="absolute inset-0" />

      <div ref={blobRef} className="absolute -top-1/2 -right-1/2 w-[800px] h-[800px] rounded-full bg-white/8 blur-[120px] transition-transform duration-300 ease-out pointer-events-none" />
      <div className="absolute -bottom-1/2 -left-1/2 w-[600px] h-[600px] rounded-full bg-white/5 blur-[100px] transition-transform duration-300 ease-out pointer-events-none" />

      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32 lg:py-40">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-white/60 mb-4">
              Founded in Railway Kodur
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-5xl sm:text-6xl lg:text-8xl font-display text-white leading-[0.9] tracking-tight"
          >
            Premium Fashion
            <br />
            <span className="text-gradient">For Every</span>
            <br />
            Occasion
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-6 text-base sm:text-lg text-white/70 leading-relaxed max-w-lg"
          >
            Trendy styles, best quality — from casual shirts to premium polos, crafted for the modern man.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-8 flex items-center gap-4"
          >
            <Link
              href="/shop"
              className="group relative inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#0341F6] text-sm font-medium uppercase tracking-wider rounded overflow-hidden transition-all duration-300 hover:bg-white/90"
            >
              <span className="relative z-10 flex items-center gap-2">
                Shop Now
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 bg-black/5 translate-x-[-100%] skew-x-12 group-hover:translate-x-[200%] transition-transform duration-700" />
            </Link>
            <Link
              href="/about"
              className="text-sm text-white/70 hover:text-white transition-colors border-b border-white/20 hover:border-white pb-0.5"
            >
              Our Story
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
