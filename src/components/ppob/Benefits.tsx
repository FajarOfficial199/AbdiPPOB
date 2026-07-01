
import { Zap, ShieldCheck, Clock, Headphones } from 'lucide-react';

const benefits = [
  { icon: <Zap className="text-primary" />, title: 'Instan & Otomatis', desc: 'Sistem otomatis memproses pesanan Anda dalam hitungan detik.' },
  { icon: <ShieldCheck className="text-accent" />, title: 'Keamanan Terjamin', desc: 'Transaksi aman dengan sistem enkripsi tingkat lanjut.' },
  { icon: <Clock className="text-primary" />, title: '24/7 Nonstop', desc: 'Layanan kami tersedia setiap hari untuk memenuhi kebutuhan Anda.' },
  { icon: <Headphones className="text-accent" />, title: 'CS Responsif', desc: 'Tim support kami siap membantu kapanpun Anda butuhkan.' },
];

export function Benefits() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-black text-foreground">Mengapa Memilih Kami?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Kami memberikan solusi PPOB terlengkap dengan harga bersaing dan pelayanan terbaik di Indonesia.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {benefits.map((b, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 space-y-4 group">
              <div className="p-4 rounded-2xl bg-secondary group-hover:scale-110 transition-transform">
                {b.icon}
              </div>
              <h3 className="font-bold text-lg">{b.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
