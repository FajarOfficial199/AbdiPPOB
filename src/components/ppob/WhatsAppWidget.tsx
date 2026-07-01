
"use client"
import React from 'react';
import { MessageCircle } from 'lucide-react';

export function WhatsAppWidget() {
  const phoneNumber = "6283894781688"; // Updated to user's number
  const message = "Halo Abdi Pratama PPOB, saya butuh bantuan terkait transaksi saya. Mohon dibantu.";

  const handleChat = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <button
        onClick={handleChat}
        className="group relative flex items-center justify-center w-16 h-16 bg-accent text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
        title="Chat via WhatsApp"
      >
        <div className="absolute -top-12 right-0 bg-white text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-100">
          Butuh Bantuan? Chat Kami!
        </div>
        <MessageCircle size={32} className="fill-current" />
        <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-20" />
      </button>
    </div>
  );
}
