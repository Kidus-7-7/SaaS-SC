import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Building2, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Agent } from '@/lib/types';

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-48 h-48">
            <Image
              src={agent.image}
              alt={agent.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6 flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{agent.name}</h3>
                <p className="text-sm text-gray-500">{agent.agency}</p>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm font-medium">{agent.rating}</span>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-2" />
                {agent.location}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Building2 className="h-4 w-4 mr-2" />
                {agent.experience} years experience
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                {agent.availability}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {agent.specialties.map((specialty) => (
                <Badge key={specialty} variant="secondary">
                  {specialty}
                </Badge>
              ))}
            </div>

            <div className="mt-6">
              <Button asChild className="w-full">
                <Link href={`/agents/${agent.id}`}>View Profile</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}