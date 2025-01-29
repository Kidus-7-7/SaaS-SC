import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SavedSearch, PropertyNotification } from '@/types/saved-features';

export async function GET(req: Request) {
  try {
    const supabase = createClient();

    // Get all saved searches that need notification
    const { data: savedSearches, error: searchError } = await supabase
      .from('saved_searches')
      .select('*')
      .or('notification_frequency.eq.daily,notification_frequency.eq.weekly')
      .lt('last_notification_sent', getNotificationThreshold());

    if (searchError) throw searchError;

    for (const search of (savedSearches || [])) {
      // Get new properties matching the search criteria
      const { data: newProperties, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .gte('created_at', search.last_notification_sent)
        .match(buildMatchCriteria(search.filters));

      if (propertyError) throw propertyError;

      // Create notifications for new properties
      for (const property of (newProperties || [])) {
        await supabase
          .from('property_notifications')
          .insert({
            user_id: search.user_id,
            saved_search_id: search.id,
            property_id: property.id,
            type: 'new_property',
            message: `New property matching your search "${search.name}"`,
            read: false
          });
      }

      // Update last notification sent timestamp
      await supabase
        .from('saved_searches')
        .update({ last_notification_sent: new Date().toISOString() })
        .eq('id', search.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error checking saved searches:', error);
    return NextResponse.json(
      { error: 'Failed to check saved searches' },
      { status: 500 }
    );
  }
}

function getNotificationThreshold() {
  const now = new Date();
  const oneDayAgo = new Date(now);
  oneDayAgo.setDate(now.getDate() - 1);
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);
  
  return oneWeekAgo.toISOString();
}

function buildMatchCriteria(filters: SavedSearch['filters']) {
  const criteria: Record<string, any> = {};

  if (filters.propertyType?.length) {
    criteria.property_type = filters.propertyType;
  }

  if (filters.listingType?.length) {
    criteria.listing_type = filters.listingType;
  }

  if (filters.city) {
    criteria.city = filters.city;
  }

  // Add more filter criteria as needed

  return criteria;
}
