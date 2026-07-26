import Link from 'next/link';
import { Mail, Phone, MapPin, Camera, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <span className="text-2xl font-display tracking-wider text-white">ARHUU</span>
            <p className="mt-3 text-sm text-text-secondary leading-relaxed">
              Premium Fashion for Every Occasion. Trendy Styles, Best Quality. Founded in Railway Kodur, Andhra Pradesh.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 border border-border rounded-full text-text-secondary hover:text-accent hover:border-accent transition-colors">
                <Camera size={16} />
              </a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="p-2 border border-border rounded-full text-text-secondary hover:text-accent hover:border-accent transition-colors">
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Shop', 'About', 'Contact', 'Order Tracking'].map((label) => (
                <li key={label}>
                  <Link href={`/${label.toLowerCase().replace(' ', '-')}`} className="text-sm text-text-secondary hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Categories</h3>
            <ul className="space-y-2">
              {['Shirts', 'Pants', 'T-Shirts', 'Hoodies', 'Tracks'].map((cat) => (
                <li key={cat}>
                  <Link href={`/shop?category=${cat.toLowerCase().replace(' ', '-')}`} className="text-sm text-text-secondary hover:text-white transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-text-secondary">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                Railway Kodur, Andhra Pradesh
              </li>
              <li className="flex items-center gap-2 text-sm text-text-secondary">
                <Phone size={14} className="shrink-0" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2 text-sm text-text-secondary">
                <Mail size={14} className="shrink-0" />
                hello@arhuu.com
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">&copy; {new Date().getFullYear()} ARHUU Outfits. All rights reserved.</p>
          <p className="text-xs text-text-muted">Designed with pride in India</p>
        </div>
      </div>
    </footer>
  );
}
