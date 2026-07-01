"use client"
import React, { useState, useEffect } from 'react';
import { 
  Home, ClipboardList, User, Wallet, 
  ShieldCheck, LayoutDashboard,
  Sparkles, RefreshCcw, LogIn, UserPlus, Zap,
  TrendingUp, Shield, Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface BottomNavProps {
  currentView: 'HOME' | 'DASHBOARD' | 'STATUS';
  onViewChange: (view: 'HOME' | 'DASHBOARD' | 'STATUS') => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  currentRole: 'GUEST' | 'RESELLER' | 'AFFILIATE';
  onRoleChange: (role: 'GUEST' | 'RESELLER' | 'AFFILIATE') => void;
}

export function BottomNav({ 
  currentView, 
  onViewChange, 
  activeSection, 
  setActiveSection, 
  currentRole,
  onRoleChange
}: BottomNavProps) {
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdmin = () => {
      setIsAdmin(!!localStorage.getItem('admin_session'));
    };
    checkAdmin();
    if (showProfileDialog) checkAdmin();
  }, [showProfileDialog]);

  const handleLogout = () => {
    onRoleChange('GUEST');
    onViewChange('HOME');
    localStorage.removeItem('admin_session');
    setIsAdmin(false);
    setShowProfileDialog(false);
    toast({ title: "Sesi Berakhir", description: "Anda telah keluar." });
  };

  const instantAffiliate = () => {
    setIsActivating(true);
    setTimeout(() => {
      setIsActivating(false);
      onRoleChange('AFFILIATE');
      onViewChange('DASHBOARD');
      setShowProfileDialog(false);
      toast({ title: "Affiliate Aktif!", description: "Mulai hasilkan komisi sekarang." });
    }, 1200);
  };

  const navItems = [
    { 
      id: 'home', 
      label: 'Beranda', 
      icon: <Home size={18} />, 
      action: () => {
        onViewChange('HOME');
        setActiveSection('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    { 
      id: 'status', 
      label: 'Status', 
      icon: <ClipboardList size={18} />, 
      action: () => {
        onViewChange('STATUS');
        setActiveSection('status');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    { 
      id: 'dashboard', 
      label: 'Panel', 
      icon: <Wallet size={18} />, 
      action: () => {
        if (isAdmin) {
          router.push('/admin/dashboard');
          setShowProfileDialog(false);
        } else if (currentRole === 'GUEST') {
          setShowProfileDialog(true);
        } else {
          onViewChange('DASHBOARD');
          setActiveSection('dashboard');
        }
      }
    },
    { 
      id: 'profile', 
      label: 'Akun', 
      icon: <User size={18} />, 
      action: () => {
        setShowProfileDialog(true);
      }
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] px-3 pb-4 md:hidden">
      <nav className="mx-auto max-w-sm h-16 bg-[#121214]/90 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center justify-around px-4 shadow-2xl">
        {navItems.map((item) => {
          const isActive = 
            (item.id === 'home' && currentView === 'HOME' && activeSection === 'home') ||
            (item.id === 'status' && currentView === 'STATUS') ||
            (item.id === 'dashboard' && (currentView === 'DASHBOARD' || isAdmin)) ||
            (item.id === 'profile' && showProfileDialog);

          return (
            <button
              key={item.id}
              onClick={item.action}
              className="flex flex-col items-center gap-1 transition-all active:scale-90"
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                isActive ? "bg-primary text-white shadow-lg" : "text-slate-500"
              )}>
                {item.icon}
              </div>
              <span className={cn(
                "text-[7px] font-black uppercase tracking-widest transition-all",
                isActive ? "text-primary" : "text-slate-500 opacity-60"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="max-w-xs bg-[#0A0A0B] border-white/10 text-white rounded-[2rem] p-8 shadow-2xl border-none">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight text-center">PUSAT MITRA</DialogTitle>
            <DialogDescription className="text-center text-slate-500 text-[8px] font-black uppercase tracking-widest mt-1">
              PILIH METODE KEMITRAAN
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-6">
            {!isAdmin && currentRole === 'GUEST' ? (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Zap size={20} className="text-amber-500" />
                    <p className="text-[10px] font-black uppercase">Affiliate VIP</p>
                  </div>
                  <Button onClick={instantAffiliate} disabled={isActivating} className="h-10 rounded-lg bg-amber-500 hover:bg-amber-600 font-black uppercase text-[8px] tracking-widest text-white">
                    {isActivating ? <RefreshCcw className="animate-spin" /> : "AKTIFKAN"}
                  </Button>
                </div>

                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <TrendingUp size={20} className="text-primary" />
                    <p className="text-[10px] font-black uppercase">Reseller</p>
                  </div>
                  <Button onClick={() => { router.push('/signup'); setShowProfileDialog(false); }} className="h-10 rounded-lg bg-primary hover:bg-primary/90 font-black uppercase text-[8px] tracking-widest text-white">
                    DAFTAR AKUN
                  </Button>
                </div>
                
                <Button onClick={() => { router.push('/login'); setShowProfileDialog(false); }} variant="ghost" className="w-full h-10 rounded-lg text-[8px] font-black uppercase tracking-widest text-slate-500">
                  SUDAH PUNYA AKUN? MASUK
                </Button>

                <div className="pt-3 border-t border-white/5 mt-2">
                   <Button onClick={() => { router.push('/admin/login'); setShowProfileDialog(false); }} className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[8px] tracking-widest flex items-center justify-center gap-2">
                    <ShieldCheck size={16} /> ADMIN ACCESS
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                   <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">STATUS</p>
                   <p className="text-lg font-black text-primary uppercase mt-1">{isAdmin ? 'ADMINISTRATOR' : currentRole}</p>
                </div>
                
                <Button onClick={() => { if (isAdmin) router.push('/admin/dashboard'); else onViewChange('DASHBOARD'); setShowProfileDialog(false); }} className="w-full h-14 rounded-xl bg-primary font-black uppercase text-[9px] tracking-widest text-white">
                  BUKA PANEL
                </Button>
                
                <Button onClick={handleLogout} variant="ghost" className="w-full h-14 rounded-xl bg-rose-500/10 text-rose-500 font-black uppercase text-[9px] tracking-widest">
                  KELUAR SESI
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
