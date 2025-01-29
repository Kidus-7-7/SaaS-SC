import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';

const Navigation = dynamic(() => import('@/components/layout/Navigation'), {
  ssr: true,
});

const ToasterProvider = dynamic(() => import('@/components/providers/toaster-provider').then(mod => mod.ToasterProvider));

const inter = Inter({ subsets: ['latin'] });

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
        <ToasterProvider />
      </body>
    </html>
  );
}