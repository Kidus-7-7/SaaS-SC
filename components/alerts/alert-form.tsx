import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PropertyAlert, AlertFrequency } from '@/types/alerts';

const alertFormSchema = z.object({
  name: z.string().min(1, 'Alert name is required'),
  property_type: z.array(z.string()).optional(),
  min_price: z.number().optional(),
  max_price: z.number().optional(),
  min_bedrooms: z.number().optional(),
  min_bathrooms: z.number().optional(),
  min_area_sqm: z.number().optional(),
  frequency: z.enum(['instant', 'daily', 'weekly'] as const),
  enabled: z.boolean().default(true),
});

type AlertFormProps = {
  initialData?: Partial<PropertyAlert>;
  onSubmit: (data: z.infer<typeof alertFormSchema>) => Promise<void>;
};

export function AlertForm({ initialData, onSubmit }: AlertFormProps) {
  const form = useForm<z.infer<typeof alertFormSchema>>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      property_type: initialData?.property_type || [],
      min_price: initialData?.min_price,
      max_price: initialData?.max_price,
      min_bedrooms: initialData?.min_bedrooms,
      min_bathrooms: initialData?.min_bathrooms,
      min_area_sqm: initialData?.min_area_sqm,
      frequency: initialData?.frequency || 'daily',
      enabled: initialData?.enabled ?? true,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: z.infer<typeof alertFormSchema>) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alert Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 2BR Apartment in Bole" {...field} />
              </FormControl>
              <FormDescription>
                Give your alert a descriptive name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alert Frequency</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="instant">Instant</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                  <SelectItem value="weekly">Weekly Digest</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                How often would you like to receive alerts?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="min_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Min price"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="max_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Max price"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="min_bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min Bedrooms</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Bedrooms"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="min_bathrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min Bathrooms</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Bathrooms"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="min_area_sqm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min Area (sqm)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Area"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Alert'}
        </Button>
      </form>
    </Form>
  );
}
