"use client"
import React from 'react';
import { Mail } from 'lucide-react';

export function EmailWidget() {
  const email = "muhammadabdikapratama7@gmail.com";
  const subject = "Bantuan Transaksi - Abdi Pratama PPOB";
  const body = "Halo Admin, saya butuh bantuan terkait transaksi saya di Abdi Pratama PPOB. Berikut detail kendala saya:";

  const handleContact = () => {
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  };

  return (
    <div className="fixed bottom-24 right-4 z-[9999]">
      <button
        onClick={handleContact}
        className="group relative flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
        title="Hubungi via Email"
      >
        <div className="absolute -top-10 right-0 bg-white text-slate-900 text-[8px] font-black px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-100">
          Butuh Bantuan? Email Kami!
        </div>
        <Mail size={24} />
        <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
      </button>
    </div>
  );
}
