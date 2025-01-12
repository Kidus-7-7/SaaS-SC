import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Building2, Users, Home, Briefcase, Construction, Megaphone } from 'lucide-react';

const partnerTypes = [
  {
    title: "I'm an agent or a broker",
    icon: Users,
    description: "Join our network of professional real estate agents and brokers",
    href: "/partners/agent"
  },
  {
    title: "I'm a property manager",
    icon: Building2,
    description: "Manage multiple properties efficiently through our platform",
    href: "/partners/manager"
  },
  {
    title: "I'm a landlord",
    icon: Home,
    description: "List and manage your rental properties with ease",
    href: "/partners/landlord"
  },
  {
    title: "I'm a lender or loan officer",
    icon: Briefcase,
    description: "Connect with potential borrowers and expand your lending business",
    href: "/partners/lender"
  },
  {
    title: "I'm a builder",
    icon: Construction,
    description: "Showcase your developments and connect with potential buyers",
    href: "/partners/builder"
  },
  {
    title: "I'm a Brand or local Advertiser",
    icon: Megaphone,
    description: "Reach our engaged audience of property seekers",
    href: "/partners/advertiser"
  }
];

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Partner With Us</h1>
          <p className="text-lg text-gray-600">Choose your partnership type to get started</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partnerTypes.map((type) => (
            <Card key={type.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <type.icon className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-semibold">{type.title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{type.description}</p>
                <Button asChild className="w-full">
                  <Link href={type.href}>Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}