import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

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
        {children}
      </body>
    </html>
  );
}
