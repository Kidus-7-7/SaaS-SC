import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-gray-600">Choose the plan that's right for you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Tier */}
          <Card>
            <CardHeader className="text-center p-6">
              <h3 className="text-2xl font-bold">Free</h3>
              <p className="text-gray-500 mt-2">Basic features for everyone</p>
              <p className="text-3xl font-bold mt-4">$0</p>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Access to broker listings</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Basic search functionality</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Save favorite properties</span>
                </li>
              </ul>
              <Button className="w-full mt-6">Get Started</Button>
            </CardContent>
          </Card>

          {/* Pro Tier */}
          <Card className="border-primary">
            <CardHeader className="text-center p-6 bg-primary text-white rounded-t-lg">
              <h3 className="text-2xl font-bold">Pro</h3>
              <p className="mt-2">Enhanced features for buyers</p>
              <p className="text-3xl font-bold mt-4">$19.99/mo</p>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>All Free features</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Access to direct seller listings</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Advanced search filters</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Priority customer support</span>
                </li>
              </ul>
              <Button className="w-full mt-6" variant="default">Subscribe Now</Button>
            </CardContent>
          </Card>

          {/* Business Tier */}
          <Card>
            <CardHeader className="text-center p-6">
              <h3 className="text-2xl font-bold">Business</h3>
              <p className="text-gray-500 mt-2">For partners and enterprises</p>
              <p className="text-3xl font-bold mt-4">$99.99/mo</p>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>All Pro features</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Partnership benefits</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>API access</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Custom branding options</span>
                </li>
              </ul>
              <Button className="w-full mt-6">Contact Sales</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}