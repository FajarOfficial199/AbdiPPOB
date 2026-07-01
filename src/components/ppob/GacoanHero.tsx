
"use client"
import { Smartphone, ShieldCheck, Zap } from 'lucide-react';

export function GacoanHero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 bg-slate-50">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest animate-pulse">
            <Zap size={14} /> Affiliate Promo: Rp 800 per Undangan Aktif!
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.1]">
            TOKO PPOB <br />
            <span className="text-primary">ABDI PRATAMA</span>
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
            Solusi termudah untuk isi pulsa, token listrik, dan top-up game. <br className="hidden md:block" />
            Tanpa ribet daftar, proses instan 24 jam nonstop!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
             <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-white px-4 py-2 rounded-xl shadow-sm">
                <ShieldCheck size={14} className="text-emerald-500" /> TERVERIFIKASI
             </div>
             <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-white px-4 py-2 rounded-xl shadow-sm">
                <Smartphone size={14} className="text-blue-500" /> MOBILE READY
             </div>
          </div>
        </div>
      </div>
      
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10" />
    </section>
  );
}
