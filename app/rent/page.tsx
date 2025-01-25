import { PropertySection } from '@/components/properties/property-section';

export default function RentPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Rental Properties</h1>
        <PropertySection type="rent" />
      </div>
    </div>
  );
}