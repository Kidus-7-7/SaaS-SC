'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

export default function SellPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [useAgent, setUseAgent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const propertyData = Object.fromEntries(formData.entries());

      // Validate required fields
      const requiredFields = ['title', 'description', 'price', 'property_type', 'listing_type'];
      const missingFields = requiredFields.filter(field => !propertyData[field]);
      
      if (missingFields.length > 0) {
        toast({
          title: 'Missing Required Fields',
          description: `Please fill in: ${missingFields.join(', ')}`,
          variant: 'destructive',
        });
        return;
      }

      // Upload images
      const imageUrls = [];
      for (const image of images) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(fileName);
        
        imageUrls.push(publicUrl);
      }

      // Create property listing
      const { error } = await supabase
        .from('properties')
        .insert({
          ...propertyData,
          images: imageUrls,
          status: 'pending',
        });

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Your property listing has been submitted for review.',
      });

      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit property listing. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">List Your Property</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <Label>Listing Type</Label>
          <Select name="listing_type" required>
            <SelectTrigger>
              <SelectValue placeholder="Select listing type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sale">For Sale</SelectItem>
              <SelectItem value="rent">For Rent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Property Type</Label>
          <Select name="property_type" required>
            <SelectTrigger>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="land">Land</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Title</Label>
          <Input name="title" placeholder="Property Title" required />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            name="description"
            placeholder="Describe your property"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Price (ETB)</Label>
            <Input name="price" type="number" required />
          </div>
          <div className="space-y-2">
            <Label>Area (sqm)</Label>
            <Input name="area_sqm" type="number" required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Bedrooms</Label>
            <Input name="bedrooms" type="number" />
          </div>
          <div className="space-y-2">
            <Label>Bathrooms</Label>
            <Input name="bathrooms" type="number" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Address</Label>
          <Input name="address" placeholder="Property Address" required />
        </div>

        <div className="space-y-2">
          <Label>City</Label>
          <Input name="city" placeholder="City" required />
        </div>

        <div className="space-y-2">
          <Label>Images</Label>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              setImages(files);
            }}
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <Input
              type="checkbox"
              checked={useAgent}
              onChange={(e) => setUseAgent(e.target.checked)}
            />
            <span>Use an Agent</span>
          </Label>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Listing'}
        </Button>
      </form>
    </div>
  );
}
