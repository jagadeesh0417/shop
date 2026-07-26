'use client';

export interface Banner {
  id: string;
  image: string;
  title: string;
  link: string;
  active: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  minAmount: number;
  active: boolean;
}

const BANNERS_KEY = 'arhuu_banners';
const COUPONS_KEY = 'arhuu_coupons';

const defaultBanners: Banner[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
    title: 'New Collection Drop',
    link: '/shop',
    active: true,
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1200',
    title: 'Premium Shirts — Up to 40% Off',
    link: '/shop?category=shirts',
    active: true,
  },
];

const defaultCoupons: Coupon[] = [
  { id: '1', code: 'ARHUU10', type: 'percentage', value: 10, minAmount: 999, active: true },
  { id: '2', code: 'FLAT200', type: 'flat', value: 200, minAmount: 1499, active: true },
];

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// Banners
export function getBanners(): Banner[] {
  return getItem<Banner[]>(BANNERS_KEY, defaultBanners);
}

export function saveBanners(list: Banner[]): void {
  setItem(BANNERS_KEY, list);
}

export function addBanner(banner: Omit<Banner, 'id'>): Banner[] {
  const list = getBanners();
  const id = String(Date.now());
  const updated = [...list, { ...banner, id }];
  saveBanners(updated);
  return updated;
}

export function removeBanner(id: string): Banner[] {
  const list = getBanners().filter((b) => b.id !== id);
  saveBanners(list);
  return list;
}

export function getActiveBanners(): Banner[] {
  return getBanners().filter((b) => b.active);
}

// Coupons
export function getCoupons(): Coupon[] {
  return getItem<Coupon[]>(COUPONS_KEY, defaultCoupons);
}

export function saveCoupons(list: Coupon[]): void {
  setItem(COUPONS_KEY, list);
}

export function addCoupon(coupon: Omit<Coupon, 'id'>): Coupon[] {
  const list = getCoupons();
  const id = String(Date.now());
  const updated = [...list, { ...coupon, id }];
  saveCoupons(updated);
  return updated;
}

export function removeCoupon(id: string): Coupon[] {
  const list = getCoupons().filter((c) => c.id !== id);
  saveCoupons(list);
  return list;
}

export function validateCoupon(code: string, subtotal: number): Coupon | null {
  const coupons = getCoupons();
  const coupon = coupons.find(
    (c) => c.code.toUpperCase() === code.toUpperCase() && c.active && subtotal >= c.minAmount
  );
  return coupon || null;
}

export function applyDiscount(subtotal: number, coupon: Coupon): number {
  if (coupon.type === 'percentage') {
    return subtotal - (subtotal * coupon.value) / 100;
  }
  return subtotal - coupon.value;
}
