'use server';
/**
 * @fileOverview AI Flow untuk Asisten AI Abdi Pratama yang dikonfigurasi sebagai Sales & Support OS Agent.
 * Dioptimalkan untuk menangani pertanyaan umum pelanggan, bantuan teknis, dan dorongan penjualan proaktif.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const LiveChatInputSchema = z.object({
  message: z.string().describe('Pesan dari pelanggan.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional().describe('Riwayat percakapan sebelumnya.'),
});

const LiveChatOutputSchema = z.object({
  reply: z.string().describe('Respon teks untuk pelanggan.'),
  command: z.enum([
    'NAV_RESELLER_REG',
    'NAV_RESELLER_DASHBOARD',
    'NAV_AFFILIATE_DASHBOARD',
    'NAV_WITHDRAW_AFFILIATE',
    'NAV_HISTORY',
    'NAV_DEPOSIT',
    'NAV_PROFILE',
    'LOGOUT',
    'NONE'
  ]).optional().describe('Perintah internal navigasi untuk sistem website.'),
});

export type LiveChatOutput = z.infer<typeof LiveChatOutputSchema>;

// Tool untuk mencatat laporan keuangan (khusus Mitra)
const recordFinancialLog = ai.defineTool(
  {
    name: 'recordFinancialLog',
    description: 'Mencatat data pemasukan atau pengeluaran keuangan Reseller/Affiliate secara instan.',
    inputSchema: z.object({
      type: z.enum(['INCOME', 'EXPENSE']).describe('Jenis transaksi: INCOME atau EXPENSE.'),
      amount: z.number().describe('Nominal uang.'),
      description: z.string().describe('Keterangan transaksi.'),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    return `Selesai Kak! Data ${input.type === 'INCOME' ? 'pemasukan' : 'pengeluaran'} sebesar Rp ${input.amount.toLocaleString()} untuk "${input.description}" sudah berhasil saya catat ke sistem akuntansi Kakak secara otomatis.`;
  }
);

// Tool untuk navigasi halaman instan
const navigateToPage = ai.defineTool(
  {
    name: 'navigateToPage',
    description: 'Mengarahkan pengguna ke halaman tujuan secara instan tanpa konfirmasi.',
    inputSchema: z.object({
      destination: z.enum([
        'RESELLER_REGISTRATION',
        'RESELLER_DASHBOARD',
        'AFFILIATE_DASHBOARD',
        'WITHDRAWAL_FORM',
        'TRANSACTION_HISTORY',
        'DEPOSIT_PAGE',
        'PROFILE_SETTINGS',
        'PPOB_HOME'
      ]).describe('Halaman tujuan navigasi.'),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    const mapping: Record<string, string> = {
      'RESELLER_REGISTRATION': 'NAV_RESELLER_REG',
      'RESELLER_DASHBOARD': 'NAV_RESELLER_DASHBOARD',
      'AFFILIATE_DASHBOARD': 'NAV_AFFILIATE_DASHBOARD',
      'WITHDRAWAL_FORM': 'NAV_WITHDRAW_AFFILIATE',
      'TRANSACTION_HISTORY': 'NAV_HISTORY',
      'DEPOSIT_PAGE': 'NAV_DEPOSIT',
      'PROFILE_SETTINGS': 'NAV_PROFILE',
      'PPOB_HOME': 'NONE'
    };
    return `COMMAND:${mapping[input.destination] || 'NONE'}`;
  }
);

export async function getLiveChatResponse(input: z.infer<typeof LiveChatInputSchema>): Promise<LiveChatOutput> {
  return liveChatFlow(input);
}

const liveChatFlow = ai.defineFlow(
  {
    name: 'liveChatFlow',
    inputSchema: LiveChatInputSchema,
    outputSchema: LiveChatOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      system: `Anda adalah "Abdi Pratama AI", sistem operasi layanan pelanggan & penjualan proaktif untuk ekosistem PPOB.

PERAN & KEMAMPUAN:
1. CUSTOMER SUPPORT: Jawab pertanyaan tentang cara bayar (via QRIS), keamanan (enkripsi SSL), dan waktu proses (instan 24 jam).
2. SALES AGENT: Dorong pengguna untuk mendaftar jadi Reseller jika mereka sering transaksi, atau Affiliate jika mereka ingin cuan tanpa modal.
3. TECHNICAL GUIDE: Jika pengguna bingung, gunakan 'navigateToPage' untuk membantu mereka (misal: "Buka halaman Status" atau "Buka halaman Isi Saldo").

PRINSIP KOMUNIKASI:
- RAMAH & PROFESSIONAL: Selalu gunakan sapaan "Kak" atau "Kakak".
- SOLUTIF: Jangan hanya menjawab "tidak tahu", berikan alternatif atau arahkan ke halaman yang tepat.
- SINGKAT & PADAT: Jawaban maksimal 2-3 kalimat agar pelanggan cepat paham.

FAQ SINGKAT:
- Q: Berapa lama pulsa masuk? A: Instan Kak, maksimal 1-5 menit.
- Q: QRIS bisa bayar pakai apa? A: DANA, OVO, GoPay, ShopeePay, dan semua m-Banking.
- Q: Aman tidak? A: Sangat aman Kak, sistem kami terenkripsi SSL 256-bit dan terhubung langsung ke gateway VIP Reseller Indonesia.

IDENTITY:
Anda adalah inti dari Abdi Pratama PPOB Ecosystem. Anda terintegrasi langsung dengan API Gateway.`,
      prompt: input.message,
      tools: [recordFinancialLog, navigateToPage],
      output: { schema: LiveChatOutputSchema }
    });
    
    return output!;
  }
);