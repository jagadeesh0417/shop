import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
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
  isNewArrival?: boolean;
  isBestseller?: boolean;
  rating: number;
  reviews: number;
  createdAt: string;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: Number,
  images: [String],
  category: { type: String, required: true },
  sizes: [String],
  colors: [{ name: String, hex: String }],
  fabric: String,
  fit: String,
  inStock: { type: Boolean, default: true },
  isNewArrival: Boolean,
  isBestseller: Boolean,
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  createdAt: { type: String, default: () => new Date().toISOString().split('T')[0] },
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
