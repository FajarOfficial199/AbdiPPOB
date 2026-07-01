"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Clock, CheckCircle2, XCircle, Loader2, ClipboardList, ShieldCheck, Printer } from 'lucide-react';
import { RECENT_TRANSACTIONS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function TransactionHistory() {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [selectedTxForPrint, setSelectedTxForPrint] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    setCurrentTime(Date.now());
    const interval = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const filtered = RECENT_TRANSACTIONS.filter(tx => 
    tx.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tx.customerNumber.includes(searchTerm)
  );

  const formatRelativeTime = (date: Date) => {
    if (!mounted || currentTime === 0) return 'Baru saja';
    const diffInMinutes = Math.ceil((date.getTime() - currentTime) / (1000 * 60));
    try {
      return new Intl.RelativeTimeFormat('id', { numeric: 'auto' }).format(diffInMinutes, 'minute');
    } catch (e) {
      console.error("Error formatting time:", e);
      return `${Math.abs(diffInMinutes)} menit lalu`;
    }
  };

  const handlePrint = (tx: any) => {
    setSelectedTxForPrint(tx);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  if (!mounted) return null;

  return (
    <>
      <section id="history" className="py-12 animate-in fade-in duration-700">
        <div className="space-y-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <ClipboardList size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Status Transaksi</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-1">Lacak Pesanan Anda Real-Time</p>
            </div>
          </div>

          <Card className="glass-card rounded-[3rem] border-none overflow-hidden bg-white/[0.02]">
            <CardHeader className="p-8 md:p-10 border-b border-white/5 bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl font-black text-white">Dashboard Pesanan</CardTitle>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                </div>
                <CardDescription className="font-bold text-slate-500 uppercase text-[9px] tracking-widest">Sinkronisasi Server: AKTIF</CardDescription>
              </div>
              <div className="relative w-full md:w-96">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                <Input 
                  placeholder="Cari Order ID atau Nomor HP..." 
                  className="pl-14 h-14 rounded-2xl bg-white/5 border-white/10 font-bold text-white placeholder:text-slate-600 focus:ring-primary/20" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto no-scrollbar">
              <Table>
                <TableHeader className="bg-white/[0.02]">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="px-10 h-16 font-black uppercase text-[10px] tracking-widest text-slate-500">ID Pesanan</TableHead>
                    <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-slate-500">Nomor Tujuan</TableHead>
                    <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-slate-500">Produk</TableHead>
                    <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-slate-500 text-center">Status</TableHead>
                    <TableHead className="px-10 h-16 font-black uppercase text-[10px] tracking-widest text-slate-500 text-right">Opsi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((tx) => (
                    <TableRow key={tx.id} className="border-white/5 hover:bg-white/[0.05] transition-colors group">
                      <TableCell className="px-10 py-8 font-black text-primary text-sm group-hover:scale-105 transition-transform">#{tx.id}</TableCell>
                      <TableCell className="font-bold text-white tracking-widest text-sm">{tx.customerNumber}</TableCell>
                      <TableCell className="font-black text-slate-300 text-sm">{tx.productName}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(
                          "px-5 py-2 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] border-none shadow-lg",
                          tx.status === 'APPROVED' ? "bg-emerald-500/20 text-emerald-400" :
                          tx.status === 'REJECTED' ? "bg-rose-500/20 text-rose-400" :
                          tx.status === 'WAITING_VERIFICATION' ? "bg-amber-500/20 text-amber-400" :
                          "bg-blue-500/20 text-blue-400"
                        )}>
                          {tx.status === 'WAITING_VERIFICATION' ? (
                            <span className="flex items-center gap-2"><Clock size={12} /> VERIFIKASI</span>
                          ) : tx.status === 'APPROVED' ? (
                            <span className="flex items-center gap-2"><CheckCircle2 size={12} /> SUKSES</span>
                          ) : tx.status === 'REJECTED' ? (
                            <span className="flex items-center gap-2"><XCircle size={12} /> GAGAL</span>
                          ) : (
                            <span className="flex items-center gap-2"><Loader2 size={12} className="animate-spin" /> PROSES</span>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-10 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <span className="font-black text-slate-600 text-[9px] uppercase tracking-widest">{formatRelativeTime(tx.createdAt)}</span>
                          {tx.status === 'APPROVED' && (
                            <Button variant="ghost" size="icon" onClick={() => handlePrint(tx)} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white">
                              <Printer size={16} />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filtered.length === 0 && (
                <div className="p-20 text-center space-y-4">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-700">
                    <Search size={40} />
                  </div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Transaksi Tidak Ditemukan</p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="flex items-center justify-center gap-3 text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">
             <ShieldCheck size={16} /> DATA TERENKRIPSI OLEH GATEWAY KEAMANAN
          </div>
        </div>
      </section>

      {/* Robust Thermal Printable Receipt Overlay */}
      {selectedTxForPrint && (
        <div id="printable-receipt">
          <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid black', paddingBottom: '15px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '900', margin: '0', letterSpacing: '-1px' }}>ABDI PRATAMA PPOB</h2>
            <p style={{ fontSize: '11px', margin: '5px 0', fontWeight: 'bold', textTransform: 'uppercase' }}>Digital Transaction Receipt</p>
          </div>
          
          <div style={{ fontSize: '12px', lineHeight: '1.8', fontFamily: 'monospace' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>ID_PESANAN:</span>
              <span style={{ fontWeight: 'bold' }}>#{selectedTxForPrint.id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>TANGGAL:</span>
              <span>{new Date(selectedTxForPrint.createdAt).toLocaleDateString('id-ID')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>WAKTU:</span>
              <span>{new Date(selectedTxForPrint.createdAt).toLocaleTimeString('id-ID')}</span>
            </div>
            <div style={{ borderBottom: '1px dashed black', margin: '10px 0' }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>PRODUK:</span>
              <span style={{ textAlign: 'right', fontWeight: 'bold' }}>{selectedTxForPrint.productName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>TUJUAN:</span>
              <span style={{ fontWeight: 'bold' }}>{selectedTxForPrint.customerNumber}</span>
            </div>
            
            <div style={{ borderBottom: '1px dashed black', margin: '10px 0' }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: '900' }}>
              <span>TOTAL_BAYAR:</span>
              <span>Rp {selectedTxForPrint.amount.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>STATUS:</span>
              <span>SUKSES</span>
            </div>
            
            <div style={{ borderBottom: '1px dashed black', margin: '10px 0' }}></div>
            
            <div style={{ textAlign: 'center', wordBreak: 'break-all', marginTop: '10px' }}>
              <span style={{ fontSize: '10px', fontWeight: 'bold' }}>SERIAL_NUMBER (SN):</span><br/>
              <span style={{ fontWeight: '900', fontSize: '14px', background: '#000', color: '#fff', padding: '2px 8px' }}>{selectedTxForPrint.sn || 'TRX-VERIFIED'}</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '25px', paddingTop: '15px', borderTop: '2px solid black' }}>
            <p style={{ fontSize: '10px', margin: '0', fontWeight: 'bold' }}>Terima kasih telah bertransaksi.</p>
            <p style={{ fontSize: '14px', fontWeight: '900', marginTop: '8px', letterSpacing: '2px' }}>ABDI PRATAMA</p>
          </div>
        </div>
      )}
    </>
  );
}