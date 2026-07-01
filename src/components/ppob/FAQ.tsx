
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "Apakah perlu daftar akun untuk membeli?", a: "Tidak perlu. Abdi Pratama PPOB menggunakan sistem Guest Checkout yang memudahkan pelanggan untuk langsung bertransaksi tanpa ribet login." },
  { q: "Berapa lama proses verifikasi pembayaran?", a: "Proses verifikasi manual biasanya memakan waktu 1-5 menit setelah bukti pembayaran diunggah. Kami berupaya semaksimal mungkin untuk kecepatan transaksi Anda." },
  { q: "Bagaimana jika nomor yang saya masukkan salah?", a: "Mohon pastikan nomor tujuan benar sebelum membayar. Transaksi yang sudah sukses diproses provider tidak dapat dibatalkan atau direfund." },
  { q: "Apa saja metode pembayaran yang tersedia?", a: "Saat ini kami mendukung pembayaran via QRIS yang bisa di-scan melalui aplikasi E-Wallet (DANA, OVO, GoPay, ShopeePay) maupun Mobile Banking." },
  { q: "Kemana saya harus melapor jika ada kendala?", a: "Jika Anda mengalami kendala transaksi atau ingin melaporkan masalah, silakan hubungi kami melalui email resmi kami di muhammadabdikapratama7@gmail.com." },
];

export function FAQ() {
  return (
    <section id="faq" className="container mx-auto px-4 py-20">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-10">Tanya Jawab (FAQ)</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-semibold">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
