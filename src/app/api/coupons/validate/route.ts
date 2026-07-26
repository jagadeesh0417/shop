import { connectDB } from '@/lib/db';
import Coupon from '@/lib/models/Coupon';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { code, subtotal } = await req.json();
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      active: true,
      minAmount: { $lte: subtotal },
    }).lean();

    if (!coupon) {
      return NextResponse.json({ valid: false, message: 'Invalid or expired coupon' });
    }

    return NextResponse.json({ valid: true, coupon });
  } catch {
    return NextResponse.json({ valid: false, message: 'Error validating coupon' }, { status: 500 });
  }
}
