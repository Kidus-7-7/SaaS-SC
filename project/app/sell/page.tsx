import { PropertyForm } from '@/components/properties/property-form';

export default function SellPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">List Your Property</h1>
        <PropertyForm type="sell" />
      </div>
    </div>
  );
}