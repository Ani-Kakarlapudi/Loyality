import { NextResponse } from 'next/server';
import { addStamps } from '@/lib/store';

export async function POST(req: Request) {
  try {
    const { phone, pin, count } = await req.json();
    if (!phone || !pin) {
      return NextResponse.json({ success: false, message: 'Phone and Staff PIN are required' }, { status: 400 });
    }

    const result = addStamps(phone, pin, count || 1);
    if (!result.success) {
      return NextResponse.json(result, { status: 403 });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
