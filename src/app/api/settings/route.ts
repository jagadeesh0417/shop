import { connectDB } from '@/lib/db';
import Product from '@/lib/models/Product';
import Order from '@/lib/models/Order';
import Coupon from '@/lib/models/Coupon';
import Banner from '@/lib/models/Banner';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    const [productCount, orderCount, couponCount, bannerCount, orders] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Coupon.countDocuments(),
      Banner.countDocuments(),
      Order.find({}, 'total status createdAt').sort({ createdAt: -1 }).lean(),
    ]);

    const totalRevenue = orders.reduce((sum, o: any) => sum + (o.total || 0), 0);
    const statusBreakdown: Record<string, number> = {};
    for (const o of orders) {
      statusBreakdown[o.status] = (statusBreakdown[o.status] || 0) + 1;
    }

    return NextResponse.json({
      productCount,
      orderCount,
      couponCount,
      bannerCount,
      totalRevenue,
      statusBreakdown,
      recentOrders: orders.slice(0, 5),
    });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
