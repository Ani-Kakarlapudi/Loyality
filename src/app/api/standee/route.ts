import { NextResponse } from 'next/server';
import { getStats, getBusiness } from '@/lib/store';
import QRCode from 'qrcode';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const targetUrl = searchParams.get('url');

    const business = getBusiness();
    const stats = getStats();

    let qrDataUrl = '';
    const fullUrl = targetUrl || `http://localhost:3000/c/${business.slug}`;
    qrDataUrl = await QRCode.toDataURL(fullUrl, {
      margin: 1,
      width: 400,
      color: {
        dark: '#1e1b4b',
        light: '#ffffff',
      }
    });

    return NextResponse.json({
      success: true,
      stats,
      business,
      qrDataUrl,
      customerUrl: fullUrl
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
