import { NextResponse } from 'next/server';
import { sendProductToCustomer } from '@/lib/services/vip-reseller';

/**
 * API Route untuk memproses pesanan dan meneruskannya ke provider secara otomatis.
 */
export async function POST(req: Request) {
  try {
    const { targetNumber, productCode, orderId } = await req.json();

    if (!targetNumber || !productCode) {
      return NextResponse.json({ success: false, message: "Data tidak lengkap" }, { status: 400 });
    }

    // Panggil service pengiriman otomatis
    const result = await sendProductToCustomer({
      target: targetNumber,
      productCode: productCode,
      orderId: orderId || `AP-${Date.now()}`
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Pesanan Berhasil Dikirim!",
        sn: result.sn
      });
    } else {
      return NextResponse.json({
        success: false,
        message: result.message
      }, { status: 400 });
    }

  } catch (error: any) {
    console.error("Critical order error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan sistem pengiriman otomatis." }, { status: 500 });
  }
}
