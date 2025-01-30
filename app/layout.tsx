import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';
import { ProvidersWrapper } from '@/components/providers/providers-wrapper';

const inter = Inter({ subsets: ['latin'] });

const Navigation = dynamic(
  () => import('@/components/layout/Navigation').then((mod) => mod.default),
  {
    ssr: true,
  }
);

export const metadata: Metadata = {
  title: 'Real Estate Platform',
  description: 'Find your dream property in Ethiopia',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main>{children}</main>
        <ProvidersWrapper />
      </body>
    </html>
  );
}