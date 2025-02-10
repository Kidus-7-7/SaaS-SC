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
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body suppressHydrationWarning>
        <div className={inter.className}>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1 w-full">{children}</main>
            <ProvidersWrapper />
          </div>
        </div>
      </body>
    </html>
  );
}