
export type Category = 
  | 'pulsa' 
  | 'data' 
  | 'pln' 
  | 'pln_postpaid' 
  | 'ewallet' 
  | 'game_voucher' 
  | 'game_topup' 
  | 'bpjs' 
  | 'pdam' 
  | 'internet' 
  | 'multifinance';

export interface Product {
  id: string;
  categoryId: Category;
  name: string;
  provider: string;
  price: number;
  basePrice?: number; // Price from provider
  description: string;
  isActive: boolean;
}

export interface Transaction {
  id: string;
  customerNumber: string;
  productId: string;
  productName: string;
  amount: number;
  status: 'PENDING' | 'WAITING_VERIFICATION' | 'APPROVED' | 'REJECTED';
  deliveryStatus?: 'PENDING' | 'SUCCESS' | 'FAILED';
  paymentProofUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSession {
  role: 'GUEST' | 'RESELLER';
  points: number;
  referralCode: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  method: 'BANK' | 'EWALLET';
  destination: string; // Account Number
  destinationName: string; // Account Holder Name
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  createdAt: Date;
}
