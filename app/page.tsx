import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/search-bar';
import { FeaturedProperties } from '@/components/featured-properties';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] sm:h-[600px] flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
            Find Your Dream Home in Ethiopia
          </h1>
          <p className="text-lg sm:text-xl text-white mb-6 sm:mb-8">
            Search properties for sale and rent across Ethiopia
          </p>
          <div className="w-full max-w-2xl mx-auto">
            <SearchBar />
          </div>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/buy">Buy</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link href="/rent">Rent</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            Featured Properties
          </h2>
          <FeaturedProperties />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Buy Property</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                Find and buy your perfect property with our extensive listings
              </p>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/buy">Browse Properties</Link>
              </Button>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Rent Property</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                Discover rental properties that match your needs
              </p>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/rent">View Rentals</Link>
              </Button>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Sell Property</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                List your property and reach thousands of potential buyers
              </p>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/sell">List Property</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
            Ready to Find Your Perfect Home?
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their dream properties through our platform
          </p>
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}