import { NextResponse } from 'next/server';
import { getCustomer, upsertCustomer } from '@/lib/store';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get('phone');
  if (!phone) {
    return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
  }

  const customer = getCustomer(phone);
  if (!customer) {
    return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, customer });
}

export async function POST(req: Request) {
  try {
    const { phone, name } = await req.json();
    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }

    const customer = upsertCustomer(phone, name);
    return NextResponse.json({ success: true, customer });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
