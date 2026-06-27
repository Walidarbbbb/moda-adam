import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { StoreProvider } from '@/lib/store';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import DemoBanner from '@/components/DemoBanner';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'Moda Adam — Mayorista', template: '%s · Moda Adam' },
  description: 'Distribución textil al por mayor. Crevillent, Alicante.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="flex min-h-screen flex-col bg-white">
        <StoreProvider>
          <DemoBanner />
          <Header />
          <main className="flex-1">{children}</main>
          <CartDrawer />
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
