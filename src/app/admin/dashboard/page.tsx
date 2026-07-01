"use client"
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Activity, ShoppingCart, Settings, LogOut, 
  MessageSquare, User, Bell, PackageSearch,
  Check, X, Eye, TrendingUp, ArrowUpRight,
  ShieldCheck, MoreHorizontal, UserCheck, Banknote,
  Search, Calendar, Info, Loader2, ImageIcon, ScanLine, Send,
  Users, CreditCard, BarChart3, TrendingDown, Gift, Clock, AlertTriangle, Key, Mail,
  ReceiptText, Zap, Globe, Cpu, Server, Database, RefreshCw, Save, MessageCircle,
  Hash, ShieldAlert, Terminal, History, Filter, FileText, CheckCircle2, XCircle, PlayCircle,
  Printer, Coins, Percent, FileOutput, Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Logo } from '@/components/ppob/Logo';
import { ThemeToggle } from '@/components/ppob/ThemeToggle';
import { ScrollArea } from '@/components/ui/scroll-area';
import { validatePaymentProof, type PaymentProofValidationOutput } from '@/ai/flows/payment-proof-validation';

interface ChatMessage {
  id: string;
  role: 'admin' | 'user' | 'system';
  text: string;
  time: string;
}

interface ChatSession {
  id: string;
  userName: string;
  userRole: string;
  lastMessage: string;
  time: string;
  unread: number;
  status: 'online' | 'offline';
  messages: ChatMessage[];
}

interface Transaction {
  id: string;
  target: string;
  product: string;
  productCode: string;
  amount: number;
  costPrice: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'WAITING' | 'PROCESSING';
  date: string;
  timestamp: Date;
  method: string;
  userEmail: string;
  profit: number;
  proofUrl?: string;
  sn?: string;
}

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  
  const [apiConfig, setApiConfig] = useState({
    apiId: '',
    apiKey: '',
    apiSignature: '',
    adminMargin: 2000,
    resellerMargin: 500
  });
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [selectedChatId, setSelectedChatId] = useState<string | null>('chat-1');
  const [chatInput, setChatInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);
  const [aiScanResult, setAiScanResult] = useState<PaymentProofValidationOutput | null>(null);
  const [isAiScanning, setIsAiScan] = useState(false);
  const [activeTx, setActiveTx] = useState<Transaction | null>(null);
  const [txForPrint, setTxForPrint] = useState<Transaction | null>(null);

  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: 'chat-1',
      userName: 'Budi Santoso',
      userRole: 'RESELLER',
      lastMessage: 'Kak, pulsa 10k ke 0812 belum masuk ya?',
      time: '14:20',
      unread: 1,
      status: 'online',
      messages: [
        { id: 'm1', role: 'user', text: 'Halo admin', time: '14:15' },
        { id: 'm2', role: 'admin', text: 'Halo Kak Budi, ada yang bisa dibantu?', time: '14:16' },
        { id: 'm3', role: 'user', text: 'Kak, pulsa 10k ke 0812 belum masuk ya?', time: '14:20' },
      ]
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'TX-8821', target: '08123456789', product: 'Pulsa 10.000', productCode: 'P10', amount: 11500, costPrice: 10200, profit: 1300, status: 'SUCCESS', date: '5 menit lalu', timestamp: new Date(), method: 'SALDO', userEmail: 'budi.reseller@gmail.com', sn: 'SN-9921-2025' },
    { id: 'DEP-100', target: 'Deposit System', product: 'Top Up Saldo Mitra', productCode: 'DEP', amount: 100000, costPrice: 0, profit: 0, status: 'WAITING', date: '10 menit lalu', timestamp: new Date(), method: 'QRIS DEPOSIT', userEmail: 'siti.affiliate@yahoo.com', proofUrl: 'https://i.imgur.com/IvVcoBz.png' },
    { id: 'TX-9022', target: 'ID: 1229381', product: 'ML 86 Diamonds', productCode: 'ML-86', amount: 22000, costPrice: 19800, profit: 2200, status: 'SUCCESS', date: '1 jam lalu', timestamp: new Date(), method: 'QRIS', userEmail: 'GUEST (Guest Checkout)', proofUrl: 'https://picsum.photos/seed/proof1/400/600', sn: 'SN-ML-86-991' },
  ]);

  const [searchTx, setSearchTx] = useState('');

  useEffect(() => {
    setMounted(true);
    const session = localStorage.getItem('admin_session');
    const savedApiId = localStorage.getItem('vip_api_id') || '';
    const savedApiKey = localStorage.getItem('vip_api_key') || '';
    const savedApiSignature = localStorage.getItem('vip_api_signature') || '';
    const savedAdminMargin = parseInt(localStorage.getItem('admin_margin') || '2000');
    const savedResellerMargin = parseInt(localStorage.getItem('reseller_margin') || '500');
    
    setApiConfig({ 
      apiId: savedApiId, 
      apiKey: savedApiKey,
      apiSignature: savedApiSignature,
      adminMargin: savedAdminMargin,
      resellerMargin: savedResellerMargin
    });
    
    if (!session || !session.startsWith('admin_auth_')) {
      router.replace('/admin/login');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chatSessions, selectedChatId]);

  const updateTxStatus = (id: string, newStatus: Transaction['status']) => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, status: newStatus } : tx));
    toast({
      title: `Status Diperbarui: ${newStatus}`,
      description: `Transaksi ${id} kini berstatus ${newStatus}.`,
    });

    if (newStatus === 'SUCCESS') {
      handleAutoDelivery(id);
    }
  };

  const handleAutoDelivery = async (txId: string) => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx) return;

    toast({ title: "Memicu Gateway", description: "Mengirim payload ke provider secara instan..." });
    
    try {
      const res = await fetch('/api/place-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetNumber: tx.target,
          productCode: tx.productCode || 'AUTO-GEN-CODE',
          orderId: tx.id
        })
      });
      const data = await res.json();
      if (data.success) {
        setTransactions(prev => prev.map(t => t.id === txId ? { ...t, sn: data.sn } : t));
        toast({ title: "Pengiriman Sukses", description: `Produk berhasil dikirim. SN: ${data.sn}` });
      } else {
        toast({ variant: "destructive", title: "Gateway Timeout", description: data.message });
      }
    } catch (e) {
      console.error("Error auto delivery:", e);
      toast({ variant: "destructive", title: "Network Error", description: "Gagal menghubungi pusat data pengiriman." });
    }
  };

  const handlePrint = (tx: Transaction) => {
    setTxForPrint(tx);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const handleAiScan = async () => {
    if (!selectedProofUrl || !activeTx) return;
    setIsAiScan(true);
    setAiScanResult(null);

    try {
      const result = await validatePaymentProof({
        paymentProofImageUri: selectedProofUrl,
        expectedAmount: activeTx.amount,
        transactionId: activeTx.id,
        merchantName: "Abdi Pratama PPOB",
        customerName: activeTx.userEmail
      });
      setAiScanResult(result);
      toast({ title: "AI Scan Selesai", description: result.isMatch ? "Data cocok!" : "Data tidak sinkron." });
    } catch (err) {
      console.error("Error AI scan:", err);
      toast({ variant: "destructive", title: "AI Busy", description: "Gagal memindai gambar." });
    } finally {
      setIsAiScan(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedChatId) return;
    const newMessage: ChatMessage = {
      id: `m-${Date.now()}`,
      role: 'admin',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatSessions(prev => prev.map(s => s.id === selectedChatId ? { ...s, messages: [...s.messages, newMessage], lastMessage: chatInput, time: newMessage.time, unread: 0 } : s));
    setChatInput('');
  };

  const saveApiConfig = () => {
    localStorage.setItem('vip_api_id', apiConfig.apiId);
    localStorage.setItem('vip_api_key', apiConfig.apiKey);
    localStorage.setItem('vip_api_signature', apiConfig.apiSignature);
    localStorage.setItem('admin_margin', apiConfig.adminMargin.toString());
    localStorage.setItem('reseller_margin', apiConfig.resellerMargin.toString());
    toast({ title: "Konfigurasi Disimpan", description: "Kredensial & Margin diperbarui." });
  };

  const handleSyncProducts = async () => {
    if (!apiConfig.apiId || !apiConfig.apiKey) {
      toast({ variant: "destructive", title: "Gagal", description: "Lengkapi API ID dan API Key." });
      return;
    }
    setIsSyncing(true);
    try {
      const res = await fetch('/api/admin/sync-products', { method: 'POST', body: JSON.stringify(apiConfig) });
      const data = await res.json();
      if (data.success) toast({ title: "Sinkronisasi Berhasil", description: `${data.count} produk diperbarui.` });
      else throw new Error(data.message);
    } catch (err: any) {
      console.error("Error syncing products:", err);
      toast({ variant: "destructive", title: "Gagal Sinkronisasi", description: err.message });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    router.push('/');
  };

  if (!mounted || !authorized) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary animate-pulse border border-primary/30">
        <ShieldCheck size={32} />
      </div>
      <Loader2 className="animate-spin text-primary w-6 h-6" />
    </div>
  );

  const activeSession = chatSessions.find(s => s.id === selectedChatId);
  const filteredTransactions = transactions.filter(tx => tx.id.toLowerCase().includes(searchTx.toLowerCase()) || tx.target.includes(searchTx) || tx.userEmail.toLowerCase().includes(searchTx.toLowerCase()));
  const totalRevenue = transactions.reduce((acc, tx) => acc + (tx.status === 'SUCCESS' ? tx.amount : 0), 0);
  const totalProfit = transactions.reduce((acc, tx) => acc + (tx.status === 'SUCCESS' ? tx.profit : 0), 0);

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden font-sans">
      <aside className="w-64 border-r border-border hidden lg:flex flex-col fixed inset-y-0 z-50 bg-card/80 backdrop-blur-2xl shadow-xl">
        <div className="p-8">
          <Logo />
          <div className="mt-6 flex items-center gap-2 bg-primary/10 p-2.5 rounded-xl border border-primary/20">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]" />
            <span className="text-[9px] font-black uppercase tracking-widest text-primary">System Online</span>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-2">
          <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl h-12 bg-primary/10 text-primary border border-primary/20"><Cpu size={18}/> Mission Control</Button>
          <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl h-12 text-muted-foreground hover:bg-muted"><Users size={18}/> Entity Members</Button>
          <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl h-12 text-muted-foreground hover:bg-muted"><Database size={18}/> Provider Nodes</Button>
          <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl h-12 text-muted-foreground hover:bg-muted"><FileOutput size={18}/> Receipt Hub <Badge className="ml-auto bg-primary text-[8px] h-4 px-1.5">AUTO</Badge></Button>
        </nav>
        <div className="p-6 border-t border-border flex justify-between items-center">
             <ThemeToggle />
             <Button onClick={handleLogout} variant="ghost" size="icon" className="w-10 h-10 rounded-xl text-rose-500 hover:bg-rose-500/10"><LogOut size={18}/></Button>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 p-8 space-y-8 overflow-y-auto h-screen no-scrollbar animate-in fade-in duration-500">
        <header className="flex justify-between items-end">
          <div>
            <Badge className="bg-primary text-white border-none px-2 py-0.5 rounded-md text-[7px] font-black tracking-widest uppercase mb-1">Build v5.2.0 (SECURE OS)</Badge>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none">Operation Center</h1>
          </div>
          <div className="flex items-center gap-3 bg-primary p-1.5 pr-4 rounded-full border border-primary/20 shadow-xl">
             <div className="w-9 h-9 rounded-full border border-white/30 overflow-hidden"><Image src="https://picsum.photos/seed/admin/100/100" alt="Admin" width={36} height={36} className="object-cover" /></div>
             <div className="flex flex-col text-white"><span className="text-[9px] font-black uppercase tracking-widest">CLEARANCE: O5</span><span className="text-[7px] font-bold opacity-70 uppercase tracking-widest">Master Command Node</span></div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <Card className="p-6 rounded-3xl border-none bg-primary/5 space-y-1"><p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Total Volume</p><h3 className="text-xl font-black tracking-tighter">Rp {totalRevenue.toLocaleString()}</h3></Card>
           <Card className="p-6 rounded-3xl border-none bg-emerald-500/5 space-y-1"><p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Est. Profit</p><h3 className="text-xl font-black tracking-tighter text-emerald-500">Rp {totalProfit.toLocaleString()}</h3></Card>
           <Card className="p-6 rounded-3xl border-none bg-amber-500/5 space-y-1"><p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Pending Nodes</p><h3 className="text-xl font-black tracking-tighter text-amber-500">{transactions.filter(t => t.status === 'WAITING').length} WAITING</h3></Card>
           <Card className="p-6 rounded-3xl border-none bg-blue-500/5 space-y-1"><p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Gateway</p><h3 className="text-xl font-black tracking-tighter text-blue-500">READY</h3></Card>
        </div>

        <Tabs defaultValue="history" className="space-y-6">
          <TabsList className="bg-muted/50 border border-border p-1 rounded-2xl h-14 w-fit flex gap-1">
            <TabsTrigger value="history" className="rounded-xl px-5 font-black text-[9px] uppercase tracking-widest h-full flex gap-2"><History size={14}/> Global Logs</TabsTrigger>
            <TabsTrigger value="chats" className="rounded-xl px-5 font-black text-[9px] uppercase tracking-widest h-full flex gap-2"><MessageSquare size={14}/> Live Console</TabsTrigger>
            <TabsTrigger value="api" className="rounded-xl px-5 font-black text-[9px] uppercase tracking-widest h-full flex gap-2"><Settings size={14}/> API & Margin Link</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="animate-in fade-in duration-500">
             <Card className="rounded-[2.5rem] border-none overflow-hidden bg-card shadow-lg">
                <div className="p-6 border-b border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
                   <div className="space-y-0.5"><h3 className="text-lg font-black uppercase tracking-tighter italic">Operational Audit</h3><p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Direct Command over Transaction Stream</p></div>
                   <div className="relative w-full md:w-80"><Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" /><Input value={searchTx} onChange={(e) => setSearchTx(e.target.value)} placeholder="Search ID, Target..." className="h-11 pl-11 rounded-xl bg-muted/50 border-border font-bold text-xs" /></div>
                </div>
                <ScrollArea className="h-[500px]">
                   <Table>
                      <TableHeader className="bg-muted/30 sticky top-0 z-10 backdrop-blur-md">
                         <TableRow className="border-border">
                            <TableHead className="px-6 h-14 font-black uppercase text-[9px] tracking-widest">Transaction ID</TableHead>
                            <TableHead className="h-14 font-black uppercase text-[9px] tracking-widest">User / Target</TableHead>
                            <TableHead className="h-14 font-black uppercase text-[9px] tracking-widest">Amount / Profit</TableHead>
                            <TableHead className="h-14 font-black uppercase text-[9px] tracking-widest">Proof</TableHead>
                            <TableHead className="h-14 font-black uppercase text-[9px] tracking-widest">Status</TableHead>
                            <TableHead className="px-6 h-14 font-black uppercase text-[9px] tracking-widest text-right">Rapid Action</TableHead>
                         </TableRow>
                      </TableHeader>
                      <TableBody>
                         {filteredTransactions.map((tx) => (
                           <TableRow key={tx.id} className="border-border hover:bg-primary/5 transition-colors group">
                              <TableCell className="px-6 py-4"><p className="font-black text-primary text-xs">#{tx.id}</p><p className="text-[8px] text-muted-foreground font-bold uppercase">{tx.date}</p></TableCell>
                              <TableCell><div><p className="text-[10px] font-bold truncate max-w-[120px]">{tx.userEmail}</p><p className="text-[9px] font-black text-muted-foreground uppercase">{tx.target}</p></div></TableCell>
                              <TableCell><p className="font-black text-xs">Rp {tx.amount.toLocaleString()}</p><p className="text-[8px] font-black text-emerald-500">PROFIT: +Rp {tx.profit.toLocaleString()}</p></TableCell>
                              <TableCell>
                                 {tx.proofUrl ? (
                                   <Button onClick={() => { setActiveTx(tx); setSelectedProofUrl(tx.proofUrl!); }} variant="ghost" className="h-9 w-9 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"><ImageIcon size={16}/></Button>
                                 ) : <span className="text-[8px] font-bold text-muted-foreground opacity-30 uppercase tracking-widest">NO PROOF</span>}
                              </TableCell>
                              <TableCell>
                                 <Badge className={cn("font-black text-[7px] uppercase tracking-widest px-3 py-1 rounded-full border-none", tx.status === 'SUCCESS' ? "bg-emerald-500/20 text-emerald-500" : tx.status === 'FAILED' ? "bg-rose-500/20 text-rose-500" : tx.status === 'PROCESSING' ? "bg-blue-500/20 text-blue-500" : "bg-amber-500/20 text-amber-600")}>{tx.status}</Badge>
                              </TableCell>
                              <TableCell className="px-6 text-right">
                                 <div className="flex justify-end gap-1.5">
                                    {tx.status === 'SUCCESS' && (
                                      <Button onClick={() => handlePrint(tx)} variant="default" size="icon" className="h-8 w-8 rounded-lg bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20" title="Cetak Struk"><Printer size={14}/></Button>
                                    )}
                                    <Button onClick={() => updateTxStatus(tx.id, 'PROCESSING')} variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20" title="Proses"><PlayCircle size={14}/></Button>
                                    <Button onClick={() => updateTxStatus(tx.id, 'SUCCESS')} variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" title="Berhasil"><CheckCircle2 size={14}/></Button>
                                    <Button onClick={() => updateTxStatus(tx.id, 'FAILED')} variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20" title="Batalkan"><XCircle size={14}/></Button>
                                 </div>
                              </TableCell>
                           </TableRow>
                         ))}
                      </TableBody>
                   </Table>
                </ScrollArea>
             </Card>
          </TabsContent>

          <TabsContent value="chats" className="h-[600px]">
            <Card className="h-full rounded-[2.5rem] overflow-hidden border-none flex bg-card shadow-lg">
              <div className="w-80 border-r border-border/50 flex flex-col bg-muted/10">
                <div className="p-6 border-b border-border/50"><h3 className="text-sm font-black uppercase tracking-tighter">Node Entities</h3></div>
                <ScrollArea className="flex-1">
                  {chatSessions.map((session) => (
                    <button key={session.id} onClick={() => setSelectedChatId(session.id)} className={cn("w-full p-6 text-left border-b border-border/30 transition-all hover:bg-primary/5", selectedChatId === session.id ? "bg-primary/10 border-r-4 border-r-primary" : "")}>
                      <div className="flex justify-between items-start"><div className="flex items-center gap-3"><div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white", session.userRole === 'RESELLER' ? "bg-primary" : "bg-amber-500")}><User size={20} /></div><div><p className="font-black text-xs">{session.userName}</p><Badge className="bg-transparent text-[7px] p-0 font-black text-muted-foreground uppercase tracking-widest">{session.userRole}</Badge></div></div></div>
                    </button>
                  ))}
                </ScrollArea>
              </div>
              <div className="flex-1 flex flex-col relative">
                {activeSession ? (
                  <>
                    <div className="p-6 border-b border-border/50 flex justify-between items-center bg-background/50 backdrop-blur-md">
                      <div className="flex items-center gap-4"><div className="relative"><div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center"><User size={24} /></div><div className={cn("absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background", activeSession.status === 'online' ? "bg-emerald-500 animate-pulse" : "bg-slate-400")} /></div><div><h4 className="text-xl font-black uppercase tracking-tighter italic">{activeSession.userName}</h4></div></div>
                    </div>
                    <ScrollArea className="flex-1 p-8"><div ref={scrollRef} className="space-y-8">{activeSession.messages.map((msg) => (<div key={msg.id} className={cn("flex gap-4 max-w-[85%]", msg.role === 'admin' ? "ml-auto flex-row-reverse" : "")}><div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white", msg.role === 'admin' ? "bg-slate-950" : "bg-primary")}>{msg.role === 'admin' ? <ShieldCheck size={18} /> : <User size={18} />}</div><div className="space-y-2"><div className={cn("p-6 rounded-[1.8rem] text-xs font-bold shadow-md", msg.role === 'admin' ? "bg-primary text-white rounded-tr-none" : "bg-white dark:bg-zinc-800 text-foreground rounded-tl-none border border-border")}>{msg.text}</div></div></div>))}</div></ScrollArea>
                    <form onSubmit={handleSendMessage} className="p-6 border-t border-border/50 bg-background/50 flex gap-4 items-center"><Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Command Response..." className="flex-1 h-12 rounded-xl bg-muted border-border font-bold px-6 text-xs" /><Button type="submit" className="h-12 px-8 rounded-xl bg-primary text-white font-black uppercase tracking-widest text-[9px]">TRANSMIT</Button></form>
                  </>
                ) : <div className="flex-1 flex flex-col items-center justify-center opacity-20"><MessageCircle size={80} /></div>}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="api">
             <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-8 rounded-[2rem] space-y-6 border-none bg-card shadow-lg">
                   <div className="space-y-2"><h3 className="text-xl font-black uppercase italic">Provider & Margin Control</h3></div>
                   <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase flex items-center gap-2 text-muted-foreground"><Key size={12}/> API ID (SIGN ID)</label>
                        <Input value={apiConfig.apiId} onChange={(e) => setApiConfig({...apiConfig, apiId: e.target.value})} className="h-14 rounded-xl bg-muted/50 border-border font-black px-6 text-sm" placeholder="Contoh: VZho2MgD" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase flex items-center gap-2 text-muted-foreground"><Shield size={12}/> SECURE API KEY</label>
                        <Input type="password" value={apiConfig.apiKey} onChange={(e) => setApiConfig({...apiConfig, apiKey: e.target.value})} className="h-14 rounded-xl bg-muted/50 border-border font-black px-6 text-sm" placeholder="Masukkan Kunci API" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase flex items-center gap-2 text-muted-foreground"><Hash size={12}/> TANDA / SIGNATURE (CCC)</label>
                        <Input value={apiConfig.apiSignature} onChange={(e) => setApiConfig({...apiConfig, apiSignature: e.target.value})} className="h-14 rounded-xl bg-muted/50 border-border font-black px-6 text-sm" placeholder="Contoh: cccf435fc01e6..." />
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                         <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase flex items-center gap-1.5 text-muted-foreground"><Percent size={12}/> Umum (Rp)</label>
                           <Input type="number" value={apiConfig.adminMargin} onChange={(e) => setApiConfig({...apiConfig, adminMargin: parseInt(e.target.value) || 0})} className="h-12 rounded-xl bg-muted/50 border-border font-black px-4 text-xs" />
                         </div>
                         <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase flex items-center gap-1.5 text-muted-foreground"><Zap size={12}/> Reseller (Rp)</label>
                           <Input type="number" value={apiConfig.resellerMargin} onChange={(e) => setApiConfig({...apiConfig, resellerMargin: parseInt(e.target.value) || 0})} className="h-12 rounded-xl bg-muted/50 border-border font-black px-4 text-xs" />
                         </div>
                      </div>
                      <Button onClick={saveApiConfig} className="w-full h-14 rounded-xl bg-primary text-white font-black uppercase tracking-widest text-[9px] shadow-lg shadow-primary/20">Commit Config & Margins</Button>
                   </div>
                </Card>
                <Card className="p-8 rounded-[2rem] border-none bg-primary/5 border border-primary/20 shadow-lg flex flex-col justify-between"><div className="flex items-center gap-4"><div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-xl"><RefreshCw className={cn(isSyncing && "animate-spin")} size={28} /></div><div className="space-y-0.5"><h3 className="text-xl font-black uppercase italic text-primary">Catalog Sync</h3></div></div><Button disabled={isSyncing} onClick={handleSyncProducts} className="w-full h-20 rounded-2xl bg-white text-slate-950 font-black uppercase tracking-[0.3em] text-[10px] shadow-xl">{isSyncing ? 'SYNCING...' : 'EXECUTE FULL SYNC'}</Button></Card>
             </div>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={!!selectedProofUrl} onOpenChange={(o) => { if(!o) { setSelectedProofUrl(null); setAiScanResult(null); setActiveTx(null); } }}>
        <DialogContent className="max-w-2xl bg-slate-950 border-white/10 text-white rounded-[2rem] p-0 overflow-hidden shadow-2xl">
           <div className="flex flex-col md:flex-row h-[70vh]">
              <div className="w-full md:w-1/2 relative bg-black/50 border-r border-white/5 flex items-center justify-center p-6 min-h-[250px]">
                 {selectedProofUrl && <Image src={selectedProofUrl} alt="Proof" fill className="object-contain p-2" />}
              </div>
              <div className="w-full md:w-1/2 flex flex-col">
                 <div className="p-8 border-b border-white/10 bg-primary/5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white"><ScanLine size={20}/></div>
                      <div>
                        <DialogTitle className="text-lg font-black uppercase italic tracking-tighter">AI VALIDATOR NODE</DialogTitle>
                        <DialogDescription className="text-[8px] font-black text-primary uppercase tracking-widest">Automated Visual Payload Verification</DialogDescription>
                      </div>
                    </div>
                    <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-1">
                      <div className="flex justify-between text-[8px] font-black uppercase"><span className="text-muted-foreground">Order ID</span><span>#{activeTx?.id}</span></div>
                      <div className="flex justify-between text-[8px] font-black uppercase"><span className="text-muted-foreground">Expected Amt</span><span className="text-primary">Rp {activeTx?.amount.toLocaleString()}</span></div>
                    </div>
                 </div>
                 <ScrollArea className="flex-1 p-8">
                    {!aiScanResult && !isAiScanning && (
                      <div className="text-center space-y-6 py-12">
                         <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-white/20"><Cpu size={32} /></div>
                         <Button onClick={handleAiScan} className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest gap-2 text-[9px]"><ScanLine size={16}/> Mulai Pindai Visual</Button>
                      </div>
                    )}
                    {isAiScanning && (
                      <div className="text-center space-y-6 py-12">
                         <div className="relative w-16 h-16 mx-auto">
                            <div className="absolute inset-0 rounded-2xl border-4 border-primary/20" />
                            <div className="absolute inset-0 rounded-2xl border-t-4 border-primary animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center text-primary"><ScanLine size={24} className="animate-pulse" /></div>
                         </div>
                         <div className="space-y-1">
                            <p className="text-xs font-black uppercase italic animate-pulse">Scanning Visual...</p>
                            <p className="text-[8px] font-bold text-muted-foreground uppercase">Mengekstrak data transaksi</p>
                         </div>
                      </div>
                    )}
                    {aiScanResult && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                         <div className={cn("p-6 rounded-2xl border-2 space-y-3", aiScanResult.isMatch ? "bg-emerald-500/10 border-emerald-500/30" : "bg-rose-500/10 border-rose-500/30")}>
                            <div className="flex items-center justify-between">
                              <span className="text-[8px] font-black uppercase">AI Verdict</span>
                              <Badge className={cn("font-black text-[7px]", aiScanResult.isMatch ? "bg-emerald-500" : "bg-rose-500")}>
                                {aiScanResult.isMatch ? "MATCH" : "MISMATCH"}
                              </Badge>
                            </div>
                            <div className="space-y-0.5">
                               <p className="text-xl font-black italic">Rp {aiScanResult.extractedAmount.toLocaleString()}</p>
                               <p className="text-[8px] font-bold opacity-60 uppercase tracking-widest">EXTRACTED AMOUNT</p>
                            </div>
                            <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                               <p className="text-[10px] font-medium text-slate-300 leading-relaxed italic">"{aiScanResult.reason}"</p>
                            </div>
                         </div>
                         <div className="grid grid-cols-2 gap-3">
                            <Button 
                              onClick={() => { updateTxStatus(activeTx!.id, 'SUCCESS'); setSelectedProofUrl(null); }} 
                              className="h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-[8px] tracking-widest px-1"
                            >
                              Approve
                            </Button>
                            <Button 
                              onClick={() => { updateTxStatus(activeTx!.id, 'FAILED'); setSelectedProofUrl(null); }} 
                              className="h-12 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black uppercase text-[8px] tracking-widest px-1"
                            >
                              Reject
                            </Button>
                         </div>
                      </div>
                    )}
                 </ScrollArea>
                 <div className="p-8 border-t border-white/10 flex gap-3">
                    <Button onClick={() => setSelectedProofUrl(null)} variant="ghost" className="flex-1 h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white font-black uppercase text-[8px] tracking-widest">
                      Close Terminal
                    </Button>
                 </div>
              </div>
           </div>
        </DialogContent>
      </Dialog>

      {txForPrint && (
        <div id="printable-receipt">
          <div style={{ textAlign: 'center', marginBottom: '15px', borderBottom: '2px solid black', paddingBottom: '10px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '900', margin: '0', letterSpacing: '-1px' }}>ABDI PRATAMA PPOB</h2>
            <p style={{ fontSize: '10px', margin: '3px 0', fontWeight: 'bold', textTransform: 'uppercase' }}>Operational Node</p>
          </div>
          
          <div style={{ fontSize: '11px', lineHeight: '1.6', fontFamily: 'monospace' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>ORDER_ID:</span>
              <span style={{ fontWeight: 'bold' }}>#{txForPrint.id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>DATE:</span>
              <span>{txForPrint.timestamp.toLocaleDateString('id-ID')}</span>
            </div>
            <div style={{ borderBottom: '1px dashed black', margin: '8px 0' }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>PRODUCT:</span>
              <span style={{ textAlign: 'right', fontWeight: 'bold' }}>{txForPrint.product}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>TARGET:</span>
              <span style={{ fontWeight: 'bold' }}>{txForPrint.target}</span>
            </div>
            
            <div style={{ borderBottom: '1px dashed black', margin: '8px 0' }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '900' }}>
              <span>TOTAL:</span>
              <span>Rp {txForPrint.amount.toLocaleString()}</span>
            </div>
            
            <div style={{ borderBottom: '1px dashed black', margin: '8px 0' }}></div>
            
            <div style={{ textAlign: 'center', wordBreak: 'break-all', marginTop: '8px' }}>
              <span style={{ fontSize: '9px', fontWeight: 'bold' }}>SN:</span><br/>
              <span style={{ fontWeight: '900', fontSize: '12px', background: '#000', color: '#fff', padding: '1px 6px' }}>{txForPrint.sn || 'VERIFIED'}</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '10px', borderTop: '2px solid black' }}>
            <p style={{ fontSize: '12px', fontWeight: '900', margin: '0', letterSpacing: '1px' }}>THANKS_OPERATOR</p>
          </div>
        </div>
      )}
    </div>
  );
}
