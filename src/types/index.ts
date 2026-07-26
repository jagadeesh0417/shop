export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  fabric: string;
  fit: string;
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  rating: number;
  reviews: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: 'placed' | 'shipped' | 'out-for-delivery' | 'delivered';
  shippingAddress: Address;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: string;
  estimatedDelivery: string;
}

export interface Address {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  image?: string;
}
