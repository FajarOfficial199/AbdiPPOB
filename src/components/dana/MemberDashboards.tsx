"use client"
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, Users, Wallet, ArrowUpRight, 
  Banknote, History, Gift, Smartphone, 
  Zap, Globe, Share2, Copy, ShoppingBag,
  Sparkles, ShieldCheck, ChevronRight, TrendingDown,
  LineChart, MousePointerClick, RefreshCcw, CreditCard,
  GiftIcon, MessageCircle, AlertCircle, PlusCircle, QrCode, Upload, X,
  Coins, UserCheck, Tag
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function ResellerDashboard() {
  const [mounted, setMounted] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [resellerMargin, setResellerMargin] = useState(500);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    const savedMargin = parseInt(localStorage.getItem('reseller_margin') || '500');
    setResellerMargin(savedMargin);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Premium Header Hero - Medium Size */}
      <div className="relative overflow-hidden p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-primary/30 via-primary/5 to-transparent border border-white/10 shadow-xl group">
         <div className="absolute top-0 right-0 w-72 h-72 bg-primary/20 rounded-full blur-[100px] -z-10" />
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="bg-primary p-2.5 rounded-xl text-white shadow-xl">
                     <UserCheck size={24} />
                  </div>
                  <div className="flex flex-col">
                    <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-1 rounded-full font-black text-[9px] tracking-widest w-fit uppercase">STATUS: MASTER RESELLER</Badge>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1 flex items-center gap-2">
                      <ShieldCheck size={12} className="text-primary"/> HARGA MODAL AKTIF (+{resellerMargin})
                    </p>
                  </div>
               </div>
               <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight uppercase">WORKSPACE<br/><span className="text-primary">RESELLER</span></h2>
            </div>
            
            <div className="flex flex-col gap-3">
               <button 
                onClick={() => setShowDeposit(true)}
                className="glass-card p-0.5 rounded-[2rem] border-primary/30 hover:border-primary/60 transition-all active:scale-95 group/deposit relative"
               >
                  <div className="bg-gradient-to-br from-primary via-primary/80 to-blue-600 p-6 rounded-[1.8rem] flex items-center gap-4 shadow-2xl">
                     <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white transition-transform">
                        <PlusCircle size={28} />
                     </div>
                     <div className="text-left">
                        <p className="text-[9px] font-black text-white/60 uppercase tracking-widest">Quick Action</p>
                        <p className="text-xl font-black text-white uppercase tracking-tight">ISI SALDO AKUN</p>
                     </div>
                  </div>
               </button>
            </div>
         </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Info Pricing Tier */}
        <Card className="glass-card rounded-[2rem] border-none p-8 space-y-6 relative group overflow-hidden bg-white/[0.02]">
          <div className="space-y-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-2">
               <Tag size={24} />
            </div>
            <h4 className="text-xl font-black text-white tracking-tight uppercase">Master Pricing Tier</h4>
            <div className="space-y-2">
               <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">KONFIGURASI HARGA:</p>
               <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Margin</span>
                  <span className="text-lg font-black text-emerald-400">+Rp {resellerMargin.toLocaleString()}</span>
               </div>
               <p className="text-[8px] text-slate-600 font-bold italic uppercase mt-1">* Harga beranda otomatis terkonversi.</p>
            </div>
          </div>
        </Card>

        {/* Statistik Laba Estimasi */}
        <Card className="bg-white/[0.03] rounded-[2rem] border border-white/5 p-8 flex flex-col justify-between relative overflow-hidden group">
          <div className="space-y-2 relative z-10">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">SALDO AKTIF SAAT INI</p>
            <h3 className="text-4xl font-black text-white tracking-tighter">Rp 2.45M</h3>
          </div>
          <div className="flex items-center gap-3 mt-6 bg-emerald-500/10 w-fit px-5 py-2 rounded-xl border border-emerald-500/20 relative z-10">
            <Wallet size={16} className="text-emerald-400" />
            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">SIAP DIGUNAKAN</span>
          </div>
        </Card>

        {/* Ringkasan Poin */}
        <Card className="dana-gradient rounded-[2rem] border-none p-8 text-white shadow-xl flex flex-col justify-between group overflow-hidden">
           <div className="flex justify-between items-start relative z-10">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-xl border border-white/20 group-hover:scale-105 transition-transform">
                 <Coins size={24} />
              </div>
              <Badge className="bg-white/20 text-white border-none px-4 py-1 rounded-full font-black text-[8px] uppercase tracking-widest backdrop-blur-md">LOYALTY PTS</Badge>
           </div>
           <div className="relative z-10 mt-4">
              <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1">POIN REFRESH</p>
              <h3 className="text-3xl font-black tracking-tighter">4,820 <span className="text-xs font-bold opacity-50 tracking-normal ml-1">PTS</span></h3>
           </div>
        </Card>
      </div>

      <PointRedemptionSection />
      <DepositDialog open={showDeposit} onOpenChange={setShowDeposit} />
    </div>
  );
}

export function DepositDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleProcess = () => {
    if (!amount || parseInt(amount) < 10000) {
      toast({ variant: "destructive", title: "Gagal", description: "Minimal deposit adalah Rp 10.000" });
      return;
    }
    setStep(2);
  };

  const handleUpload = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(1);
      setAmount('');
      onOpenChange(false);
      toast({
        title: "Deposit Diproses",
        description: "Bukti bayar berhasil diunggah. Saldo akan bertambah setelah diverifikasi (1-5 menit).",
      });
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 bg-[#0A0A0B] border-white/10 rounded-[2rem] overflow-hidden focus:outline-none shadow-2xl">
        <div className="bg-primary p-6 text-white flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30">
                 <Banknote size={20} />
              </div>
              <div>
                 <DialogTitle className="font-black text-[10px] uppercase tracking-widest">DEPOSIT SALDO</DialogTitle>
                 <p className="text-[7px] opacity-70 font-bold uppercase tracking-widest mt-0.5">METODE: QRIS OTOMATIS</p>
              </div>
           </div>
           <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="text-white/50 hover:text-white"><X size={18}/></Button>
        </div>

        <div className="p-8 space-y-6 bg-white/[0.02]">
          {step === 1 ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-2.5">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">NOMINAL TOP UP (Rp)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-primary text-lg">Rp</span>
                  <Input 
                    type="number" 
                    placeholder="Min. 10,000" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-14 pl-14 rounded-xl bg-white/5 border-white/10 font-black text-xl text-white focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[50000, 100000, 500000, 1000000, 2000000, 5000000].map(val => (
                  <button 
                    key={val} 
                    onClick={() => setAmount(val.toString())}
                    className="py-2.5 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black text-slate-400 hover:border-primary hover:text-primary transition-all"
                  >
                    {val.toLocaleString()}
                  </button>
                ))}
              </div>
              <Button onClick={handleProcess} className="w-full h-14 rounded-xl bg-primary font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 text-xs">LANJUTKAN KE QRIS</Button>
            </div>
          ) : (
            <div className="text-center space-y-6 animate-in zoom-in-95">
               <div className="bg-white p-4 rounded-2xl mx-auto w-fit shadow-xl">
                  <div className="relative w-48 h-48">
                    <Image src="https://i.imgur.com/IvVcoBz.png" alt="QRIS" fill className="object-contain" />
                  </div>
               </div>
               <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
                  <p className="text-[8px] font-black text-primary uppercase tracking-widest mb-0.5">TOTAL BAYAR</p>
                  <p className="text-2xl font-black text-white">Rp {parseInt(amount).toLocaleString()}</p>
               </div>
               <div className="space-y-3">
                  <Button onClick={handleUpload} disabled={loading} className="w-full h-14 rounded-xl bg-white text-black font-black uppercase tracking-widest flex gap-2 items-center justify-center text-xs">
                    {loading ? <RefreshCcw className="animate-spin" /> : <><Upload size={18}/> UNGGAH BUKTI</>}
                  </Button>
                  <Button variant="ghost" onClick={() => setStep(1)} className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Ubah Nominal</Button>
               </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PointRedemptionSection() {
  const [showRedeemDialog, setShowRedeemDialog] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [targetNumber, setTargetNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const rewards = [
    { id: '1', title: "Saldo Toko Rp 50.000", cost: 5000, type: 'SALDO', icon: <Wallet/>, color: "text-emerald-400" },
    { id: '2', title: "Pulsa 20rb All Op", cost: 2200, type: 'PULSA', icon: <Smartphone/>, color: "text-blue-400" },
    { id: '3', title: "Data 10GB 30H", cost: 8500, type: 'DATA', icon: <Zap/>, color: "text-amber-400" },
    { id: '4', title: "Dana Rp 100rb", cost: 10500, type: 'E-WALLET', icon: <CreditCard/>, color: "text-cyan-400" },
  ];

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetNumber) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowRedeemDialog(false);
      toast({ title: "Penukaran Berhasil", description: `${selectedReward.title} diproses.` });
      setTargetNumber('');
    }, 2000);
  };

  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center gap-3">
         <div className="w-1 h-8 bg-primary rounded-full" />
         <h3 className="text-xl font-black text-white uppercase tracking-tight">KATALOG PENUKARAN POIN</h3>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
         {rewards.map((item) => (
           <Card key={item.id} className="glass-card rounded-3xl p-6 space-y-4 text-center hover:bg-white/[0.08] transition-all cursor-pointer group">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mx-auto transition-all bg-black/40", item.color)}>
                 {React.cloneElement(item.icon as React.ReactElement, { size: 24 })}
              </div>
              <div className="space-y-0.5">
                 <h4 className="font-black text-xs text-white leading-tight uppercase">{item.title}</h4>
                 <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">{item.cost.toLocaleString()} POIN</p>
              </div>
              <Button 
                size="sm"
                onClick={() => { setSelectedReward(item); setShowRedeemDialog(true); }}
                className="w-full rounded-xl h-10 text-[8px] font-black uppercase tracking-widest bg-white/5 border border-white/10 hover:bg-primary"
              >
                TUKAR
              </Button>
           </Card>
         ))}
      </div>

      <Dialog open={showRedeemDialog} onOpenChange={setShowRedeemDialog}>
        <DialogContent className="max-w-sm bg-[#0A0A0B] border-white/10 text-white rounded-[2rem] p-8 focus:outline-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tight text-center">KONFIRMASI</DialogTitle>
            <DialogDescription className="text-center text-slate-500 text-[8px] font-black uppercase tracking-widest mt-1">
              {selectedReward?.title}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRedeem} className="space-y-5 mt-6">
            <div className="p-5 rounded-xl bg-white/5 border border-white/10 text-center">
               <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">BIAYA POIN</p>
               <p className="text-2xl font-black text-primary">{selectedReward?.cost.toLocaleString()} <span className="text-xs">POIN</span></p>
            </div>

            <div className="space-y-2">
              <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">NOMOR TUJUAN</label>
              <Input 
                placeholder="0812xxx" 
                value={targetNumber}
                onChange={(e) => setTargetNumber(e.target.value)}
                className="h-12 rounded-xl bg-white/5 border-white/10 font-black text-sm text-white px-4 focus:ring-primary/20"
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={isProcessing}
              className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 font-black uppercase tracking-widest text-white text-[9px] shadow-lg shadow-primary/20"
            >
              {isProcessing ? <RefreshCcw className="animate-spin" /> : "PROSES SEKARANG"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function AffiliateDashboard() {
  const [mounted, setMounted] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const { toast } = useToast();
  const referralCode = "ABDI-VIP-2025";

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(referralCode);
      toast({ title: "Kode Tersalin", description: "Mulai raih komisi Rp 800!" });
    }
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseInt(amount) < 50000) {
       toast({ variant: "destructive", title: "Gagal", description: "Minimal penarikan adalah Rp 50.000." });
       return;
    }
    setLoading(true);
    setTimeout(() => {
       setLoading(false);
       toast({ title: "Berhasil", description: "Penarikan diproses (1-24 jam)." });
       setAmount('');
    }, 2000);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.02] p-6 rounded-[2rem] border border-white/5">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Panel Affiliate</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
            <Zap size={12} className="text-amber-500"/> KOMISI Rp 800 TIAP SALES
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <button 
            onClick={() => setShowDeposit(true)}
            className="flex items-center gap-3 bg-primary/10 border border-primary/20 p-3 rounded-2xl group hover:bg-primary/20 transition-all"
           >
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
                <PlusCircle size={20} />
              </div>
              <div className="text-left pr-2">
                <p className="text-[7px] font-black text-primary uppercase tracking-widest">Top Up</p>
                <p className="text-xs font-black text-white uppercase">ISI SALDO</p>
              </div>
           </button>

           <div className="bg-white/5 px-6 py-4 rounded-[1.5rem] border border-white/10 flex items-center gap-4 shadow-xl backdrop-blur-xl">
              <div className="flex flex-col">
                <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">REFERRAL CODE</span>
                <span className="text-xs font-black text-primary tracking-widest">{referralCode}</span>
              </div>
              <button onClick={handleCopy} className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all active:scale-90"><Copy size={16}/></button>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass-card rounded-[2.5rem] border-none p-10 bg-primary/10 relative overflow-hidden flex flex-col justify-center min-h-[220px] group shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -z-10" />
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">SALDO KOMISI AKTIF</p>
          <h3 className="text-6xl font-black text-white tracking-tighter">Rp 158.400</h3>
        </Card>
        <div className="grid grid-cols-2 gap-4">
            <Card className="rounded-[2rem] p-6 text-center space-y-2 flex flex-col justify-center bg-white/[0.02] border-white/5">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mx-auto text-primary"><MousePointerClick size={20}/></div>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">KLIK REFERRAL</p>
              <p className="text-4xl font-black text-white">1,204</p>
            </Card>
            <Card className="rounded-[2rem] p-6 text-center space-y-2 flex flex-col justify-center bg-white/[0.02] border-white/5">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mx-auto text-emerald-500"><LineChart size={20}/></div>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">SALES SUKSES</p>
              <p className="text-4xl font-black text-emerald-400">450</p>
            </Card>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl h-14 w-fit flex gap-1 backdrop-blur-md">
          <TabsTrigger value="overview" className="rounded-xl px-8 font-black text-[9px] uppercase tracking-widest h-full">PERFORMA</TabsTrigger>
          <TabsTrigger value="redeem" className="rounded-xl px-8 font-black text-[9px] uppercase tracking-widest h-full">TUKAR POIN</TabsTrigger>
          <TabsTrigger value="withdraw" className="rounded-xl px-8 font-black text-[9px] uppercase tracking-widest h-full">PENARIKAN</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
           <Card className="rounded-[2.5rem] p-10 border-none bg-white/[0.01] shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">ANALISA TREND 7 HARI</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" /><span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">KLIK</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" /><span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">SALES</span></div>
                </div>
              </div>
              <div className="h-56 flex items-end justify-between gap-4">
                 {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                   <div key={i} className="flex-1 bg-primary/10 rounded-xl transition-all duration-500 relative cursor-pointer border border-white/5" style={{ height: `${h}%` }}>
                      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-emerald-500/30 rounded-xl" />
                   </div>
                 ))}
              </div>
           </Card>
        </TabsContent>

        <TabsContent value="redeem">
           <PointRedemptionSection />
        </TabsContent>

        <TabsContent value="withdraw" className="max-w-2xl mx-auto">
           <Card className="rounded-[2.5rem] p-10 space-y-8 border-none bg-white/[0.02] shadow-2xl relative overflow-hidden">
              <div className="text-center space-y-2">
                 <h3 className="font-black text-2xl uppercase tracking-tighter text-white">PENARIKAN KOMISI</h3>
                 <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">MINIMAL: Rp 50.000</p>
              </div>
              <form onSubmit={handleWithdraw} className="space-y-6">
                 <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">NOMINAL (Rp)</label>
                    <div className="relative">
                       <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-primary text-xl">Rp</span>
                       <Input 
                          placeholder="0" 
                          type="number" 
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="pl-16 h-16 rounded-2xl bg-white/5 border-white/10 font-black text-2xl text-white focus:ring-4 focus:ring-primary/20 transition-all" 
                       />
                    </div>
                 </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">METODE</label>
                       <Select required>
                          <SelectTrigger className="h-14 rounded-xl bg-white/5 border-white/10 font-black text-[10px] text-white px-6">
                             <SelectValue placeholder="BANK / E-WALLET" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0A0A0B] border-white/10 text-white rounded-xl">
                             <SelectItem value="BCA" className="font-bold">BCA</SelectItem>
                             <SelectItem value="DANA" className="font-bold">DANA</SelectItem>
                             <SelectItem value="OVO" className="font-bold">OVO</SelectItem>
                             <SelectItem value="GOPAY" className="font-bold">GOPAY</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">NOMOR REKENING / HP</label>
                       <Input required placeholder="Tujuan" className="h-14 rounded-xl bg-white/5 border-white/10 font-black text-xs text-white px-6" />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">ATAS NAMA</label>
                    <Input required placeholder="Nama lengkap" className="h-14 rounded-xl bg-white/5 border-white/10 font-black text-xs text-white px-6" />
                 </div>
                 <Button type="submit" disabled={loading} className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 font-black uppercase tracking-widest shadow-xl text-xs border-none">
                    {loading ? <RefreshCcw className="animate-spin mr-2"/> : "PENCAIRAN DANA"}
                 </Button>
              </form>
           </Card>
        </TabsContent>
      </Tabs>
      <DepositDialog open={showDeposit} onOpenChange={setShowDeposit} />
    </div>
  );
}
