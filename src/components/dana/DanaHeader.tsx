"use client"
import React, { useState, useEffect } from 'react';
import { 
  Menu, User, Wallet, 
  ShieldCheck, TrendingUp, LogOut, 
  LayoutDashboard, Zap, Sparkles, Home,
  RefreshCcw, ArrowRight, ClipboardList,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ppob/Logo';
import { ThemeToggle } from '@/components/ppob/ThemeToggle';
import { Badge } from '@/components/ui/badge';

interface DanaHeaderProps {
  onRoleChange?: (role: 'GUEST' | 'RESELLER' | 'AFFILIATE') => void;
  onViewChange?: (view: 'HOME' | 'DASHBOARD' | 'STATUS') => void;
  currentRole: 'GUEST' | 'RESELLER' | 'AFFILIATE';
  currentView: 'HOME' | 'DASHBOARD' | 'STATUS';
}

export function DanaHeader({ onRoleChange, onViewChange, currentRole, currentView }: DanaHeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [showAffiliateDialog, setShowAffiliateDialog] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    setIsAdmin(!!localStorage.getItem('admin_session'));
  }, []);

  const checkAdminStatus = () => {
    setIsAdmin(!!localStorage.getItem('admin_session'));
  };

  const activateAffiliate = () => {
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      setShowAffiliateDialog(false);
      toast({
        title: "Affiliate Aktif!",
        description: `Selamat! Anda kini adalah Affiliate VIP. Mulai bagikan kode referral Anda.`,
      });
      if (onRoleChange) onRoleChange('AFFILIATE');
      if (onViewChange) onViewChange('DASHBOARD');
    }, 1500);
  };

  const handleLogout = () => {
    if (onRoleChange) onRoleChange('GUEST');
    if (onViewChange) onViewChange('HOME');
    localStorage.removeItem('admin_session');
    setIsAdmin(false);
    toast({
      title: "Berhasil Keluar",
      description: "Anda telah keluar dari semua sesi kemitraan dan admin.",
    });
  };

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-[100] bg-background/90 backdrop-blur-2xl border-b border-border/50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-4">
          <Logo />
          {currentRole === 'RESELLER' && (
            <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 animate-in fade-in slide-in-from-left-4 duration-1000">
               <UserCheck size={12} className="text-emerald-500" />
               <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Reseller Mode Active</span>
            </div>
          )}
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-8 text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em]">
          <button 
            onClick={() => onViewChange?.('HOME')} 
            className={cn("hover:text-foreground transition-all", currentView === 'HOME' && "text-foreground")}
          >
            Beranda
          </button>
          <button 
            onClick={() => onViewChange?.('STATUS')} 
            className={cn("hover:text-foreground transition-all", currentView === 'STATUS' && "text-foreground")}
          >
            Status
          </button>
          <button className="hover:text-foreground transition-all">Promo</button>
          <Link href={isAdmin ? "/admin/dashboard" : "/admin/login"} className="flex items-center gap-2 text-primary hover:text-foreground transition-all group">
            <ShieldCheck size={16} className="group-hover:scale-110 transition-transform" />
            {isAdmin ? "PANEL ADMIN" : "LOGIN ADMIN"}
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {currentRole !== 'GUEST' && (
            <Button 
              onClick={() => onViewChange?.('DASHBOARD')}
              variant="ghost" 
              size="sm"
              className={cn(
                "hidden md:flex h-11 rounded-2xl gap-2 px-5 font-black text-[9px] uppercase tracking-widest border transition-all active:scale-95",
                currentRole === 'RESELLER' 
                  ? "bg-primary/10 border-primary/20 text-primary hover:bg-primary/20" 
                  : "bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/20"
              )}
            >
              <LayoutDashboard size={16} /> {currentRole} PANEL
            </Button>
          )}

          {/* Profile Dropdown */}
          <DropdownMenu modal={false} onOpenChange={(open) => open && checkAdminStatus()}>
            <DropdownMenuTrigger asChild>
              <button className="outline-none group">
                <div className={cn(
                  "p-0.5 rounded-full transition-all duration-500 group-hover:scale-110 active:scale-95",
                  isAdmin ? "bg-emerald-500 p-0.5" : currentRole === 'GUEST' ? "bg-muted" : currentRole === 'RESELLER' ? "bg-primary p-0.5" : "bg-amber-500 p-0.5"
                )}>
                  <Avatar className="w-10 h-10 border-2 border-background">
                    <AvatarImage src={isAdmin ? "https://picsum.photos/seed/admin/100/100" : currentRole === 'GUEST' ? undefined : `https://picsum.photos/seed/${currentRole}/100/100`} />
                    <AvatarFallback className="bg-muted text-foreground font-black"><User size={20}/></AvatarFallback>
                  </Avatar>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72 bg-background border-border text-foreground rounded-[2rem] shadow-2xl p-2 mt-3" align="end">
              <DropdownMenuLabel className="px-4 py-4 text-center">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">MODE SAAT INI</span>
                <p className="text-lg font-black uppercase tracking-tight mt-1">
                  {isAdmin ? 'ADMINISTRATOR' : currentRole === 'GUEST' ? 'PENGUNJUNG' : currentRole}
                </p>
                {currentRole === 'RESELLER' && <Badge className="bg-emerald-500 text-white mt-3 font-black text-[8px] tracking-[0.1em] px-3 py-0.5">MASTER MARGIN ACTIVE</Badge>}
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator className="bg-border mx-3" />
              
              {isAdmin && (
                <div className="p-1.5 mb-1">
                  <DropdownMenuItem 
                    onSelect={() => router.push('/admin/dashboard')} 
                    className="flex items-center gap-3 p-4 rounded-xl cursor-pointer bg-emerald-500/10 border border-emerald-500/20 group hover:bg-emerald-500/20 transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                      <ShieldCheck size={18} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-black text-[9px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400">ADMIN DASHBOARD</span>
                      <span className="text-[7px] text-muted-foreground font-bold uppercase">KELOLA SISTEM UTAMA</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border mx-1.5 mt-3" />
                </div>
              )}
              
              {!isAdmin && currentRole === 'GUEST' ? (
                <div className="p-1.5 space-y-1">
                  <DropdownMenuItem 
                    onSelect={() => router.push('/signup')} 
                    className="flex items-center gap-3 p-4 rounded-xl cursor-pointer hover:bg-primary/10 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <TrendingUp size={18} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-black text-[10px] uppercase tracking-widest">DAFTAR RESELLER</span>
                      <span className="text-[7px] text-muted-foreground font-bold uppercase">HARGA KHUSUS MASTER</span>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem 
                    onSelect={() => setShowAffiliateDialog(true)} 
                    className="flex items-center gap-3 p-4 rounded-xl cursor-pointer hover:bg-amber-500/10 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                      <Zap size={18} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-black text-[10px] uppercase tracking-widest">AKTIFKAN AFFILIATE</span>
                      <span className="text-[7px] text-muted-foreground font-bold uppercase">KOMISI Rp 800 / SALES</span>
                    </div>
                  </DropdownMenuItem>
                </div>
              ) : !isAdmin ? (
                <div className="p-1.5 space-y-1">
                  <DropdownMenuItem 
                    onSelect={() => onViewChange?.('DASHBOARD')} 
                    className="flex items-center gap-3 p-4 rounded-xl cursor-pointer hover:bg-primary/10 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <LayoutDashboard size={18} />
                    </div>
                    <span className="font-black text-[10px] uppercase tracking-widest">BUKA PANEL DASHBOARD</span>
                  </DropdownMenuItem>
                </div>
              ) : null}

              <DropdownMenuSeparator className="bg-border mx-3" />
              
              <div className="p-1.5">
                <DropdownMenuItem 
                  onSelect={() => onViewChange?.('STATUS')} 
                  className="flex items-center gap-3 p-4 rounded-xl cursor-pointer hover:bg-muted"
                >
                  <ClipboardList size={18} className="text-muted-foreground" />
                  <span className="font-black text-[10px] uppercase tracking-widest">STATUS PESANAN</span>
                </DropdownMenuItem>
                
                {(currentRole !== 'GUEST' || isAdmin) && (
                  <DropdownMenuItem 
                    onSelect={handleLogout} 
                    className="flex items-center gap-3 p-4 rounded-xl cursor-pointer hover:bg-rose-500/10 text-rose-500"
                  >
                    <LogOut size={18} />
                    <span className="font-black text-[10px] uppercase tracking-widest">KELUAR SESI</span>
                  </DropdownMenuItem>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Hamburger Menu */}
          <DropdownMenu modal={false} onOpenChange={(open) => open && checkAdminStatus()}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl bg-muted border border-border p-0 text-foreground hover:bg-muted/80 transition-all shadow-lg">
                <Menu size={24} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-background border-border text-foreground rounded-[1.5rem] shadow-2xl p-1.5 mt-3" align="end">
               <div className="p-1.5 space-y-1">
                 <DropdownMenuItem onSelect={() => onViewChange?.('HOME')} className="p-4 rounded-xl gap-3 cursor-pointer hover:bg-muted">
                   <Home size={18} className="text-primary"/> <span className="font-black text-[10px] uppercase tracking-widest">BERANDA</span>
                 </DropdownMenuItem>
                 
                 <DropdownMenuItem onSelect={() => onViewChange?.('STATUS')} className="p-4 rounded-xl gap-3 cursor-pointer hover:bg-muted">
                   <ClipboardList size={18} className="text-primary"/> <span className="font-black text-[10px] uppercase tracking-widest">STATUS</span>
                 </DropdownMenuItem>

                 {isAdmin && (
                   <DropdownMenuItem onSelect={() => router.push('/admin/dashboard')} className="p-4 rounded-xl gap-3 cursor-pointer bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                     <ShieldCheck size={18}/> <span className="font-black text-[10px] uppercase tracking-widest">ADMIN PANEL</span>
                   </DropdownMenuItem>
                 )}

                 {!isAdmin && currentRole === 'GUEST' ? (
                   <>
                     <DropdownMenuItem onSelect={() => router.push('/login')} className="p-4 rounded-xl gap-3 cursor-pointer hover:bg-muted">
                       <User size={18} className="text-muted-foreground"/> <span className="font-black text-[10px] uppercase tracking-widest">LOGIN RESELLER</span>
                     </DropdownMenuItem>
                     <DropdownMenuItem onSelect={() => setShowAffiliateDialog(true)} className="p-4 rounded-xl gap-3 cursor-pointer hover:bg-amber-500/10 text-amber-500">
                       <Zap size={18}/> <span className="font-black text-[10px] uppercase tracking-widest">AFFILIATE</span>
                     </DropdownMenuItem>
                   </>
                 ) : (currentRole !== 'GUEST' || isAdmin) ? (
                   <DropdownMenuItem onSelect={handleLogout} className="p-4 rounded-xl gap-3 cursor-pointer hover:bg-rose-500/10 text-rose-500">
                     <LogOut size={18}/> <span className="font-black text-[10px] uppercase tracking-widest">KELUAR</span>
                   </DropdownMenuItem>
                 ) : null}
               </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Affiliate Activation Dialog */}
      <Dialog open={showAffiliateDialog} onOpenChange={setShowAffiliateDialog}>
        <DialogContent className="max-w-md bg-background border-border text-foreground rounded-[2.5rem] p-10 shadow-2xl border-none">
          <div className="absolute top-0 left-0 w-full h-2 bg-amber-500 rounded-t-[2.5rem]" />
          <DialogHeader>
            <DialogTitle className="text-3xl font-black uppercase tracking-tighter text-center leading-tight">
              AKTIVASI <br/><span className="text-amber-500">AFFILIATE</span>
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground text-[10px] mt-4 font-black uppercase tracking-[0.3em]">
              TANPA LOGIN • LANGSUNG CUAN
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-8 mt-8">
            <div className="p-8 rounded-[2rem] bg-muted/50 border border-border text-center space-y-6 group">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500 shadow-xl group-hover:scale-110 transition-all">
                 <Sparkles size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight uppercase leading-none">KOMISI Rp 800</h3>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-relaxed">
                  Dapatkan komisi instan untuk setiap transaksi referral. Cukup aktifkan dan bagikan!
                </p>
              </div>
            </div>
            <Button 
              onClick={activateAffiliate} 
              disabled={isPending}
              className="w-full h-16 rounded-[1.5rem] bg-amber-500 hover:bg-amber-600 text-white font-black uppercase tracking-[0.2em] shadow-xl shadow-amber-500/30 text-sm border-none flex items-center justify-center gap-3"
            >
              {isPending ? <RefreshCcw className="animate-spin" size={20}/> : (
                <>AKTIFKAN SEKARANG <ArrowRight size={18}/></>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
