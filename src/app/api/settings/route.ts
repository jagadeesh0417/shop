import { connectDB } from '@/lib/db';
import Product from '@/lib/models/Product';
import Order from '@/lib/models/Order';
import Coupon from '@/lib/models/Coupon';
import Banner from '@/lib/models/Banner';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    const couponCount = await Coupon.countDocuments();
    const bannerCount = await Banner.countDocuments();
    return NextResponse.json({ productCount, orderCount, couponCount, bannerCount });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
