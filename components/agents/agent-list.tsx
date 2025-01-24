'use client';

import { AgentCard } from './agent-card';
import { useAgentFilters } from '@/lib/hooks/use-agent-filters';
import { agents } from '@/lib/data/agents';

export function AgentList() {
  const { filteredAgents } = useAgentFilters(agents);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredAgents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}