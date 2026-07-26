'use client';

import { ShieldCheck, Truck, RotateCcw, Banknote } from 'lucide-react';

const badges = [
  { icon: ShieldCheck, label: 'Premium Fabric' },
  { icon: Truck, label: 'Pan-India Shipping' },
  { icon: RotateCcw, label: 'Easy Returns' },
  { icon: Banknote, label: 'Cash on Delivery' },
];

export default function Marquee() {
  const items = [...badges, ...badges, ...badges];

  return (
    <div className="w-full overflow-hidden border-y border-border bg-surface/50 py-3">
      <div className="flex animate-marquee gap-12 whitespace-nowrap" style={{ width: 'max-content' }}>
        {items.map((badge, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-sm text-text-secondary font-medium">
            <badge.icon size={16} className="text-accent" />
            {badge.label}
          </span>
        ))}
      </div>
    </div>
  );
}
