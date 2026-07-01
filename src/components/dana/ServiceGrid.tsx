
"use client"
import React, { useState } from 'react';
import { 
  Smartphone, Zap, Gamepad2, Wallet, 
  Tv, Globe, HeartPulse, Receipt, 
  Droplets, CreditCard, Ticket, PhoneCall,
  ChevronRight, Sparkles, Landmark, Building2,
  TrainFront, Plane, MonitorPlay, ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PurchaseFlow } from './PurchaseFlow';

const SERVICES = [
  { id: 'pulsa', label: 'Pulsa', icon: <Smartphone />, color: 'bg-[#ED1C24]' },
  { id: 'data', label: 'Paket Data', icon: <Globe />, color: 'bg-[#0055AA]' },
  { id: 'pln', label: 'Token PLN', icon: <Zap />, color: 'bg-[#FBC02D]' },
  { id: 'pln_tagihan', label: 'Tagihan PLN', icon: <Receipt />, color: 'bg-[#FBC02D]' },
  { id: 'game', label: 'Top Up Game', icon: <Gamepad2 />, color: 'bg-[#7B1FA2]' },
  { id: 'ewallet', label: 'E-Wallet', icon: <Wallet />, color: 'bg-[#00BFA5]' },
  { id: 'pdam', label: 'PDAM', icon: <Droplets />, color: 'bg-[#03A9F4]' },
  { id: 'bpjs', label: 'BPJS', icon: <HeartPulse />, color: 'bg-[#2E7D32]' },
  { id: 'internet', label: 'Internet/TV', icon: <Tv />, color: 'bg-[#E91E63]' },
  { id: 'cicilan', label: 'Multi Finance', icon: <CreditCard />, color: 'bg-[#FF5722]' },
  { id: 'pbb', label: 'PBB', icon: <Building2 />, color: 'bg-[#607D8B]' },
  { id: 'telkom', label: 'Telkom', icon: <PhoneCall />, color: 'bg-[#D32F2F]' },
  { id: 'voucher', label: 'Voucher', icon: <Ticket />, color: 'bg-[#FF4081]' },
  { id: 'gas', label: 'PGN Gas', icon: <Zap />, color: 'bg-[#FB8C00]' },
];

export function ServiceGrid() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-black flex items-center gap-3 text-white uppercase tracking-tighter">
            <Sparkles className="text-primary animate-pulse" size={24} /> LAYANAN DIGITAL LENGKAP
          </h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">TRANSAKSI INSTAN SEPERTI FASTPAY</p>
        </div>
        <button className="h-10 px-6 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-primary uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
          Lihat Semua
        </button>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-6">
        {SERVICES.map((service) => (
          <button
            key={service.id}
            onClick={() => setSelectedService(service.id)}
            className="group flex flex-col items-center gap-4 p-4 rounded-[2rem] hover:bg-white/[0.03] border border-transparent hover:border-white/10 transition-all duration-500"
          >
            <div className={cn(
              "w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
              service.color
            )}>
              {React.cloneElement(service.icon as React.ReactElement, { size: 32 })}
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center group-hover:text-white transition-colors">
              {service.label}
            </span>
          </button>
        ))}
      </div>

      {selectedService && (
        <PurchaseFlow 
          category={selectedService} 
          onClose={() => setSelectedService(null)} 
        />
      )}
    </div>
  );
}
