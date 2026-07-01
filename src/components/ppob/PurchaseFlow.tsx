
"use client"
import React, { useState, useRef, useEffect } from 'react';
import { 
  Smartphone, Zap, Gamepad2, Wallet, User, 
  Loader2, CheckCircle2, Printer, 
  ChevronRight, Star, Image as ImageIcon, Upload, X
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

const CATEGORIES = [
  { id: 'pulsa', label: 'PULSA', icon: <Smartphone size={20} /> },
  { id: 'pln', label: 'TOKEN PLN', icon: <Zap size={20} /> },
  { id: 'game', label: 'TOPUP GAME', icon: <Gamepad2 size={20} /> },
  { id: 'ewallet', label: 'E-WALLET', icon: <Wallet size={20} /> },
];

const PRODUCTS = [
  { id: 'P1', label: '1K', price: 2200, originalPrice: 3000 },
  { id: 'P5', label: '5K', price: 6500, originalPrice: 7500 },
  { id: 'P10', label: '10K', price: 11500, originalPrice: 12500 },
  { id: 'P20', label: '20K', price: 21200, originalPrice: 22500 },
  { id: 'P50', label: '50K', price: 50800, originalPrice: 52000 },
  { id: 'P100', label: '100K', price: 100500, originalPrice: 102000 },
  { id: 'P200', label: '200K', price: 200500, originalPrice: 205000 },
  { id: 'P500', label: '500K', price: 500500, originalPrice: 510000 },
  { id: 'P1M', label: '1JT', price: 1000500, originalPrice: 1015000 },
];

export function PurchaseFlow() {
  const [target, setTarget] = useState('');
  const [category, setCategory] = useState('pulsa');
  const [product, setProduct] = useState<any>(null);
  const [spiceLevel, setSpiceLevel] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS'>('IDLE');
  const [uploadingProof, setUploadingProof] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleProcessOrder = () => {
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      setShowQR(true);
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingProof(true);
    setTimeout(() => {
      setUploadingProof(false);
      setStatus('SUCCESS');
      toast({
        title: "Bukti Terkirim",
        description: "Admin kami akan segera memverifikasi pembayaran Anda secara manual.",
      });
    }, 2500);
  };

  const totalAmount = (product?.price || 0) + (spiceLevel * 800);

  return (
    <section className="container mx-auto px-4 -mt-16 relative z-20">
      <Card className="rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden ring-1 ring-slate-100">
        <div className="grid md:grid-cols-3">
          <div className="p-8 bg-slate-50/50 space-y-8 border-r">
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">01. PILIH KATEGORI</label>
              <div className="grid grid-cols-1 gap-2.5">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl font-bold text-sm transition-all border group",
                      category === cat.id ? "bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-[1.02]" : "bg-white border-slate-100 text-slate-500 hover:border-primary/30"
                    )}
                  >
                    <span className="flex items-center gap-3">{cat.icon} {cat.label}</span>
                    <ChevronRight size={14} className={cn("transition-transform", category === cat.id ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0")} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">02. TUJUAN / ID</label>
              <div className="relative">
                <Input 
                  placeholder="0812xxxx atau ID Player" 
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="h-14 rounded-2xl bg-white font-bold text-lg border-slate-200 focus:ring-primary/20 shadow-sm"
                />
                <User className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20" />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 p-8 space-y-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black tracking-tight">Pilih Paket {category.toUpperCase()}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Stok Tersedia • Proses Instan</p>
              </div>
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-none font-bold px-4 py-1.5 rounded-full">HARGA TERMURAH</Badge>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
              {PRODUCTS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setProduct(p)}
                  className={cn(
                    "group relative p-6 rounded-[2rem] border-2 transition-all text-left flex flex-col justify-between h-40",
                    product?.id === p.id ? "bg-primary/5 border-primary shadow-xl shadow-primary/10 ring-4 ring-primary/5" : "bg-white border-slate-100 hover:border-slate-300"
                  )}
                >
                  <div className="text-2xl font-black">{p.label}</div>
                  <div>
                    <div className="text-[10px] line-through text-slate-400 font-bold">Rp {p.originalPrice.toLocaleString()}</div>
                    <div className="text-xl font-black text-primary">Rp {p.price.toLocaleString()}</div>
                  </div>
                  {product?.id === p.id && <div className="absolute top-4 right-4 text-primary"><CheckCircle2 size={24} /></div>}
                </button>
              ))}
            </div>

            <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white space-y-8 shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">LEVEL KEPEDASAN (KOMISI AFFILIATE)</label>
                  <div className="flex gap-2.5">
                    {[0, 1, 2, 3, 4, 5].map(lvl => (
                      <button
                        key={lvl}
                        onClick={() => setSpiceLevel(lvl)}
                        className={cn(
                          "w-12 h-12 rounded-xl font-bold text-sm transition-all border-2",
                          spiceLevel === lvl ? "bg-primary border-primary text-white scale-110 shadow-lg" : "bg-white/10 border-white/10 text-white/40 hover:bg-white/20"
                        )}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                  <p className="text-[9px] font-bold text-white/30 italic uppercase tracking-widest">+Rp 800 komisi / level</p>
                </div>
                
                <div className="text-right">
                  <p className="text-[10px] font-bold text-white/50 mb-1 tracking-[0.2em] uppercase">Total Tagihan</p>
                  <p className="text-5xl font-black text-primary drop-shadow-lg">
                    Rp {totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              <Button 
                disabled={!product || !target || isPending}
                onClick={handleProcessOrder}
                className="w-full h-18 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-xl shadow-2xl shadow-primary/40 transition-all active:scale-[0.98] border-none"
              >
                {isPending ? <Loader2 className="animate-spin" /> : "BAYAR SEKARANG"}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="max-w-md p-0 rounded-[3rem] overflow-hidden bg-white border-none shadow-2xl focus:outline-none">
          <DialogHeader className="bg-primary p-10 text-center text-white space-y-2 relative">
            <button onClick={() => setShowQR(false)} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
              <X size={24} />
            </button>
            <DialogTitle className="text-2xl font-black tracking-tight uppercase">Metode QRIS</DialogTitle>
            <DialogDescription className="text-xs font-bold text-white/70">Scan QRIS & Unggah Screenshot Bukti Bayar</DialogDescription>
          </DialogHeader>
          
          <div className="p-10 flex flex-col items-center space-y-8">
            <div className="relative w-64 h-64 bg-slate-50 border-8 border-slate-50 rounded-[2rem] p-6 overflow-hidden shadow-inner">
              <Image 
                src="https://i.imgur.com/IvVcoBz.png" 
                alt="QRIS Code" 
                fill 
                className="object-contain"
              />
            </div>
            
            <div className="w-full bg-slate-50 p-6 rounded-2xl text-center border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">TOTAL BAYAR</p>
              <p className="text-4xl font-black text-primary">Rp {totalAmount.toLocaleString()}</p>
            </div>

            <div className="space-y-4 w-full">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept="image/*"
              />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingProof}
                className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-sm gap-3 shadow-xl transition-all"
              >
                {uploadingProof ? <Loader2 className="animate-spin" /> : <Upload size={20} />}
                UNGGAH DARI GALERI
              </Button>
              <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">Screenshot bukti transfer wajib diunggah</p>
            </div>
          </div>

          {status === 'SUCCESS' && (
            <div className="absolute inset-0 bg-emerald-500 z-[100] flex flex-col items-center justify-center p-12 text-white animate-in zoom-in-95 duration-500">
               <div className="bg-white/20 p-8 rounded-full mb-8 shadow-2xl animate-bounce">
                  <CheckCircle2 size={80} className="text-white" />
               </div>
               <h2 className="text-4xl font-black text-center mb-4 leading-tight">SUKSES TERKIRIM!</h2>
               <p className="text-center font-bold text-white/80 mb-12 uppercase tracking-widest text-sm">Sedang Diverifikasi Admin Manual</p>
               <Button 
                onClick={() => window.location.reload()}
                className="w-full h-18 rounded-2xl bg-white text-emerald-600 font-black text-lg shadow-2xl border-none"
               >
                 <Printer className="mr-3" size={24} /> CETAK STRUK
               </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
