'use client';
import React from 'react';
import { Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 group", className)}>
      <div className="w-12 h-12 rounded-[1.2rem] bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20 group-hover:rotate-6 transition-all duration-300">
        <Wallet size={28} />
      </div>
      <div className="flex flex-col">
        <span className="font-black text-2xl tracking-tighter leading-none group-hover:text-primary transition-colors">ABDI PRATAMA</span>
        <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mt-1">PPOB ECOSYSTEM</span>
      </div>
    </div>
  );
}