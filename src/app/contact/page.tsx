'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Camera, MessageCircle, Send } from 'lucide-react';
import RevealOnScroll from '@/components/RevealOnScroll';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-light">Contact</span>
            <h1 className="mt-2 text-3xl sm:text-4xl font-display text-white">Get in Touch</h1>
            <p className="mt-2 text-sm text-text-secondary">Have a question? We&apos;d love to hear from you.</p>
          </div>
        </RevealOnScroll>

        <div className="grid md:grid-cols-2 gap-8">
          <RevealOnScroll>
            <form onSubmit={handleSubmit} className="bg-surface rounded-lg p-6 sm:p-8 border border-border space-y-4">
              <div>
                <label className="text-xs text-text-muted mb-1 block">Your Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full bg-surface-light border border-border rounded px-3 py-2.5 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-text-muted mb-1 block">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full bg-surface-light border border-border rounded px-3 py-2.5 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-text-muted mb-1 block">Message</label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  className="w-full bg-surface-light border border-border rounded px-3 py-2.5 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors resize-none"
                />
              </div>
              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                className="w-full py-3 bg-white hover:bg-white/90 text-[#0341F6] text-sm font-medium rounded transition-colors flex items-center justify-center gap-2"
              >
                {submitted ? (
                  <span className="flex items-center gap-2 text-success">
                    <Send size={14} /> Message Sent!
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send size={14} /> Send Message
                  </span>
                )}
              </motion.button>
            </form>
          </RevealOnScroll>

          <RevealOnScroll delay={0.15}>
            <div className="space-y-4">
              {[
                { icon: MapPin, label: 'Address', value: 'Railway Kodur, Andhra Pradesh 516101' },
                { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
                { icon: Mail, label: 'Email', value: 'hello@arhuu.com' },
              ].map((item) => (
                <div key={item.label} className="bg-surface rounded-lg p-5 border border-border flex items-start gap-4">
                  <item.icon size={20} className="text-accent-light shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm text-white mt-0.5">{item.value}</p>
                  </div>
                </div>
              ))}

              <div className="bg-surface rounded-lg p-5 border border-border">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-3">Follow Us</p>
                <div className="flex items-center gap-3">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-surface-light border border-border rounded text-sm text-text-secondary hover:text-white hover:border-text-muted transition-colors"
                  >
                    <Camera size={16} /> Instagram
                  </a>
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-surface-light border border-border rounded text-sm text-text-secondary hover:text-white hover:border-text-muted transition-colors"
                  >
                    <MessageCircle size={16} /> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </div>
  );
}
