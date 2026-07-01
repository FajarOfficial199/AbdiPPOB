"use client"
import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const REVIEWS = [
  { name: "Budi S.", role: "Pengepul Pulsa", text: "Harga paling murah dibanding yang lain, prosesnya beneran instan!", avatar: "https://picsum.photos/seed/user1/100/100" },
  { name: "Siti A.", role: "Gamers", text: "Top up ML di sini gak pernah nunggu lama. Rekomen banget buat temen-temen gamer.", avatar: "https://picsum.photos/seed/user2/100/100" },
  { name: "Andi W.", role: "Pelanggan Setia", text: "Live chat-nya responsif banget pas ada kendala token PLN semalam. Makasih admin!", avatar: "https://picsum.photos/seed/user3/100/100" },
];

export function Testimonials() {
  return (
    <section className="py-12 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black tracking-tight">KATA MEREKA</h2>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Ribuan pelanggan puas dengan layanan kami</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {REVIEWS.map((rev, i) => (
          <div key={i} className="glass-card p-8 rounded-[2.5rem] relative group hover:scale-[1.02] transition-all">
            <Quote className="absolute top-6 right-8 text-primary/10 group-hover:text-primary/20" size={48} />
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <Star key={j} size={12} className="fill-amber-500 text-amber-500" />
              ))}
            </div>
            <p className="text-xs text-slate-300 font-medium italic mb-6 leading-relaxed">"{rev.text}"</p>
            <div className="flex items-center gap-4">
              <Avatar className="w-10 h-10 border-2 border-primary/20">
                <AvatarImage src={rev.avatar} />
                <AvatarFallback>{rev.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-black">{rev.name}</p>
                <p className="text-[10px] font-bold text-primary uppercase">{rev.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
