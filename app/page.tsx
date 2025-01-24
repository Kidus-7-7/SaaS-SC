import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/search-bar';
import { FeaturedProperties } from '@/components/featured-properties';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Find Your Dream Home in Ethiopia
          </h1>
          <p className="text-xl text-white mb-8">
            Search properties for sale and rent across Ethiopia
          </p>
          <SearchBar />
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/buy">Buy</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/rent">Rent</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Featured Properties
          </h2>
          <FeaturedProperties />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Buy Property</h3>
              <p className="text-gray-600 mb-4">
                Find and buy your perfect property with our extensive listings
              </p>
              <Button asChild variant="outline">
                <Link href="/buy">Learn More</Link>
              </Button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Rent Property</h3>
              <p className="text-gray-600 mb-4">
                Discover rental properties that match your needs
              </p>
              <Button asChild variant="outline">
                <Link href="/rent">Learn More</Link>
              </Button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Find an Agent</h3>
              <p className="text-gray-600 mb-4">
                Connect with experienced real estate agents
              </p>
              <Button asChild variant="outline">
                <Link href="/find-agent">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}