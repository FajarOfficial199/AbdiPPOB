"use client"
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from 'lucide-react';

const faqs = [
  { q: "Bagaimana cara melakukan pembelian?", a: "Cukup masukkan nomor tujuan atau ID pelanggan Anda, pilih produk yang diinginkan, dan lakukan pembayaran melalui QRIS yang tersedia." },
  { q: "Berapa lama proses transaksi?", a: "Sebagian besar transaksi kami diproses secara instan dalam hitungan detik. Jika terjadi kendala, tim CS kami siap membantu 24/7." },
  { q: "Apakah saldo bisa dikembalikan jika gagal?", a: "Tentu. Jika transaksi dinyatakan gagal oleh sistem, dana akan dikembalikan ke saldo Anda atau diproses refund manual oleh admin." },
  { q: "Metode pembayaran apa saja yang tersedia?", a: "Saat ini kami mendukung pembayaran QRIS yang bisa di-scan melalui DANA, OVO, GoPay, LinkAja, serta aplikasi Mobile Banking." },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <HelpCircle size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black">PUSAT BANTUAN</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pertanyaan yang sering diajukan</p>
        </div>
      </div>
      
      <div className="glass-card rounded-[2.5rem] p-8">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-white/5">
              <AccordionTrigger className="text-sm font-bold text-slate-200 hover:text-primary transition-colors text-left">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-xs text-slate-400 leading-relaxed font-medium">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
