'use client';

import { useAgentFilters } from '@/lib/hooks/use-agent-filters';
import { agents } from '@/lib/data/agents';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

export function AgentFilters() {
  const { filters, setFilters } = useAgentFilters(agents);
  
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Label>Location</Label>
          <Input 
            placeholder="Enter location..." 
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Years of Experience</Label>
          <Slider
            value={filters.experienceRange}
            max={20}
            step={1}
            onValueChange={(value) => 
              setFilters({ ...filters, experienceRange: value as [number, number] })}
          />
          <div className="text-sm text-gray-500">
            {filters.experienceRange[0]} - {filters.experienceRange[1]} years
          </div>
        </div>

        <div className="space-y-2">
          <Label>Specialties</Label>
          <div className="space-y-2">
            {['Residential', 'Commercial', 'Luxury', 'Investment'].map((specialty) => (
              <div key={specialty} className="flex items-center space-x-2">
                <Checkbox 
                  id={specialty}
                  checked={filters.specialties.includes(specialty)}
                  onCheckedChange={(checked) => {
                    const newSpecialties = checked
                      ? [...filters.specialties, specialty]
                      : filters.specialties.filter(s => s !== specialty);
                    setFilters({ ...filters, specialties: newSpecialties });
                  }}
                />
                <label
                  htmlFor={specialty}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {specialty}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Rating</Label>
          <div className="space-y-2">
            {[5, 4, 3].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox 
                  id={`rating-${rating}`}
                  checked={filters.minRating === rating}
                  onCheckedChange={(checked) => {
                    setFilters({ ...filters, minRating: checked ? rating : null });
                  }}
                />
                <label
                  htmlFor={`rating-${rating}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {rating}+ Stars
                </label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}