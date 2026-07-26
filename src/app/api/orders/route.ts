import { connectDB } from '@/lib/db';
import Order from '@/lib/models/Order';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const order = await Order.create(body);
    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const { id, status } = await req.json();
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true }).lean();
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
