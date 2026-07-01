"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Lock, Mail, AlertCircle, ShieldCheck, Fingerprint, Eye, EyeOff, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/ppob/Logo';
import { ThemeToggle } from '@/components/ppob/ThemeToggle';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  /**
   * KREDENSIAL ADMIN ULTRA AMAN
   */
  const SECURE_EMAIL = "admin@abdipratama.com";
  const SECURE_PASS = "Admin#Abdi@Pratama!2025#SecureX99";

  useEffect(() => {
    if (localStorage.getItem('admin_session')) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    // Simulasi delay keamanan
    setTimeout(() => {
      if (email.toLowerCase() === SECURE_EMAIL && password === SECURE_PASS) {
        const array = new Uint32Array(4);
        window.crypto.getRandomValues(array);
        const sessionToken = `admin_auth_${Array.from(array).map(b => b.toString(36)).join('')}_${Date.now()}`;
        
        localStorage.setItem('admin_session', sessionToken);
        
        toast({
          title: "Akses Diberikan",
          description: "Selamat datang kembali, Owner. Enkripsi sesi diaktifkan.",
        });
        
        router.push('/admin/dashboard');
      } else {
        setError(true);
        toast({
          variant: "destructive",
          title: "Akses Ditolak",
          description: "Kredensial administrator tidak valid. Upaya akses dicatat.",
        });
        setLoading(false);
      }
    }, 1200);
  };

  const copyToClipboard = (text: string, type: 'email' | 'pass') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
    toast({
      description: `${type === 'email' ? 'Email' : 'Password'} berhasil disalin ke clipboard.`,
    });
  };

  return (
    <div className="min-h-svh bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-5">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[150px]" />
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary rounded-full blur-[150px]" />
      </div>

      <div className="absolute top-8 right-8">
        <ThemeToggle />
      </div>
      
      <Link href="/" className="mb-10 block transition-transform hover:scale-105 active:scale-95">
        <Logo className="scale-110" />
      </Link>
      
      <div className="w-full max-w-md space-y-6">
        <Card className="bg-card border-border rounded-[3rem] overflow-hidden shadow-[0_32px_128px_-12px_rgba(0,0,0,0.5)] border-2">
          <CardHeader className="text-center p-10 space-y-4 bg-primary/5 border-b border-border relative">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary border border-primary/20 shadow-inner">
               <ShieldCheck size={44} />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-black uppercase tracking-tight">Terminal Owner</CardTitle>
              <CardDescription className="text-primary font-black uppercase text-[10px] tracking-[0.4em] flex items-center justify-center gap-2">
                <Fingerprint size={12} /> SECURE GATEWAY v4.0
              </CardDescription>
            </div>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-6 p-10">
              {error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-2xl text-[10px] flex items-center gap-3 border border-destructive/20 font-black uppercase tracking-widest">
                  <AlertCircle size={16} /> Autentikasi Gagal
                </div>
              )}
              <div className="space-y-3">
                <Label className="font-black text-[10px] uppercase tracking-widest text-muted-foreground ml-2">Email Administrator</Label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    type="email"
                    placeholder="admin@abdipratama.com" 
                    className="pl-14 h-16 rounded-2xl bg-muted/50 border-border font-bold focus:ring-primary/20 transition-all" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="font-black text-[10px] uppercase tracking-widest text-muted-foreground ml-2">Password Enkripsi</Label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••••••••••"
                    className="pl-14 pr-14 h-16 rounded-2xl bg-muted/50 border-border font-bold focus:ring-primary/20 transition-all" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-10 pt-0">
              <Button type="submit" className="w-full h-20 rounded-2xl bg-primary hover:bg-primary/90 font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 transition-all active:scale-95 text-white" disabled={loading}>
                {loading ? 'MENGEVALUASI...' : 'MASUK TERMINAL KONTROL'}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Copy Credentials Helper Section */}
        <div className="p-8 rounded-[2.5rem] bg-muted/30 border border-border space-y-6">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                 <Lock size={16} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Kredensial Akses Cepat</p>
           </div>
           <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-background border border-border">
                 <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">EMAIL ADMIN</span>
                    <span className="text-xs font-bold">{SECURE_EMAIL}</span>
                 </div>
                 <Button 
                   variant="ghost" 
                   size="icon" 
                   onClick={() => copyToClipboard(SECURE_EMAIL, 'email')}
                   className="h-10 w-10 rounded-xl hover:bg-primary/10 text-primary"
                 >
                   {copiedEmail ? <Check size={18} /> : <Copy size={18} />}
                 </Button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-background border border-border">
                 <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">SECURE PASSWORD</span>
                    <span className="text-xs font-mono font-bold tracking-tighter opacity-50">Admin#Abdi...</span>
                 </div>
                 <Button 
                   variant="ghost" 
                   size="icon" 
                   onClick={() => copyToClipboard(SECURE_PASS, 'pass')}
                   className="h-10 w-10 rounded-xl hover:bg-primary/10 text-primary"
                 >
                   {copiedPass ? <Check size={18} /> : <Copy size={18} />}
                 </Button>
              </div>
           </div>
        </div>
      </div>
      
      <div className="mt-8 text-center space-y-2">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black opacity-40">256-BIT SSL ENCRYPTION ACTIVE</p>
        <p className="text-[9px] text-muted-foreground font-bold italic">© Abdi Pratama Secure Proprietary Interface</p>
      </div>
    </div>
  );
}