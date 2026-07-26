import { connectDB } from '@/lib/db';
import Banner from '@/lib/models/Banner';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    const banners = await Banner.find().lean();
    return NextResponse.json(banners);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const banner = await Banner.create(body);
    return NextResponse.json(banner, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { id } = await req.json();
    await Banner.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
