
'use server';
/**
 * @fileOverview An AI agent for validating payment proofs.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PaymentProofValidationInputSchema = z.object({
  paymentProofImageUri: z
    .string()
    .describe(
      "A payment proof image, provided as a public URL or a Base64 data URI."
    ),
  expectedAmount: z.number().describe('The expected transaction amount in IDR.'),
  transactionId: z.string().describe('The unique ID of the transaction to verify.'),
  merchantName: z
    .string()
    .describe('The name of the merchant expected on the payment proof (e.g., Abdi Pratama PPOB).'),
  customerName: z.string().optional().describe('Optional: The name of the customer for context.'),
});
export type PaymentProofValidationInput = z.infer<typeof PaymentProofValidationInputSchema>;

const PaymentProofValidationOutputSchema = z.object({
  isMatch: z
    .boolean()
    .describe('True if the payment proof matches the transaction details.'),
  confidenceScore: z
    .number()
    .min(0)
    .max(100)
    .describe('A confidence score (0-100) for the validation.'),
  extractedAmount: z.number().describe('The payment amount extracted from the proof.'),
  extractedMerchant: z.string().describe('The merchant name extracted from the proof.'),
  extractedTransactionId: z
    .string()
    .optional()
    .describe('The transaction ID or reference number extracted from the proof.'),
  suggestedStatus: z
    .enum(['APPROVED', 'REJECTED', 'PENDING_MANUAL_REVIEW'])
    .describe("Suggested status: 'APPROVED', 'REJECTED', or 'PENDING_MANUAL_REVIEW'."),
  reason: z.string().describe('Explanation for the decision.'),
});
export type PaymentProofValidationOutput = z.infer<typeof PaymentProofValidationOutputSchema>;

export async function validatePaymentProof(
  input: PaymentProofValidationInput
): Promise<PaymentProofValidationOutput> {
  return paymentProofValidationFlow(input);
}

const paymentProofValidationPrompt = ai.definePrompt({
  name: 'paymentProofValidationPrompt',
  input: { schema: PaymentProofValidationInputSchema },
  output: { schema: PaymentProofValidationOutputSchema },
  prompt: `You are a high-precision AI specialized in financial audit and payment proof validation. 
Your goal is to meticulously examine the provided payment proof image and verify it against the transaction details.

Expected Details:
- Expected Amount: Rp {{{expectedAmount}}}
- Transaction/Reference ID: {{{transactionId}}}
- Target Merchant: {{{merchantName}}}
{{#if customerName}}- Sender/Customer: {{{customerName}}}{{/if}}

Protocol:
1. Locate the numerical amount paid. Note that some banks use dots or commas as decimal separators.
2. Locate the merchant name or destination account name.
3. Check if the date of transaction is recent.
4. Extract any reference numbers or SN.

Rules for 'isMatch':
- Set to true only if the Extracted Amount equals Expected Amount.
- Set to false if the amount differs by more than 1 IDR.
- Set suggestedStatus to APPROVED only if isMatch is true and confidence is > 90.
- Otherwise, set suggestedStatus to PENDING_MANUAL_REVIEW.

Payment Proof Visual Payload: {{media url=paymentProofImageUri}}`,
});

const paymentProofValidationFlow = ai.defineFlow(
  {
    name: 'paymentProofValidationFlow',
    inputSchema: PaymentProofValidationInputSchema,
    outputSchema: PaymentProofValidationOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await paymentProofValidationPrompt(input);
      if (!output) throw new Error("AI output empty");
      return output;
    } catch (err) {
      console.error("AI Validation Flow Error:", err);
      return {
        isMatch: false,
        confidenceScore: 0,
        extractedAmount: 0,
        extractedMerchant: "ERROR_ACCESS",
        suggestedStatus: 'PENDING_MANUAL_REVIEW',
        reason: "Gagal memproses visual payload. Kemungkinan format gambar tidak didukung atau resolusi terlalu rendah. Mohon verifikasi secara manual.",
      };
    }
  }
);
