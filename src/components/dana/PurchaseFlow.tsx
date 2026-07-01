"use client"
import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Check, Loader2, Smartphone, 
  ArrowRight, QrCode, Upload, ShieldCheck, 
  UserCheck, ImageIcon, TicketPercent, Wallet,
  Gamepad2, Zap, Globe, Receipt, CreditCard,
  PhoneCall, Tv, HeartPulse, Droplets, Monitor,
  Gamepad, ShoppingBag, Coins, TrendingUp, CheckCircle2, Printer,
  Banknote, AlertCircle, Building2, Landmark, Search, Cpu, Server,
  ZapIcon, Tag, Sparkles
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { checkCustomerName } from '@/ai/flows/customer-inquiry';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

const GAME_LIST = [
  { id: 'ml', name: 'Mobile Legends', hint: 'User ID + Zone ID', icon: <Gamepad2 />, color: 'bg-[#2196F3]' },
  { id: 'ff', name: 'Free Fire', hint: 'Player ID', icon: <Zap />, color: 'bg-[#FF5722]' },
  { id: 'pubg', name: 'PUBG Mobile', hint: 'Character ID', icon: <Smartphone />, color: 'bg-[#FBC02D]' },
  { id: 'genshin', name: 'Genshin Impact', hint: 'UID + Server', icon: <Globe />, color: 'bg-[#00BFA5]' },
  { id: 'valorant', name: 'Valorant', hint: 'Riot ID + Tag', icon: <Gamepad2 />, color: 'bg-[#FF4655]' },
];

const OPERATORS = [
  { id: 'tsel', name: 'Telkomsel', hint: 'Nomor Telkomsel', icon: <PhoneCall />, color: 'bg-[#ED1C24]' },
  { id: 'isat', name: 'Indosat Ooredoo', hint: 'Nomor Indosat', icon: <Globe />, color: 'bg-[#FFCC00]' },
  { id: 'xl', name: 'XL Axiata', hint: 'Nomor XL', icon: <Globe />, color: 'bg-[#0055AA]' },
  { id: 'smart', name: 'Smartfren', hint: 'Nomor Smartfren', icon: <Zap />, color: 'bg-[#E91E63]' },
];

const EWALLET_LIST = [
  { id: 'dana', name: 'DANA', hint: 'Nomor Akun DANA', icon: <Wallet />, color: 'bg-[#0055FF]' },
  { id: 'ovo', name: 'OVO', hint: 'Nomor Akun OVO', icon: <Wallet />, color: 'bg-[#4C2A86]' },
  { id: 'gopay', name: 'GoPay', hint: 'Nomor Akun GoPay', icon: <Wallet />, color: 'bg-[#00AA13]' },
  { id: 'shopee', name: 'ShopeePay', hint: 'Nomor Akun Shopee', icon: <ShoppingBag />, color: 'bg-[#EE4D2D]' },
];

const PDAM_REGIONS = [
  { id: 'sby', name: 'PDAM Kota Surabaya', color: 'bg-blue-600' },
  { id: 'jkt', name: 'PAM JAYA DKI Jakarta', color: 'bg-blue-500' },
  { id: 'bdg', name: 'PDAM Tirtawening Bandung', color: 'bg-blue-700' },
  { id: 'smg', name: 'PDAM Kota Semarang', color: 'bg-blue-800' },
];

const FINANCE_LIST = [
  { id: 'adira', name: 'ADIRA Finance', color: 'bg-yellow-500' },
  { id: 'fif', name: 'FIF Group', color: 'bg-blue-900' },
  { id: 'baf', name: 'BAF Finance', color: 'bg-blue-400' },
  { id: 'wom', name: 'WOM Finance', color: 'bg-blue-300' },
];

const RAW_PRODUCTS = [
  { id: 'P1', label: '1.000', basePrice: 1050, points: 5, code: 'prod-1k' },
  { id: 'P5', label: '5.000', basePrice: 5100, points: 25, code: 'prod-5k' },
  { id: 'P10', label: '10.000', basePrice: 10100, points: 50, code: 'prod-10k' },
  { id: 'P20', label: '20.000', basePrice: 20050, points: 100, code: 'prod-20k' },
  { id: 'P50', label: '50.000', basePrice: 50050, points: 250, code: 'prod-50k' },
  { id: 'P100', label: '100.000', basePrice: 100050, points: 500, code: 'prod-100k' },
];

export function PurchaseFlow({ category, onClose }: { category: string, onClose: () => void }) {
  const isPostpaid = ['pln_tagihan', 'pdam', 'bpjs', 'internet', 'cicilan', 'telkom', 'pbb', 'gas'].includes(category);
  const needsProviderSelection = ['game', 'data', 'ewallet', 'pulsa', 'pdam', 'cicilan'].includes(category);
  
  const [step, setStep] = useState(needsProviderSelection ? 0 : 1);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [target, setTarget] = useState('');
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [loadingName, setLoadingName] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'SALDO' | null>(null);
  const [billAmount, setBillAmount] = useState<number>(0);
  
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDelivering, setIsDelivering] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState<{sn: string, orderId: string, timestamp: Date} | null>(null);
  const [userRole, setUserRole] = useState('GUEST');
  const [margins, setMargins] = useState({ admin: 2000, reseller: 500 });
  const [userBalance, setUserBalance] = useState(2450000);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const role = localStorage.getItem('user_role') || 'GUEST';
    const savedAdminMargin = parseInt(localStorage.getItem('admin_margin') || '2000');
    const savedResellerMargin = parseInt(localStorage.getItem('reseller_margin') || '500');
    setUserRole(role);
    setMargins({ admin: savedAdminMargin, reseller: savedResellerMargin });
  }, []);

  useEffect(() => {
    if (target.length >= 8) {
      const timer = setTimeout(() => handleCheckName(), 500);
      return () => clearTimeout(timer);
    } else {
      setCustomerName(null);
    }
  }, [target]);

  const handleCheckName = async () => {
    setLoadingName(true);
    try {
      const res = await checkCustomerName({ targetNumber: target, serviceType: category });
      setCustomerName(res.customerName);
      if (isPostpaid) {
        setBillAmount(Math.floor(Math.random() * (500000 - 50000) + 50000));
      }
    } catch (e) {
      console.error("Error checking account:", e);
      setCustomerName(null);
    } finally {
      setLoadingName(false);
    }
  };

  const handleNext = () => {
    if (step === 0 && selectedProvider) {
      setStep(1);
    } else if (step === 1 && target.length >= 5) {
      if (isPostpaid) {
        const margin = userRole === 'RESELLER' ? margins.reseller : margins.admin;
        setSelectedProduct({ 
          id: 'BILL', 
          label: 'Tagihan Anda', 
          displayPrice: billAmount + margin,
          code: 'bill-pay'
        });
        setStep(3);
      } else {
        setStep(2);
      }
    } else if (step === 2 && selectedProduct) {
      setStep(3);
    }
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setIsValidatingPromo(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const validCodes: Record<string, number> = { 'ABDI2025': 2000, 'HEMAT': 1000, 'PROMO': 500, 'MASTER': 2500 };
    const code = promoCode.toUpperCase();
    if (validCodes[code]) {
      setAppliedDiscount(validCodes[code]);
      toast({ title: "Promo Berhasil", description: `Diskon Rp ${validCodes[code].toLocaleString()} dipasang.` });
    } else {
      setAppliedDiscount(0);
      toast({ variant: "destructive", title: "Gagal", description: "Kode tidak valid." });
    }
    setIsValidatingPromo(false);
  };

  const finalTotalAmount = Math.max(0, (selectedProduct?.displayPrice || 0) - appliedDiscount);

  const handleSelectPayment = (method: 'QRIS' | 'SALDO') => {
    if (method === 'SALDO' && userBalance < finalTotalAmount) {
      toast({ variant: "destructive", title: "Saldo Kurang", description: "Saldo sistem tidak mencukupi." });
      return;
    }
    setPaymentMethod(method);
    if (method === 'SALDO') {
      processSaldoPayment(finalTotalAmount);
    } else {
      setStep(4);
    }
  };

  const processSaldoPayment = async (finalPrice: number) => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsProcessing(false);
    setUserBalance(prev => prev - finalPrice);
    startDelivery();
  };

  const startDelivery = async () => {
    setIsDelivering(true);
    const orderId = `AP-${Date.now()}`;
    const timestamp = new Date();
    try {
      const response = await fetch('/api/place-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetNumber: target, productCode: selectedProduct?.code || 'PPOB-BILL', orderId: orderId })
      });
      const data = await response.json();
      if (data.success) {
        setDeliveryResult({ sn: data.sn, orderId: orderId, timestamp: timestamp });
        setStep(5);
        toast({ title: "Sukses", description: `Pesanan ${orderId} berhasil.` });
      } else {
        toast({ variant: "destructive", title: "Gagal", description: data.message });
      }
    } catch (err) {
      console.error("Error processing order:", err);
      toast({ variant: "destructive", title: "Error", description: "Gagal menghubungkan ke gateway." });
    } finally {
      setIsDelivering(false);
    }
  };

  const productsToDisplay = RAW_PRODUCTS.map(p => {
    const margin = userRole === 'RESELLER' ? margins.reseller : margins.admin;
    return { ...p, displayPrice: p.basePrice + margin, isReseller: userRole === 'RESELLER' };
  });

  function getStepZeroList() {
    switch (category) {
      case 'game': return GAME_LIST;
      case 'data': 
      case 'pulsa': return OPERATORS;
      case 'ewallet': return EWALLET_LIST;
      case 'pdam': return PDAM_REGIONS;
      case 'cicilan': return FINANCE_LIST;
      default: return [];
    }
  }

  const currentList = getStepZeroList();

  return (
    <>
      <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-xl p-0 overflow-hidden bg-[#0F1115] border-white/5 rounded-[2rem] shadow-2xl focus:outline-none animate-in zoom-in-95 duration-500">
          <DialogHeader className={cn("p-8 text-white relative overflow-hidden transition-all", selectedProvider?.color || "bg-primary")}>
            <div className="flex items-center justify-between relative z-10 w-full">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-3xl shadow-xl">
                  {category === 'game' ? <Gamepad2 size={28} /> : 
                   category === 'data' ? <Globe size={28} /> :
                   category === 'pulsa' ? <Smartphone size={28} /> : 
                   category === 'pdam' ? <Droplets size={28} /> :
                   category === 'cicilan' ? <CreditCard size={28} /> : <Zap size={28} />}
                </div>
                <div>
                  <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic">
                    {selectedProvider ? selectedProvider.name : category.replace('_', ' ').toUpperCase()}
                  </DialogTitle>
                  <p className="text-[8px] font-black opacity-60 uppercase tracking-widest mt-1">
                    {userRole === 'RESELLER' ? "Reseller Protocol Active" : "Public Sale Endpoint"}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-2.5 rounded-xl transition-all">
                <X size={24} />
              </button>
            </div>
          </DialogHeader>

          <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar bg-black/40">
            {step === 0 && needsProviderSelection && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Select Provider Node</label>
                <div className="grid grid-cols-2 gap-4">
                  {currentList.map((item: any) => (
                    <button
                      key={item.id}
                      onClick={() => { setSelectedProvider(item); setStep(1); }}
                      className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary/50 hover:bg-white/[0.06] transition-all flex items-center gap-4 group"
                    >
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg", item.color)}>
                        {item.icon ? React.cloneElement(item.icon as React.ReactElement, { size: 20 }) : <ShieldCheck size={20}/>}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/70 group-hover:text-white">{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center block">Target Endpoint ID</label>
                  <div className="relative group">
                    <Input 
                      value={target} 
                      onChange={(e) => setTarget(e.target.value)} 
                      placeholder="Destination ID..." 
                      className="h-20 rounded-2xl bg-white/[0.03] border-white/5 text-2xl font-black text-white focus:ring-4 focus:ring-primary/10 transition-all px-8 text-center" 
                    />
                    {loadingName && (
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-xl border border-primary/30 animate-pulse">
                        <Loader2 className="animate-spin text-primary" size={14} />
                        <span className="text-[8px] font-black text-primary uppercase">VERIFYING...</span>
                      </div>
                    )}
                    {customerName && !loadingName && (
                      <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shadow-xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white"><UserCheck size={20} /></div>
                           <div className="text-left">
                              <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">DETECTED NAME</p>
                              <p className="text-lg font-black text-white italic tracking-tight">{customerName}</p>
                           </div>
                        </div>
                        <div className="bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                           <ShieldCheck size={12} className="text-emerald-400" />
                           <span className="text-[7px] font-black text-emerald-400 uppercase">VERIFIED</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <Button onClick={handleNext} disabled={target.length < 5 || loadingName} className={cn("w-full h-16 rounded-2xl text-white font-black text-sm uppercase tracking-widest gap-3 shadow-xl", selectedProvider?.color || "bg-primary")}>
                  {isPostpaid ? "INQUIRY DATA" : "CONFIGURE PAYLOAD"} <ArrowRight size={20} />
                </Button>
              </div>
            )}

            {step === 2 && !isPostpaid && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-2 gap-4">
                  {productsToDisplay.map(p => (
                    <button key={p.id} onClick={() => setSelectedProduct(p)} className={cn("p-6 rounded-2xl border-2 transition-all text-left flex flex-col justify-between h-40 relative group overflow-hidden", selectedProduct?.id === p.id ? "bg-primary/10 border-primary shadow-xl" : "bg-white/[0.03] border-white/5 hover:border-white/20")}>
                      <div className="space-y-1">
                        <div className="text-2xl font-black text-white tracking-tighter italic">{p.label}</div>
                        {userRole === 'RESELLER' && <Badge className="bg-emerald-500 text-white font-black text-[7px] uppercase tracking-widest px-1.5 py-0.5">Master</Badge>}
                      </div>
                      <div>
                        <div className="text-[9px] line-through text-slate-500 font-bold mb-0.5">Rp {(p.basePrice + margins.admin).toLocaleString()}</div>
                        <div className="text-lg font-black text-primary">Rp {p.displayPrice.toLocaleString()}</div>
                      </div>
                      {selectedProduct?.id === p.id && <div className="absolute top-4 right-4 text-primary"><CheckCircle2 size={24} /></div>}
                    </button>
                  ))}
                </div>
                <Button onClick={handleNext} disabled={!selectedProduct} className={cn("w-full h-16 rounded-2xl text-white font-black text-sm uppercase tracking-widest shadow-xl", selectedProvider?.color || "bg-primary")}>
                  EXECUTE ORDER
                </Button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white/[0.02] p-6 rounded-[2rem] border border-white/5 space-y-6 shadow-inner relative overflow-hidden">
                  <div className="text-center space-y-1 relative z-10">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Order Summary Digest</p>
                    <h4 className="text-2xl font-black text-white uppercase italic">{isPostpaid ? category.toUpperCase() : `NODE: ${selectedProduct?.label}`}</h4>
                  </div>
                  <div className="space-y-4 relative z-10 px-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest"><span className="text-slate-500">Entity</span><span className="text-white">{customerName || 'UNKNOWN'}</span></div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest"><span className="text-slate-500">Endpoint</span><span className="text-white">{target}</span></div>
                    
                    <div className="pt-3 border-t border-white/5 space-y-3">
                       <label className="text-[9px] font-black text-primary uppercase tracking-widest ml-1">Have a Voucher?</label>
                       <div className="flex gap-2">
                          <Input 
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            placeholder="Enter Code..." 
                            className="h-11 px-4 rounded-xl bg-white/5 border-white/10 font-bold text-white uppercase text-xs"
                          />
                          <Button onClick={handleApplyPromo} disabled={isValidatingPromo || !promoCode} className="h-11 px-5 rounded-xl bg-white text-black font-black uppercase text-[9px]">
                             {isValidatingPromo ? <Loader2 className="animate-spin" /> : "APPLY"}
                          </Button>
                       </div>
                    </div>

                    <div className="flex justify-between text-xs font-black border-t border-white/5 pt-6">
                      <span className="text-slate-500 uppercase tracking-widest">Final Total</span>
                      <div className="text-right">
                         <span className="text-3xl font-black text-primary italic">Rp {finalTotalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Gateway Transmission</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => handleSelectPayment('SALDO')} className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-4 group">
                      <div className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center"><Wallet size={20}/></div>
                      <div className="text-left"><p className="text-[10px] font-black text-white uppercase">Balance</p><p className="text-[7px] text-primary font-bold uppercase mt-0.5">SECURE_SYNC</p></div>
                    </button>
                    <button onClick={() => handleSelectPayment('QRIS')} className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-emerald-500 hover:bg-emerald-500/5 transition-all flex items-center gap-4 group">
                      <div className="w-10 h-10 bg-emerald-500/20 text-emerald-500 rounded-xl flex items-center justify-center"><QrCode size={20}/></div>
                      <div className="text-left"><p className="text-[10px] font-black text-white uppercase">QRIS</p><p className="text-[7px] text-emerald-500 font-bold uppercase mt-0.5">INSTANT_SYNC</p></div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center space-y-8 animate-in zoom-in-95 duration-500">
                <div className="bg-white p-6 rounded-[2.5rem] mx-auto w-fit shadow-xl group transition-all">
                   <div className="relative w-48 h-48">
                     <Image src="https://i.imgur.com/IvVcoBz.png" alt="QR" fill className="object-contain" />
                   </div>
                </div>
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Transmission Payload</p>
                   <p className="text-4xl font-black text-white italic">Rp {finalTotalAmount.toLocaleString()}</p>
                </div>
                <div className="space-y-4">
                  <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={() => startDelivery()} />
                  <Button onClick={() => fileInputRef.current?.click()} className="w-full h-16 rounded-2xl bg-white text-slate-950 font-black uppercase tracking-widest text-[10px] shadow-xl flex items-center justify-center gap-3">
                    <Upload size={18} /> UPLOAD & SYNC
                  </Button>
                </div>
              </div>
            )}

            {step === 5 && deliveryResult && (
              <div className="flex flex-col items-center gap-8 py-8 animate-in zoom-in-95 duration-700">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 animate-bounce border border-emerald-500/30 shadow-lg">
                    <CheckCircle2 size={48} />
                </div>
                <div className="space-y-2 text-center">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Mission Done</h3>
                    <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">TRANSACTION SYNCED SUCCESS</p>
                </div>
                
                <div className="w-full grid grid-cols-2 gap-4">
                  <Button onClick={() => window.print()} className="h-14 rounded-xl bg-white text-slate-950 font-black uppercase tracking-widest gap-2 shadow-lg text-[10px]">
                    <Printer size={18} /> PRINT STRUK
                  </Button>
                  <Button onClick={onClose} className="h-14 rounded-xl bg-primary font-black uppercase tracking-widest text-white shadow-lg text-[10px]">
                    TERMINATE
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {(isProcessing || isDelivering) && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-[200] flex flex-col items-center justify-center p-8">
               <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Cpu size={24} className="text-primary animate-pulse" />
                  </div>
               </div>
               <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">Processing...</h4>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
