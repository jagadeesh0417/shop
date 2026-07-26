import mongoose, { Schema, Document } from 'mongoose';

export interface IBanner extends Document {
  image: string;
  title: string;
  link: string;
  active: boolean;
}

const BannerSchema = new Schema<IBanner>({
  image: { type: String, required: true },
  title: { type: String, required: true },
  link: { type: String, default: '' },
  active: { type: Boolean, default: true },
});

export default mongoose.models.Banner || mongoose.model<IBanner>('Banner', BannerSchema);
