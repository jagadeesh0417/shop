const BASE = '';

export async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function fetchProducts() {
  return fetchAPI<any[]>('/api/products');
}

export async function fetchProductBySlug(slug: string) {
  return fetchAPI<any>(`/api/products/${slug}`);
}

export async function fetchBanners() {
  return fetchAPI<any[]>('/api/banners');
}

export async function fetchCoupons() {
  return fetchAPI<any[]>('/api/coupons');
}

export async function fetchSettings() {
  return fetchAPI<{ productCount: number; orderCount: number; couponCount: number; bannerCount: number }>('/api/settings');
}

export async function createBanner(data: { image: string; title: string; link: string; active: boolean }) {
  return fetchAPI<any>('/api/banners', { method: 'POST', body: JSON.stringify(data) });
}

export async function deleteBanner(id: string) {
  return fetchAPI<any>('/api/banners', { method: 'DELETE', body: JSON.stringify({ id }) });
}

export async function createCoupon(data: { code: string; type: string; value: number; minAmount: number; active: boolean }) {
  return fetchAPI<any>('/api/coupons', { method: 'POST', body: JSON.stringify(data) });
}

export async function deleteCoupon(id: string) {
  return fetchAPI<any>('/api/coupons', { method: 'DELETE', body: JSON.stringify({ id }) });
}

export async function createOrder(data: any) {
  return fetchAPI<any>('/api/orders', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateOrderStatus(id: string, status: string) {
  return fetchAPI<any>('/api/orders', { method: 'PUT', body: JSON.stringify({ id, status }) });
}
