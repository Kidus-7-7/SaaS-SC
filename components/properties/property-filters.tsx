'use client';

import { FC } from 'react';
import { usePropertyFilters } from '@/lib/hooks/use-property-filters';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  addisAbabaSubCities, 
  popularPropertyTypes, 
  otherPropertyTypes,
  PropertyType,
  PropertyStatus,
  FurnishingStatus
} from '@/lib/types/property';

const PropertyFilters: FC = () => {
  const { filters, setFilters } = usePropertyFilters([], 'rent');

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {/* Price Range */}
        <div className="space-y-2">
          <Label>Price Range (ETB)</Label>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Min Price"
              value={filters.priceRange[0]}
              onChange={(e) => 
                setFilters({ 
                  ...filters, 
                  priceRange: [Number(e.target.value), filters.priceRange[1]] 
                })}
            />
            <Input
              type="number"
              placeholder="Max Price"
              value={filters.priceRange[1]}
              onChange={(e) => 
                setFilters({ 
                  ...filters, 
                  priceRange: [filters.priceRange[0], Number(e.target.value)] 
                })}
            />
          </div>
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <Label>Property Type</Label>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Popular</h4>
              <div className="grid grid-cols-2 gap-2">
                {popularPropertyTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={filters.propertyTypes.includes(type)}
                      onCheckedChange={(checked) => {
                        const newTypes = checked
                          ? [...filters.propertyTypes, type as PropertyType]
                          : filters.propertyTypes.filter(t => t !== type);
                        setFilters({ ...filters, propertyTypes: newTypes });
                      }}
                    />
                    <label htmlFor={type} className="text-sm capitalize">
                      {type.replace('-', ' ')}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Other</h4>
              <div className="grid grid-cols-2 gap-2">
                {otherPropertyTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={filters.propertyTypes.includes(type)}
                      onCheckedChange={(checked) => {
                        const newTypes = checked
                          ? [...filters.propertyTypes, type as PropertyType]
                          : filters.propertyTypes.filter(t => t !== type);
                        setFilters({ ...filters, propertyTypes: newTypes });
                      }}
                    />
                    <label htmlFor={type} className="text-sm capitalize">
                      {type.replace('-', ' ')}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label>Sub City</Label>
          <Select
            value={filters.subCity}
            onValueChange={(value) => setFilters({ ...filters, subCity: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sub city" />
            </SelectTrigger>
            <SelectContent>
              {addisAbabaSubCities.map((subCity) => (
                <SelectItem key={subCity} value={subCity}>
                  {subCity}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Property Size */}
        <div className="space-y-2">
          <Label>Property Size (m²)</Label>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Min Size"
              value={filters.minArea || ''}
              onChange={(e) => 
                setFilters({ ...filters, minArea: Number(e.target.value) || null })}
            />
            <Input
              type="number"
              placeholder="Max Size"
              value={filters.maxArea || ''}
              onChange={(e) => 
                setFilters({ ...filters, maxArea: Number(e.target.value) || null })}
            />
          </div>
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Bedrooms</Label>
            <Select
              value={filters.bedrooms[0]?.toString()}
              onValueChange={(value) => 
                setFilters({ ...filters, bedrooms: [Number(value)] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}+ Beds
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Bathrooms</Label>
            <Select
              value={filters.bathrooms[0]?.toString()}
              onValueChange={(value) => 
                setFilters({ ...filters, bathrooms: [Number(value)] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}+ Baths
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Property Status */}
        <div className="space-y-2">
          <Label>Property Status</Label>
          <Select
            value={filters.propertyStatus || ''}
            onValueChange={(value) => 
              setFilters({ ...filters, propertyStatus: value as PropertyStatus })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newly-built">Newly Built</SelectItem>
              <SelectItem value="old">Old</SelectItem>
              <SelectItem value="renovated">Renovated</SelectItem>
              <SelectItem value="under-construction">Under Construction</SelectItem>
              <SelectItem value="accepting-backup-offers">Accepting Backup Offers</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Additional Features */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="tour"
              checked={filters.hasTour || false}
              onCheckedChange={(checked) => 
                setFilters({ ...filters, hasTour: checked as boolean })}
            />
            <label htmlFor="tour" className="text-sm">3D Tour Available</label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="basement"
              checked={filters.hasBasement || false}
              onCheckedChange={(checked) => 
                setFilters({ ...filters, hasBasement: checked as boolean })}
            />
            <label htmlFor="basement" className="text-sm">Has Basement</label>
          </div>
        </div>

        {/* Parking */}
        <div className="space-y-2">
          <Label>Parking Spots</Label>
          <Select
            value={filters.parkingSpots?.toString() || ''}
            onValueChange={(value) => 
              setFilters({ ...filters, parkingSpots: Number(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}+ Spots
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Furnishing */}
        <div className="space-y-2">
          <Label>Furnishing</Label>
          <Select
            value={filters.furnishing || ''}
            onValueChange={(value) => 
              setFilters({ ...filters, furnishing: value as FurnishingStatus })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="furnished">Furnished</SelectItem>
              <SelectItem value="semi-furnished">Semi-Furnished</SelectItem>
              <SelectItem value="unfurnished">Unfurnished</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Keyword Search */}
        <div className="space-y-2">
          <Label>Keyword Search</Label>
          <Input
            placeholder="Search by keyword..."
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyFilters;