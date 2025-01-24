'use client';

import { Suspense, useState } from 'react';
import { PropertyFilters } from '@/components/properties/PropertyFilters';
import { useParams } from 'next/navigation';
import { PropertyList } from '@/components/properties/PropertyList';
import { PropertyMap } from '@/components/properties/PropertyMap';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent as ImportedSheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MapPin, Search, SlidersHorizontal } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function PropertiesPage() {
  const params = useParams();
  const type = params.type as 'buy' | 'rent';
  const [view, setView] = useState<'map' | 'list'>('list');
  const [filters, setFilters] = useState({
    bedrooms: 'any',
    bathrooms: 'any',
    exactMatch: false
  });

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container mx-auto py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search by location, property type, or keyword..." 
                className="pl-10"
              />
            </div>
            <Select defaultValue="price">
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="date">Newest</SelectItem>
                <SelectItem value="beds">Beds</SelectItem>
                <SelectItem value="baths">Baths</SelectItem>
              </SelectContent>
            </Select>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <ImportedSheetContent>
                <PropertyFilters />
              </ImportedSheetContent>
            </Sheet>
            <Button 
              variant={view === 'map' ? 'default' : 'outline'}
              onClick={() => setView(view === 'map' ? 'list' : 'map')}
            >
              {view === 'map' ? 'Show List' : 'Show Map'}
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b bg-muted/50">
        <div className="container mx-auto py-4">
          <div className="flex flex-wrap gap-6">
            {/* Bedrooms Filter */}
            <div className="space-y-2">
              <Label>Number of Bedrooms</Label>
              <Select onValueChange={(value) => handleFilterChange('bedrooms', value)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bathrooms Filter */}
            <div className="space-y-2">
              <Label>Number of Bathrooms</Label>
              <Select onValueChange={(value) => handleFilterChange('bathrooms', value)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="1.5">1.5+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Exact Match Checkbox */}
            <div className="flex items-end gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="exactMatch" 
                  checked={filters.exactMatch}
                  onCheckedChange={(checked) => handleFilterChange('exactMatch', !!checked)}
                />
                <label
                  htmlFor="exactMatch"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Use exact match
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-8">
        {view === 'map' ? (
          <div className="h-[calc(100vh-200px)] rounded-lg overflow-hidden">
            <Suspense fallback={<div>Loading map...</div>}>
              <PropertyMap />
            </Suspense>
          </div>
        ) : (
          <Suspense fallback={<div>Loading properties...</div>}>
            <PropertyList type={type} filters={filters} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
