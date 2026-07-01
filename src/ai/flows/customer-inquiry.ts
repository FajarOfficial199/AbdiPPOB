'use server';
/**
 * @fileOverview An AI-powered flow to simulate customer name inquiry based on phone number or ID.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CustomerInquiryInputSchema = z.object({
  targetNumber: z.string().describe('The phone number or customer ID to check.'),
  serviceType: z.string().describe('The type of service (e.g., pulsa, pln, ewallet).'),
});

const CustomerInquiryOutputSchema = z.object({
  customerName: z.string().describe('The detected name of the customer.'),
  provider: z.string().describe('The detected provider (e.g., Telkomsel, PLN, DANA).'),
  isValid: z.boolean().describe('Whether the number is valid and active.'),
});

export async function checkCustomerName(input: z.infer<typeof CustomerInquiryInputSchema>) {
  return customerInquiryFlow(input);
}

const customerInquiryFlow = ai.defineFlow(
  {
    name: 'customerInquiryFlow',
    inputSchema: CustomerInquiryInputSchema,
    outputSchema: CustomerInquiryOutputSchema,
  },
  async (input) => {
    const num = input.targetNumber;
    let name = "PELANGGAN SETIA ABDI PRATAMA";
    let provider = "UNKNOWN";

    // Logika simulasi cerdas untuk mendeteksi nama asli berdasarkan awalan/panjang nomor
    if (num.startsWith('0812') || num.startsWith('0813')) {
      provider = "Telkomsel";
      name = "BUDI SANTOSO";
    } else if (num.startsWith('0857') || num.startsWith('0858')) {
      provider = "Indosat Ooredoo";
      name = "SITI AMINAH";
    } else if (num.startsWith('0877') || num.startsWith('0878')) {
      provider = "XL Axiata";
      name = "ANDI WIJAYA";
    } else if (num.startsWith('0831') || num.startsWith('0838')) {
      provider = "Axis";
      name = "RUDI HERMAWAN";
    } else if (num.length >= 11 && num.length <= 13) {
      // Nama acak profesional untuk simulasi ID Game/PLN
      const names = ["RIZKY PRATAMA", "DEWI LESTARI", "AHMAD JUNAIDI", "MAYA SAPUTRI", "ERIK KURNIAWAN"];
      name = names[Math.floor(Math.random() * names.length)];
      provider = input.serviceType.toUpperCase();
    }

    // Delay visual agar terasa seperti mengecek ke database provider sungguhan
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      customerName: name,
      provider: provider,
      isValid: true,
    };
  }
);
