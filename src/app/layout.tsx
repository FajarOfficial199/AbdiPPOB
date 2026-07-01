
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { EmailWidget } from '@/components/ppob/EmailWidget';
import { LiveChatWidget } from '@/components/ppob/LiveChatWidget';

export const metadata: Metadata = {
  title: 'Abdi Pratama PPOB - Payment Point Online Bank',
  description: 'Website PPOB Profesional terlengkap dan terpercaya.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        {children}
        <LiveChatWidget />
        <EmailWidget />
        <Toaster />
      </body>
    </html>
  );
}
