"use client"
import Link from 'next/link';
import { Smartphone, ShieldCheck, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-[100] w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto h-20 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20 group-hover:rotate-6 transition-transform">
            <Smartphone size={28} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tighter text-slate-900">ABDI PRATAMA</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">PPOB STORE</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="#promo" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-primary transition-colors">PROMO</Link>
          <Link href="#history" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-primary transition-colors">CEK STATUS</Link>
          <Link href="#faq" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-primary transition-colors">BANTUAN</Link>
          <div className="h-6 w-px bg-slate-100 mx-2" />
          <Link href="/admin/login">
            <Button variant="ghost" className="rounded-2xl h-12 px-6 border-2 border-slate-100 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all font-black text-[10px] uppercase tracking-[0.1em] gap-2">
              <ShieldCheck size={18} /> ADMIN PANEL
            </Button>
          </Link>
        </nav>

        <div className="md:hidden">
          <Button variant="outline" size="icon" className="rounded-2xl w-12 h-12">
             <ShoppingCart size={22} />
          </Button>
        </div>
      </div>
    </header>
  );
}