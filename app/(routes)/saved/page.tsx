import { SavedSearchList } from '@/components/saved-searches/saved-search-list';
import { PropertyComparison } from '@/components/comparisons/property-comparison';
import { NotificationCenter } from '@/components/notifications/notification-center';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SavedPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Saved Items</h1>
      
      <Tabs defaultValue="searches" className="space-y-6">
        <TabsList>
          <TabsTrigger value="searches">Saved Searches</TabsTrigger>
          <TabsTrigger value="comparisons">Comparisons</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="searches">
          <SavedSearchList />
        </TabsContent>

        <TabsContent value="comparisons">
          <PropertyComparison />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationCenter />
        </TabsContent>
      </Tabs>
    </div>
  );
}
