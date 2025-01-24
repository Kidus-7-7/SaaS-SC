import { AgentList } from '@/components/agents/agent-list';
import { AgentFilters } from '@/components/agents/agent-filters';

export default function FindAgentPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Find an Agent</h1>
            <p className="mt-2 text-gray-600">
              Connect with experienced real estate agents in Ethiopia
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <AgentFilters />
            </div>
            <div className="lg:col-span-3">
              <AgentList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}