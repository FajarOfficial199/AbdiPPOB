/**
 * @fileOverview Integrasi API VIP Reseller Indonesia.
 * Menangani permintaan prabayar, pascabayar, dan sinkronisasi produk.
 */

export interface VIPResponse {
  result: boolean;
  message: string;
  data?: any;
}

const ENDPOINT_PREPAID = 'https://vip-reseller.co.id/api/prepaid';

/**
 * Melakukan pemesanan produk prabayar ke VIP Reseller
 */
export async function placePrepaidOrder(params: {
  apiId: string;
  apiKey: string;
  apiSignature?: string;
  serviceCode: string;
  target: string;
  orderId: string;
}): Promise<VIPResponse> {
  try {
    const formData = new URLSearchParams();
    formData.append('key', params.apiKey);
    formData.append('sign', params.apiSignature || params.apiId); 
    formData.append('type', 'order');
    formData.append('service', params.serviceCode);
    formData.append('data_no', params.target);

    const response = await fetch(ENDPOINT_PREPAID, {
      method: 'POST',
      body: formData,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const data = await response.json();
    return {
      result: data.result || false,
      message: data.message || 'No response from provider',
      data: data.data || null
    };
  } catch (error: any) {
    console.error("VIP Reseller place order error:", error);
    return { result: false, message: error.message };
  }
}

/**
 * Fungsi utama untuk pengiriman produk ke pelanggan secara otomatis.
 * Diekspor agar bisa digunakan oleh API route.
 */
export async function sendProductToCustomer(params: {
  target: string;
  productCode: string;
  orderId: string;
}) {
  // Mengambil kredensial dari environment variables atau localStorage di sisi client
  // Namun untuk API route (server side), kita gunakan env
  const apiId = process.env.VIP_API_ID || 'DEMO_SIGN_ID';
  const apiKey = process.env.VIP_API_KEY || 'DEMO_SECURE_KEY';
  const apiSignature = process.env.VIP_API_SIGNATURE || '';

  const res = await placePrepaidOrder({
    apiId,
    apiKey,
    apiSignature,
    serviceCode: params.productCode,
    target: params.target,
    orderId: params.orderId
  });

  return {
    success: res.result,
    message: res.message,
    sn: res.data?.sn || `SN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
  };
}

/**
 * Mendapatkan daftar layanan/produk terbaru
 */
export async function fetchVIPProducts(apiId: string, apiKey: string, apiSignature?: string): Promise<VIPResponse> {
  try {
    const formData = new URLSearchParams();
    formData.append('key', apiKey);
    formData.append('sign', apiSignature || apiId);
    formData.append('type', 'services');

    const response = await fetch(ENDPOINT_PREPAID, {
      method: 'POST',
      body: formData,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const data = await response.json();
    return {
      result: data.result || false,
      message: data.message || 'Fetch success',
      data: data.data || []
    };
  } catch (error: any) {
    console.error("VIP Reseller sync products error:", error);
    return { result: false, message: error.message };
  }
}
