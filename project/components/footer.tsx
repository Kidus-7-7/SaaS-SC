'use client';

import Link from 'next/link';
import { Home, Smartphone, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Footer() {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
  };

  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <Home className="h-6 w-6 text-primary" />
              <span className="ml-2 text-lg font-bold">Addis Bete</span>
            </Link>
            <p className="text-sm text-gray-600">
              Your trusted real estate platform in Ethiopia
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Properties
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/buy" className="text-sm text-gray-600 hover:text-gray-900">
                  Buy
                </Link>
              </li>
              <li>
                <Link href="/rent" className="text-sm text-gray-600 hover:text-gray-900">
                  Rent
                </Link>
              </li>
              <li>
                <Link href="/sell" className="text-sm text-gray-600 hover:text-gray-900">
                  Sell
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">
                  About
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-gray-600 hover:text-gray-900">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Newsletter
            </h3>
            <p className="mt-4 text-sm text-gray-600">
              Get email updates about our latest properties and special offers
            </p>
            <form onSubmit={handleNewsletterSubmit} className="mt-4">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                  required
                />
                <Button type="submit" size="sm">
                  Subscribe
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Mobile Apps & Copyright */}
        <div className="mt-8 border-t border-gray-200 pt-8">
          <div className="flex items-center justify-between flex-wrap">
            <div>
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} Addis Bete. All rights reserved.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Smartphone className="h-5 w-5 text-gray-400" />
              <p className="text-sm text-gray-600">
                Get our mobile app on iOS and Android
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}