import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Partner } from '@/lib/types/partner';

interface PartnerCardProps {
  partner: Partner;
}

export function PartnerCard({ partner }: PartnerCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="relative h-12 mb-4">
          <Image
            src={partner.logo}
            alt={partner.name}
            fill
            className="object-contain"
          />
        </div>
        <h3 className="text-lg font-semibold mb-2">{partner.name}</h3>
        <p className="text-sm text-gray-600 mb-4">{partner.description}</p>
        <div className="text-sm text-gray-500">
          <p>Contact: {partner.contact}</p>
          <p>Website: {partner.website}</p>
        </div>
      </CardContent>
    </Card>
  );
}