
"use client"
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Smartphone, Mail, ArrowLeft, RefreshCcw, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulasi pengiriman email reset password
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast({
        title: "Email Terkirim",
        description: "Silakan cek kotak masuk email Anda untuk link reset kata sandi.",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center p-4">
      <Link href="/login" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-12 font-black text-[10px] uppercase tracking-widest">
        <ArrowLeft size={16} /> Kembali Ke Login
      </Link>
      
      <Card className="w-full max-w-md bg-white/[0.02] border-white/10 rounded-[3rem] overflow-hidden shadow-2xl p-4">
        {!sent ? (
          <form onSubmit={handleReset}>
            <CardHeader className="text-center p-8 space-y-2">
              <div className="mx-auto w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-2">
                <RefreshCcw size={28} />
              </div>
              <CardTitle className="text-2xl font-black text-white uppercase tracking-tight">Reset Sandi</CardTitle>
              <CardDescription className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.2em]">KAMI AKAN MENGIRIM LINK KE EMAIL ANDA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 px-8">
              <div className="space-y-3">
                <Label className="font-black text-[10px] uppercase tracking-widest text-slate-500 ml-2">Alamat Email Terdaftar</Label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <Input 
                    type="email" 
                    placeholder="nama@email.com" 
                    className="pl-14 h-16 rounded-2xl bg-white/5 border-white/10 text-white font-bold" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-8">
              <Button type="submit" className="w-full h-18 rounded-2xl bg-primary hover:bg-primary/90 font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20" disabled={loading}>
                {loading ? <RefreshCcw className="animate-spin" /> : 'KIRIM LINK RESET'}
              </Button>
            </CardFooter>
          </form>
        ) : (
          <div className="text-center p-10 space-y-8 animate-in zoom-in-95">
             <div className="mx-auto w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 shadow-2xl">
                <CheckCircle2 size={40} />
             </div>
             <div className="space-y-3">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Cek Email Anda</h3>
                <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest">
                  Link reset kata sandi telah dikirim ke <strong>{email}</strong>. Segera reset sandi Anda sebelum link kadaluarsa (30 menit).
                </p>
             </div>
             <Button onClick={() => setSent(false)} variant="ghost" className="text-[10px] font-black text-primary uppercase tracking-widest hover:bg-primary/5">
                Gunakan Email Lain
             </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
