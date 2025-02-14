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
import { Icons } from '@/components/ui/icons';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export default function SellPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [useAgent, setUseAgent] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);

    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setImageUrls(urls);
  };

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
      const uploadedUrls = [];
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
        
        uploadedUrls.push(publicUrl);
      }

      // Create property listing
      const { error } = await supabase
        .from('properties')
        .insert({
          ...propertyData,
          images: uploadedUrls,
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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-12 lg:py-24 border-b">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              List Your Property
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Reach thousands of potential buyers or tenants
            </p>
          </div>
        </div>
      </section>

      <div className="container px-4 md:px-6 py-8 md:py-12">
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="listing_type">Listing Type</Label>
                    <Select name="listing_type" required>
                      <SelectTrigger id="listing_type">
                        <SelectValue placeholder="Select listing type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">For Sale</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="property_type">Property Type</Label>
                    <Select name="property_type" required>
                      <SelectTrigger id="property_type">
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter a descriptive title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your property in detail"
                    className="min-h-[150px]"
                    required
                  />
                </div>
              </div>

              {/* Property Details */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Property Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (ETB)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="1000"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area_sqm">Area (sqm)</Label>
                    <Input
                      id="area_sqm"
                      name="area_sqm"
                      type="number"
                      min="0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      name="bedrooms"
                      type="number"
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      name="bathrooms"
                      type="number"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Location</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Enter property address"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="Enter city"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Property Images</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="images"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-700 dark:border-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Icons.upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG or JPEG (MAX. 800x400px)
                        </p>
                      </div>
                      <Input
                        id="images"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageChange}
                        required
                      />
                    </label>
                  </div>

                  {imageUrls.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative aspect-[4/3]">
                          <Image
                            src={url}
                            alt={`Preview ${index + 1}`}
                            fill
                            className="object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                            onClick={() => {
                              const newImages = [...images];
                              const newUrls = [...imageUrls];
                              newImages.splice(index, 1);
                              newUrls.splice(index, 1);
                              setImages(newImages);
                              setImageUrls(newUrls);
                            }}
                          >
                            <Icons.close className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Agent Option */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input
                    id="use_agent"
                    type="checkbox"
                    className="w-4 h-4"
                    checked={useAgent}
                    onChange={(e) => setUseAgent(e.target.checked)}
                  />
                  <Label htmlFor="use_agent">Use an Agent</Label>
                </div>
                {useAgent && (
                  <p className="text-sm text-muted-foreground">
                    An agent will be assigned to help you with your listing
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full md:w-auto"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Listing'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
