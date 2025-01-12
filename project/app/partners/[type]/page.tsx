import { PartnershipForm } from '@/components/partners/partnership-form';
import { notFound } from 'next/navigation';

const validPartnerTypes = [
  'agent',
  'manager',
  'landlord',
  'lender',
  'builder',
  'advertiser'
] as const;

interface PartnerPageProps {
  params: {
    type: string;
  };
}

// Add generateStaticParams function
export function generateStaticParams() {
  return validPartnerTypes.map((type) => ({
    type: type,
  }));
}

export default function PartnerPage({ params }: PartnerPageProps) {
  if (!validPartnerTypes.includes(params.type as any)) {
    notFound();
  }

  const titles = {
    agent: 'Real Estate Agent/Broker Partnership',
    manager: 'Property Manager Partnership',
    landlord: 'Landlord Partnership',
    lender: 'Lender Partnership',
    builder: 'Builder Partnership',
    advertiser: 'Advertiser Partnership'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {titles[params.type as keyof typeof titles]}
        </h1>
        <PartnershipForm type={params.type as keyof typeof titles} />
      </div>
    </div>
  );
}