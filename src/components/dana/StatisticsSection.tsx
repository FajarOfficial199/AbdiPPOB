"use client"
import React from 'react';
import { TrendingUp, Users, ShoppingBag, Globe } from 'lucide-react';

const STATS = [
  { label: 'Transaksi Berhasil', value: '1.2M+', icon: <ShoppingBag />, color: 'text-blue-500' },
  { label: 'Pengguna Aktif', value: '450K+', icon: <Users />, color: 'text-emerald-500' },
  { label: 'Partner Terhubung', value: '80+', icon: <Globe />, color: 'text-purple-500' },
  { label: 'Kepuasan Layanan', value: '99.9%', icon: <TrendingUp />, color: 'text-amber-500' },
];

export function StatisticsSection() {
  return (
    <section className="py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
      {STATS.map((stat, i) => (
        <div key={i} className="glass-card p-8 rounded-[2rem] text-center space-y-4 hover:scale-[1.02] transition-transform">
          <div className={`mx-auto w-12 h-12 flex items-center justify-center ${stat.color} opacity-80`}>
            {React.cloneElement(stat.icon as React.ReactElement, { size: 32 })}
          </div>
          <div>
            <p className="text-3xl font-black tracking-tighter">{stat.value}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        </div>
      ))}
    </section>
  );
}