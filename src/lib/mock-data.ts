
import { Product, Transaction } from './types';

export const PRODUCTS: Product[] = [
  // --- PULSA ---
  { id: 'tsel-1', categoryId: 'pulsa', provider: 'Telkomsel', name: 'Pulsa 1.000', price: 2500, description: 'Pulsa Reguler 1rb', isActive: true },
  { id: 'tsel-5', categoryId: 'pulsa', provider: 'Telkomsel', name: 'Pulsa 5.000', price: 6500, description: 'Pulsa Reguler 5rb', isActive: true },
  { id: 'tsel-10', categoryId: 'pulsa', provider: 'Telkomsel', name: 'Pulsa 10.000', price: 11500, description: 'Pulsa Reguler 10rb', isActive: true },
  
  // --- PAKET DATA ---
  { id: 'data-cheap', categoryId: 'data', provider: 'Promo', name: 'Internet 500MB', price: 5000, description: 'Masa aktif 1 hari', isActive: true },
  { id: 'tsel-data-1', categoryId: 'data', provider: 'Telkomsel', name: 'Internet 1GB', price: 15000, description: 'Paket Data 1GB 30 Hari', isActive: true },

  // --- TOKEN PLN ---
  { id: 'pln-20', categoryId: 'pln', provider: 'PLN', name: 'Token PLN 20.000', price: 21500, description: 'Token Listrik Prabayar', isActive: true },
  { id: 'pln-50', categoryId: 'pln', provider: 'PLN', name: 'Token PLN 50.000', price: 51500, description: 'Token Listrik Prabayar', isActive: true },

  // --- TOP UP GAMES ---
  { id: 'ml-86', categoryId: 'game_topup', provider: 'Mobile Legends', name: '86 Diamonds', price: 22000, description: 'Top Up ML Instan', isActive: true },
  
  // --- E-WALLET ---
  { id: 'dana-10', categoryId: 'ewallet', provider: 'DANA', name: 'Saldo DANA 10.000', price: 12000, description: 'Top Up Saldo DANA', isActive: true },
  { id: 'dana-50', categoryId: 'ewallet', provider: 'DANA', name: 'Saldo DANA 50.000', price: 52000, description: 'Top Up Saldo DANA', isActive: true },
];

export const CATEGORIES = [
  { id: 'pulsa', label: 'Pulsa', icon: 'Smartphone' },
  { id: 'data', label: 'Paket Data', icon: 'Globe' },
  { id: 'pln', label: 'Token PLN', icon: 'Zap' },
  { id: 'pln_tagihan', label: 'Tagihan PLN', icon: 'Receipt' },
  { id: 'ewallet', label: 'E-Wallet', icon: 'Wallet' },
  { id: 'game_topup', label: 'Top Up Game', icon: 'Gamepad2' },
  { id: 'pdam', label: 'PDAM', icon: 'Droplets' },
  { id: 'bpjs', label: 'BPJS', icon: 'HeartPulse' },
  { id: 'internet', label: 'Internet & TV', icon: 'Tv' },
  { id: 'cicilan', label: 'Multi Finance', icon: 'CreditCard' },
  { id: 'telkom', label: 'Telkom', icon: 'PhoneCall' },
  { id: 'pbb', label: 'PBB', icon: 'Building2' },
];

export const RECENT_TRANSACTIONS: Transaction[] = [
  { id: 'AP-X102', customerNumber: '0812***89', productName: 'Pulsa 10.000', amount: 11500, status: 'APPROVED', createdAt: new Date(Date.now() - 1000 * 60 * 5), updatedAt: new Date() },
  { id: 'AP-X103', customerNumber: '0857***21', productName: 'Token PLN 50.000', amount: 51500, status: 'WAITING_VERIFICATION', createdAt: new Date(Date.now() - 1000 * 60 * 12), updatedAt: new Date() },
  { id: 'AP-X105', customerNumber: '0831***28', productName: 'Saldo DANA 100.000', amount: 101800, status: 'APPROVED', createdAt: new Date(Date.now() - 1000 * 60 * 45), updatedAt: new Date() },
];
