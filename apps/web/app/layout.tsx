import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/ui/Sidebar';

const inter = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  weight: ['300','400','500','600','700','800'],
});

export const metadata: Metadata = {
  title: 'NFe Wizard — Coletor de XMLs Fiscais',
  description: 'Sistema interno para automatizar download e organização de XMLs fiscais de empresas brasileiras.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        <Sidebar />
        <main
          className="min-h-screen"
          style={{ marginLeft: 'var(--sidebar-width)', padding: '32px 40px 48px' }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
