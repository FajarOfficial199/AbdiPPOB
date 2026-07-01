"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Smartphone, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/ppob/Logo';
import { ThemeToggle } from '@/components/ppob/ThemeToggle';

export default function MemberLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('user_role', 'RESELLER');
      
      toast({
        title: "Login Berhasil",
        description: "Selamat datang kembali di panel kemitraan Abdi Pratama.",
      });
      
      router.push('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="absolute top-8 right-8">
        <ThemeToggle />
      </div>

      <Link href="/" className="mb-12">
        <Logo className="scale-110" />
      </Link>
      
      <Card className="w-full max-w-md bg-card border-border rounded-[3rem] overflow-hidden shadow-2xl focus:outline-none">
        <CardHeader className="text-center p-10 space-y-2">
          <CardTitle className="text-3xl font-black uppercase tracking-tight">Login Mitra</CardTitle>
          <CardDescription className="text-muted-foreground font-bold uppercase text-[9px] tracking-[0.3em]">RESLLLER & AFFILIATE CENTRAL</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-6 px-10">
            <div className="space-y-3">
              <Label className="font-black text-[10px] uppercase tracking-widest text-muted-foreground ml-2">Alamat Email</Label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  type="email" 
                  placeholder="nama@email.com" 
                  className="pl-14 h-16 rounded-2xl bg-muted border-border font-bold" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center ml-2">
                <Label className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Kata Sandi</Label>
                <Link href="/forgot-password" size="sm" className="text-[10px] font-black text-primary uppercase hover:underline">Lupa Sandi?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  type="password" 
                  placeholder="••••••••"
                  className="pl-14 h-16 rounded-2xl bg-muted border-border font-bold" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-10 flex flex-col gap-6">
            <Button type="submit" className="w-full h-18 rounded-2xl bg-primary hover:bg-primary/90 font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 text-white" disabled={loading}>
              {loading ? 'MEMVERIFIKASI...' : 'MASUK SEKARANG'}
            </Button>
            <p className="text-[10px] text-muted-foreground font-bold text-center uppercase tracking-widest">
              Belum punya akun? <Link href="/signup" className="text-primary hover:underline">Daftar Jadi Mitra</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}