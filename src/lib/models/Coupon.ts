import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  minAmount: number;
  active: boolean;
}

const CouponSchema = new Schema<ICoupon>({
  code: { type: String, required: true, unique: true },
  type: { type: String, enum: ['percentage', 'flat'], required: true },
  value: { type: Number, required: true },
  minAmount: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
});

export default mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);
