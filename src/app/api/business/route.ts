import { NextResponse } from 'next/server';
import { getBusiness, updateBusiness } from '@/lib/store';

export async function GET() {
  const business = getBusiness();
  // Strip staffPin from public payload if needed, or pass safely
  return NextResponse.json({ success: true, business });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updated = updateBusiness(body);
    return NextResponse.json({ success: true, business: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
