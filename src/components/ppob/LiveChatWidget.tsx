'use client'
/**
 * @fileOverview Komponen Live Chat Widget yang dirampingkan ukurannya agar lebih proporsional.
 */

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, User, Loader2, ImageIcon, Zap, Sparkles, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { getLiveChatResponse, type LiveChatOutput } from '@/ai/flows/live-chat';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Message {
  role: 'admin' | 'user';
  text?: string;
  image?: string;
  time?: string;
}

export function LiveChatWidget() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'admin', text: 'Halo Kak! Ada yang bisa saya bantu terkait transaksi atau pendaftaran mitra hari ini?', time: '10:00' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => { 
    setMounted(true); 
  }, []);

  useEffect(() => { 
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isOpen, isLoading]);

  const executeCommand = (command: string) => {
    switch (command) {
      case 'NAV_RESELLER_REG':
        router.push('/signup');
        break;
      case 'NAV_RESELLER_DASHBOARD':
      case 'NAV_AFFILIATE_DASHBOARD':
      case 'NAV_WITHDRAW_AFFILIATE':
      case 'NAV_PROFILE':
        window.dispatchEvent(new CustomEvent('nav-view', { detail: 'DASHBOARD' }));
        break;
      case 'NAV_HISTORY':
        window.dispatchEvent(new CustomEvent('nav-view', { detail: 'STATUS' }));
        break;
      case 'NAV_DEPOSIT':
        window.dispatchEvent(new CustomEvent('nav-view', { detail: 'DEPOSIT' }));
        break;
      case 'LOGOUT':
        window.dispatchEvent(new CustomEvent('logout-action'));
        break;
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMessages(prev => [...prev, { role: 'user', text: userMessage, time }]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response: LiveChatOutput = await getLiveChatResponse({ message: userMessage });
      setMessages(prev => [...prev, { role: 'admin', text: response.reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      if (response.command && response.command !== 'NONE') executeCommand(response.command);
    } catch (error) {
      console.error("Live chat error:", error);
      setMessages(prev => [...prev, { role: 'admin', text: 'Maaf Kak, jalur koneksi sedang sibuk. Bisa diulangi?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Image = event.target?.result as string;
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages(prev => [...prev, { role: 'user', image: base64Image, time }]);
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          setMessages(prev => [...prev, { role: 'admin', text: 'Visual Payload diterima. Mohon tunggu sebentar...', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        }, 1000);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-40 right-4 z-[9999]">
      {isOpen ? (
        <div className="bg-white w-[320px] md:w-[400px] h-[550px] rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-500">
          <div className="bg-slate-950 p-6 text-white flex justify-between items-center relative overflow-hidden">
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-white/10 backdrop-blur-3xl shadow-xl">
                <Cpu size={24} className="text-primary animate-pulse" />
              </div>
              <div>
                <h4 className="font-black text-xs uppercase tracking-widest leading-tight italic">AI SUPPORT</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <p className="text-[8px] opacity-70 font-black tracking-widest uppercase">Online 24/7</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="bg-white/5 hover:bg-white/10 p-2 rounded-xl text-white/50 hover:text-white"><X size={20} /></button>
          </div>

          <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6 no-scrollbar bg-slate-50">
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex gap-3 max-w-[90%] animate-in fade-in slide-in-from-bottom-2", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
                <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md", msg.role === 'admin' ? "bg-primary text-white" : "bg-slate-950 text-white")}>
                  {msg.role === 'admin' ? <Zap size={14} /> : <User size={14} />}
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className={cn(
                    "p-4 rounded-2xl text-[11px] font-bold leading-relaxed shadow-sm", 
                    msg.role === 'admin' ? "bg-white text-slate-800 rounded-tl-none border border-slate-100" : "bg-primary text-white rounded-tr-none"
                  )}>
                    {msg.image ? (
                      <div className="relative w-40 h-40 rounded-xl overflow-hidden mb-1 border-2 border-white">
                        <Image src={msg.image} alt="Stream" fill className="object-cover" />
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                  <span className={cn("text-[7px] font-black text-slate-400 uppercase tracking-widest px-2", msg.role === 'user' ? "text-right" : "")}>{msg.time} • OK</span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 animate-in fade-in duration-300">
                <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center"><Cpu size={14} className="animate-spin" /></div>
                <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-2 rounded-tl-none">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2 items-center">
            <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
            <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} className="rounded-xl h-12 w-12 text-slate-400 hover:text-primary transition-all">
              <ImageIcon size={24} />
            </Button>
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Tanya AI..." className="rounded-xl border-slate-200 h-12 text-xs font-bold bg-slate-50 px-5" disabled={isLoading} />
            <Button type="submit" size="icon" className="rounded-xl h-12 w-12 shadow-lg bg-primary hover:bg-primary/90 text-white" disabled={isLoading || !input.trim()}>
              <Send size={18} />
            </Button>
          </form>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="group relative flex items-center justify-center w-12 h-12 bg-slate-950 text-white rounded-2xl shadow-xl hover:scale-105 active:scale-90 transition-all border-2 border-white focus:outline-none z-50">
          <Zap size={22} className="relative z-10 text-primary" />
          <span className="absolute inset-0 rounded-2xl bg-primary animate-ping opacity-20" />
        </button>
      )}
    </div>
  );
}
