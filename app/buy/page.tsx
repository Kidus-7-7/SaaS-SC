// app/buy/page.tsx
'use client';

import { PropertySection } from '@/components/properties/property-section';

export default function BuyPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Properties for Sale</h1>
      <PropertySection type="sale" />
    </main>
  );
}
