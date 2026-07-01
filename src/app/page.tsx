"use client"
import React, { useState, useEffect } from 'react';
import { DanaHeader } from '@/components/dana/DanaHeader';
import { PromoSlider } from '@/components/dana/PromoSlider';
import { ServiceGrid } from '@/components/dana/ServiceGrid';
import { StatisticsSection } from '@/components/dana/StatisticsSection';
import { Testimonials } from '@/components/dana/Testimonials';
import { FAQSection } from '@/components/dana/FAQSection';
import { Footer } from '@/components/ppob/Footer';
import { ResellerDashboard, AffiliateDashboard, DepositDialog } from '@/components/dana/MemberDashboards';
import { BottomNav } from '@/components/dana/BottomNav';
import { TransactionHistory } from '@/components/ppob/TransactionHistory';
import { Loader2, Smartphone, LayoutDashboard, Home as HomeIcon, ClipboardList, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<'GUEST' | 'RESELLER' | 'AFFILIATE'>('GUEST');
  const [view, setView] = useState<'HOME' | 'DASHBOARD' | 'STATUS' | 'DEPOSIT'>('HOME');
  const [activeSection, setActiveSection] = useState('home');
  const [showDeposit, setShowDeposit] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    
    // Check for persisted role
    const savedRole = localStorage.getItem('user_role') as any;
    if (savedRole && ['RESELLER', 'AFFILIATE', 'GUEST'].includes(savedRole)) {
      setRole(savedRole);
      // If reseller or affiliate, maybe default to dashboard if coming from login
      if (savedRole !== 'GUEST' && !window.location.hash) {
        setView('DASHBOARD');
        setActiveSection('dashboard');
      }
    }

    const timer = setTimeout(() => setLoading(false), 1000);

    // Listen for commands from AI Assistant
    const handleNav = (e: any) => {
      const newView = e.detail;
      if (newView === 'DEPOSIT') {
        setShowDeposit(true);
      } else {
        setView(newView);
        setActiveSection(newView.toLowerCase());
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const handleLogout = () => {
      setRole('GUEST');
      localStorage.removeItem('user_role');
      setView('HOME');
      setActiveSection('home');
      toast({ title: "Sesi Berakhir", description: "Akun Anda telah dikeluarkan oleh asisten AI." });
    };

    window.addEventListener('nav-view', handleNav);
    window.addEventListener('logout-action', handleLogout);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('nav-view', handleNav);
      window.removeEventListener('logout-action', handleLogout);
    };
  }, []);

  const handleRoleChange = (newRole: 'GUEST' | 'RESELLER' | 'AFFILIATE') => {
    setRole(newRole);
    localStorage.setItem('user_role', newRole);
    setView('DASHBOARD');
    setActiveSection('dashboard');
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background z-[9999] flex flex-col items-center justify-center">
        <div className="relative flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-[2.5rem] bg-primary flex items-center justify-center text-white animate-pulse shadow-2xl shadow-primary/40">
            <Smartphone size={40} />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin text-primary" size={20} />
              <span className="text-foreground font-black text-[10px] tracking-[0.3em] uppercase text-center">MENGINISIALISASI SISTEM...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/50 flex flex-col animate-in fade-in duration-500">
      <DanaHeader 
        onRoleChange={handleRoleChange} 
        currentRole={role} 
        onViewChange={(v) => setView(v as any)} 
        currentView={view} 
      />
      
      <div className="container mx-auto px-4 pt-8 flex justify-center sticky top-28 z-40 hidden md:flex">
        <div className="flex gap-2 p-2 rounded-[2rem] bg-card/80 border border-border backdrop-blur-2xl shadow-2xl">
          <Button 
            variant={view === 'HOME' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => { setView('HOME'); setActiveSection('home'); }}
            className={cn(
              "rounded-[1.5rem] h-12 px-10 gap-3 font-black text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95",
              view === 'HOME' ? "bg-primary shadow-xl shadow-primary/30 text-white" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <HomeIcon size={16} /> Beranda Toko
          </Button>
          <Button 
            variant={view === 'STATUS' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => { setView('STATUS'); setActiveSection('status'); }}
            className={cn(
              "rounded-[1.5rem] h-12 px-10 gap-3 font-black text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95",
              view === 'STATUS' ? "bg-primary shadow-xl shadow-primary/30 text-white" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ClipboardList size={16} /> Status Pesanan
          </Button>
          {role !== 'GUEST' && (
            <>
              <Button 
                variant={view === 'DASHBOARD' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => { setView('DASHBOARD'); setActiveSection('dashboard'); }}
                className={cn(
                  "rounded-[1.5rem] h-12 px-10 gap-3 font-black text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95",
                  view === 'DASHBOARD' ? "bg-primary shadow-xl shadow-primary/30 text-white" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <LayoutDashboard size={16} /> Panel {role}
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowDeposit(true)}
                className="rounded-[1.5rem] h-12 px-10 gap-3 font-black text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95 text-emerald-500 hover:bg-emerald-500/10"
              >
                <Banknote size={16} /> Isi Saldo
              </Button>
            </>
          )}
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 pb-48 space-y-16 overflow-x-hidden">
        {view === 'HOME' && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-1000">
            <section className="pt-8">
              <PromoSlider />
            </section>
            
            <ServiceGrid />
            
            <section id="statistics" className="bg-card/50 rounded-[4rem] p-6 md:p-16 border border-border mt-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10" />
              <StatisticsSection />
            </section>

            <Testimonials />
            
            <section id="faq">
              <FAQSection />
            </section>
          </div>
        )}

        {view === 'STATUS' && (
          <section className="pt-12 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex items-center gap-4 mb-10">
               <div className="w-1.5 h-12 bg-primary rounded-full" />
               <div>
                 <h2 className="text-4xl font-black uppercase tracking-tighter">
                   STATUS <span className="text-primary">PESANAN</span>
                 </h2>
                 <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-[0.4em] mt-2">
                   LACAK TRANSAKSI ANDA SECARA REAL-TIME
                 </p>
               </div>
            </div>
            <TransactionHistory />
          </section>
        )}

        {view === 'DASHBOARD' && (
          <section className="pt-12 max-w-7xl mx-auto animate-in fade-in zoom-in-95 duration-1000">
            <div className="flex items-center gap-4 mb-10">
               <div className="w-1.5 h-12 bg-primary rounded-full" />
               <div>
                 <h2 className="text-4xl font-black uppercase tracking-tighter">
                   {role} <span className="text-primary">CENTRAL</span>
                 </h2>
                 <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-[0.4em] mt-2">
                   WORKSPACE AKTIF • VERSI 2.5
                 </p>
               </div>
            </div>
            {role === 'RESELLER' ? <ResellerDashboard /> : <AffiliateDashboard />}
          </section>
        )}
      </main>

      <BottomNav 
        currentView={view as any} 
        onViewChange={(v) => setView(v as any)} 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        currentRole={role}
        onRoleChange={handleRoleChange}
      />

      <Footer />
      <DepositDialog open={showDeposit} onOpenChange={setShowDeposit} />
    </div>
  );
}