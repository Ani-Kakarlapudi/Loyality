import { NextResponse } from 'next/server';
import { performScratch, claimSocialBonus, redeemVoucher } from '@/lib/store';

export async function POST(req: Request) {
  try {
    const { action, phone, pin, rewardId, type } = await req.json();
    if (!phone) {
      return NextResponse.json({ success: false, message: 'Phone number is required' }, { status: 400 });
    }

    if (action === 'scratch') {
      const result = performScratch(phone);
      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    }

    if (action === 'social') {
      if (!type || (type !== 'instagram' && type !== 'google_review')) {
        return NextResponse.json({ success: false, message: 'Invalid social action type' }, { status: 400 });
      }
      const result = claimSocialBonus(phone, type);
      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    }

    if (action === 'redeem') {
      if (!rewardId || !pin) {
        return NextResponse.json({ success: false, message: 'Voucher ID and Staff PIN are required' }, { status: 400 });
      }
      const result = redeemVoucher(phone, rewardId, pin);
      return NextResponse.json(result, { status: result.success ? 200 : 403 });
    }

    return NextResponse.json({ success: false, message: 'Unknown reward action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
