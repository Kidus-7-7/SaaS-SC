'use client';

import dynamic from 'next/dynamic';

const ToasterProvider = dynamic(
  () => import('@/components/providers/toaster-provider').then((mod) => mod.ToasterProvider),
  { ssr: false }
);

export function ProvidersWrapper() {
  return <ToasterProvider />;
}
