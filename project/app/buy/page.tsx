import { PropertyGrid } from '@/components/properties/property-grid';
import { PropertyFilters } from '@/components/properties/property-filters';
import { PropertyMap } from '@/components/properties/property-map';

export default function BuyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Properties for Sale</h1>
        
        {/* Map Section */}
        <div className="h-[400px] mb-8 rounded-lg overflow-hidden">
          <PropertyMap />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <PropertyFilters />
          </div>

          {/* Property Grid */}
          <div className="lg:col-span-3">
            <PropertyGrid type="buy" />
          </div>
        </div>
      </div>
    </div>
  );
}