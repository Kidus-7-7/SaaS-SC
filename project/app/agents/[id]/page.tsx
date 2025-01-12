'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Building2, Clock, Mail, Phone } from 'lucide-react';
import { agents } from '@/lib/data/agents';
import Image from 'next/image';

// Add generateStaticParams function
export function generateStaticParams() {
  return agents.map((agent) => ({
    id: agent.id.toString(),
  }));
}

export default function AgentDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const agent = agents.find(a => a.id === parseInt(params.id));

  if (!agent) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="relative w-full md:w-64 h-64">
                <Image
                  src={agent.image}
                  alt={agent.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold">{agent.name}</h1>
                    <p className="text-gray-500">{agent.agency}</p>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">{agent.rating}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    {agent.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Building2 className="h-5 w-5 mr-2" />
                    {agent.experience} years experience
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-2" />
                    {agent.availability}
                  </div>
                </div>

                <div className="mt-6">
                  <h2 className="font-semibold mb-2">Specialties</h2>
                  <div className="flex flex-wrap gap-2">
                    {agent.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {agent.bio && (
                  <div className="mt-6">
                    <h2 className="font-semibold mb-2">About</h2>
                    <p className="text-gray-600">{agent.bio}</p>
                  </div>
                )}

                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  {agent.email && (
                    <Button className="flex items-center" asChild>
                      <a href={`mailto:${agent.email}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Email Agent
                      </a>
                    </Button>
                  )}
                  {agent.phone && (
                    <Button variant="outline" className="flex items-center" asChild>
                      <a href={`tel:${agent.phone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        {agent.phone}
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}