
"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Smartphone, Lock, Mail, User, ShieldCheck, Sparkles, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MemberSignup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.role) {
      toast({ variant: "destructive", title: "Gagal", description: "Pilih jenis kemitraan Anda." });
      return;
    }
    setLoading(true);
    
    // Simulasi pembuatan akun
    setTimeout(() => {
      setLoading(false);
      
      // Persist the chosen role
      localStorage.setItem('user_role', formData.role);
      
      toast({
        title: "Pendaftaran Berhasil",
        description: `Selamat datang Kak ${formData.name}! Status ${formData.role} Anda sudah aktif.`,
      });
      
      router.push('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center gap-3 mb-10 group">
        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-2xl shadow-primary/30 group-hover:rotate-6 transition-all">
          <Smartphone size={32} />
        </div>
        <div className="flex flex-col">
          <span className="font-black text-2xl text-white tracking-tighter">ABDI PRATAMA</span>
          <span className="text-[10px] text-primary font-black uppercase tracking-widest">JOIN ECOSYSTEM</span>
        </div>
      </Link>
      
      <Card className="w-full max-w-lg bg-white/[0.02] border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
        <CardHeader className="text-center p-10 space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-2">
            <Sparkles size={32} />
          </div>
          <CardTitle className="text-3xl font-black text-white uppercase tracking-tight">Daftar Mitra</CardTitle>
          <CardDescription className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.3em]">MULAI BISNIS PPOB ANDA HARI INI</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-6 px-10">
            <div className="space-y-3">
              <Label className="font-black text-[10px] uppercase tracking-widest text-slate-500 ml-2">Nama Lengkap</Label>
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <Input 
                  placeholder="Contoh: Budi Santoso" 
                  className="pl-14 h-16 rounded-2xl bg-white/5 border-white/10 text-white font-bold" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-3">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-slate-500 ml-2">Alamat Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <Input 
                      type="email" 
                      placeholder="nama@email.com" 
                      className="pl-14 h-16 rounded-2xl bg-white/5 border-white/10 text-white font-bold" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
               </div>
               <div className="space-y-3">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-slate-500 ml-2">Pilih Kemitraan</Label>
                  <Select onValueChange={(v) => setFormData({...formData, role: v})} required>
                    <SelectTrigger className="h-16 rounded-2xl bg-white/5 border-white/10 text-white font-bold px-6">
                      <SelectValue placeholder="PILIH ROLE" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0A0A0B] border-white/10 text-white rounded-2xl">
                      <SelectItem value="RESELLER" className="font-bold py-3">RESELLER (Harga Master)</SelectItem>
                      <SelectItem value="AFFILIATE" className="font-bold py-3">AFFILIATE (Komisi Referral)</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
            </div>
            <div className="space-y-3">
              <Label className="font-black text-[10px] uppercase tracking-widest text-slate-500 ml-2">Kata Sandi Baru</Label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <Input 
                  type="password" 
                  placeholder="Min. 8 Karakter"
                  className="pl-14 h-16 rounded-2xl bg-white/5 border-white/10 text-white font-bold" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-10 flex flex-col gap-6">
            <Button type="submit" className="w-full h-20 rounded-2xl bg-primary hover:bg-primary/90 font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/20" disabled={loading}>
              {loading ? <RefreshCcw className="animate-spin" /> : 'AKTIFKAN KEMITRAAN'}
            </Button>
            <p className="text-[10px] text-slate-500 font-bold text-center uppercase tracking-widest">
              Sudah punya akun? <Link href="/login" className="text-primary hover:underline">Masuk Di Sini</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
