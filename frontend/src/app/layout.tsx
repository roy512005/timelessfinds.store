import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ClientLayout } from '@/components/layout/ClientLayout';
import QueryProvider from '@/components/providers/QueryProvider';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Timeless Finds | Elevating Everyday Elegance',
  description: 'Premium ethnic wear — Sarees, Kurtis, Lehengas & Boys Ethnic Wear. Handcrafted in India. Free shipping over ₹999.',
  metadataBase: new URL('https://timelessfinds.store'),
  openGraph: {
    title: 'Timeless Finds',
    description: 'Premium ethnic wear — Sarees, Kurtis, Lehengas & more.',
    url: 'https://timelessfinds.store',
    siteName: 'Timeless Finds',
    type: 'website',
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <QueryProvider>
          <ClientLayout>
            <Toaster position="bottom-right" />
            {children}
          </ClientLayout>
        </QueryProvider>
      </body>
    </html>
  );
}
