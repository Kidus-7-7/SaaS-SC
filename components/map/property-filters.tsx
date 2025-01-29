'use client';

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";

type PropertyType = "commercial" | "all" | "apartment" | "villa" | "house" | "land";

interface PropertyFiltersProps {
  onFilterChange: (filters: {
    propertyType: PropertyType;
    priceRange: { min: number; max: number };
    bedrooms: string;
  }) => void;
}

export function PropertyFilters({ onFilterChange }: PropertyFiltersProps) {
  const [filters, setFilters] = useState<{
    propertyType: PropertyType;
    priceRange: { min: number; max: number };
    bedrooms: string;
  }>({
    propertyType: 'all',
    priceRange: { min: 0, max: 10000000 },
    bedrooms: 'all'
  });

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border mb-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Property Type</label>
          <Select
            value={filters.propertyType}
            onValueChange={(value) => handleFilterChange('propertyType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="land">Land</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Min Price (ETB)</label>
          <Input
            type="number"
            value={filters.priceRange.min}
            onChange={(e) => handleFilterChange('priceRange', {
              ...filters.priceRange,
              min: Number(e.target.value)
            })}
            placeholder="Min price"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Max Price (ETB)</label>
          <Input
            type="number"
            value={filters.priceRange.max}
            onChange={(e) => handleFilterChange('priceRange', {
              ...filters.priceRange,
              max: Number(e.target.value)
            })}
            placeholder="Max price"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Bedrooms</label>
          <Select
            value={filters.bedrooms}
            onValueChange={(value) => handleFilterChange('bedrooms', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select bedrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
