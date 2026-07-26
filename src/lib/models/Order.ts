import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  items: { productId: string; name: string; price: number; size: string; quantity: number; image: string }[];
  status: 'placed' | 'shipped' | 'out-for-delivery' | 'delivered';
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  coupon?: string;
  discount: number;
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: string;
  estimatedDelivery: string;
}

const OrderSchema = new Schema<IOrder>({
  items: [{
    productId: String,
    name: String,
    price: Number,
    size: String,
    quantity: Number,
    image: String,
  }],
  status: {
    type: String,
    enum: ['placed', 'shipped', 'out-for-delivery', 'delivered'],
    default: 'placed',
  },
  shippingAddress: {
    fullName: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
  },
  paymentMethod: String,
  coupon: String,
  discount: { type: Number, default: 0 },
  subtotal: Number,
  shipping: { type: Number, default: 0 },
  total: Number,
  createdAt: { type: String, default: () => new Date().toISOString() },
  estimatedDelivery: {
    type: String,
    default: () => {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      return d.toISOString().split('T')[0];
    },
  },
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
