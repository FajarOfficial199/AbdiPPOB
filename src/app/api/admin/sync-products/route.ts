
import { NextResponse } from 'next/server';
import { fetchVIPProducts } from '@/lib/services/vip-reseller';

export async function POST(req: Request) {
  try {
    const { apiId, apiKey, apiSignature } = await req.json();

    if (!apiId || !apiKey) {
      return NextResponse.json({ success: false, message: "Kredensial API tidak lengkap" }, { status: 400 });
    }

    const result = await fetchVIPProducts(apiId, apiKey, apiSignature);

    if (result.result) {
      return NextResponse.json({
        success: true,
        message: "Produk berhasil disinkronkan!",
        count: result.data?.length || 0,
        products: result.data
      });
    } else {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

  } catch (error: any) {
    console.error("API sync products error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
