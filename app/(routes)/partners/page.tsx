'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; 
import { ArrowRight, Building2, Home, Key, BadgeDollarSign, HardHat, Megaphone } from 'lucide-react';

const partnerTypes = [
  {
    title: "Real Estate Agents & Brokers",
    description: "Join our network of top real estate professionals. Get access to quality leads, advanced tools, and resources to grow your business.",
    icon: Home,
    benefits: [
      "Connect with active buyers and sellers",
      "Access advanced market insights",
      "Premium listing placement",
      "Dedicated support team"
    ]
  },
  {
    title: "Property Managers",
    description: "Streamline your property management with our integrated solutions. Reach quality tenants and simplify operations.",
    icon: Key,
    benefits: [
      "Automated property listings",
      "Tenant screening tools",
      "Maintenance request system",
      "Financial reporting dashboard"
    ]
  },
  {
    title: "Property Owners & Landlords",
    description: "List your properties, screen tenants, and manage your portfolio all in one place.",
    icon: Building2,
    benefits: [
      "Direct tenant applications",
      "Rent payment processing",
      "Property performance analytics",
      "Legal document templates"
    ]
  },
  {
    title: "Lenders & Loan Officers",
    description: "Connect with motivated buyers and expand your lending business through our platform.",
    icon: BadgeDollarSign,
    benefits: [
      "Pre-qualified lead generation",
      "Loan application integration",
      "Rate comparison tools",
      "Mortgage calculator integration"
    ]
  },
  {
    title: "Builders & Developers",
    description: "Showcase your new constructions and developments to millions of potential buyers.",
    icon: HardHat,
    benefits: [
      "New construction showcase",
      "Development progress tracking",
      "Virtual tour integration",
      "Pre-sale management tools"
    ]
  },
  {
    title: "Brands & Advertisers",
    description: "Reach your target audience through our platform with precise targeting and analytics.",
    icon: Megaphone,
    benefits: [
      "Targeted advertising options",
      "Performance analytics",
      "Brand safety controls",
      "Multi-channel campaigns"
    ]
  }
];

export default function PartnersPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-primary/5 py-16 mb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Partner With Us to Transform Real Estate
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Join our network of industry professionals and access cutting-edge tools, 
              quality leads, and resources to grow your business.
            </p>
          </div>
        </div>
      </div>

      {/* Partner Types Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partnerTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`h-full p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedType === type.title ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedType(type.title)}
                >
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{type.title}</h3>
                  <p className="text-gray-600 mb-4">{type.description}</p>
                  <div className="space-y-2">
                    {type.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-primary">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                        <span className="ml-2 text-sm text-gray-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        {selectedType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center"
          >
            <Button
              size="lg"
              className="text-white rounded-lg hover:bg-primary/90 transition-colors"
              onClick={() => {
                console.log(`Partnership application for: ${selectedType}`);
              }}
            >
              Get Started as a Partner
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <p className="mt-4 text-gray-600">
              Join thousands of successful partners growing their business with us
            </p>
          </motion.div>
        )}
      </div>

      {/* Trust Indicators */}
      <div className="bg-gray-50 py-16 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-8">Trusted by Industry Leaders</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Add your partner logos here */}
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
