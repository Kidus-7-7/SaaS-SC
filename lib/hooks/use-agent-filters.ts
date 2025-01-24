'use client';

import { useState } from 'react';
import { Agent } from '@/lib/types';

export interface AgentFilters {
  location: string;
  experienceRange: [number, number];
  specialties: string[];
  minRating: number | null;
}

const initialFilters: AgentFilters = {
  location: '',
  experienceRange: [0, 20],
  specialties: [],
  minRating: null,
};

export function useAgentFilters(agents: Agent[]) {
  const [filters, setFilters] = useState<AgentFilters>(initialFilters);

  const filteredAgents = agents.filter((agent) => {
    const matchesLocation = !filters.location || 
      agent.location.toLowerCase().includes(filters.location.toLowerCase());
    
    const matchesExperience = agent.experience >= filters.experienceRange[0] && 
      agent.experience <= filters.experienceRange[1];
    
    const matchesSpecialties = filters.specialties.length === 0 || 
      filters.specialties.some(s => agent.specialties.includes(s));
    
    const matchesRating = !filters.minRating || 
      agent.rating >= filters.minRating;

    return matchesLocation && matchesExperience && 
           matchesSpecialties && matchesRating;
  });

  return {
    filters,
    setFilters,
    filteredAgents,
  };
}