import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { PropertyAlert } from '@/types/alerts';

export const dynamic = 'force-dynamic';

async function processInstantAlerts(supabase: any) {
  const { data: alerts, error: alertsError } = await supabase
    .from('property_alerts')
    .select('*')
    .eq('enabled', true)
    .eq('frequency', 'instant');

  if (alertsError) {
    console.error('Error fetching instant alerts:', alertsError);
    return;
  }

  for (const alert of alerts as PropertyAlert[]) {
    await processAlert(supabase, alert);
  }
}

async function processDailyAlerts(supabase: any) {
  const { data: alerts, error: alertsError } = await supabase
    .from('property_alerts')
    .select('*')
    .eq('enabled', true)
    .eq('frequency', 'daily')
    .lt('last_notified_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  if (alertsError) {
    console.error('Error fetching daily alerts:', alertsError);
    return;
  }

  for (const alert of alerts as PropertyAlert[]) {
    await processAlert(supabase, alert);
  }
}

async function processWeeklyAlerts(supabase: any) {
  const { data: alerts, error: alertsError } = await supabase
    .from('property_alerts')
    .select('*')
    .eq('enabled', true)
    .eq('frequency', 'weekly')
    .lt('last_notified_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  if (alertsError) {
    console.error('Error fetching weekly alerts:', alertsError);
    return;
  }

  for (const alert of alerts as PropertyAlert[]) {
    await processAlert(supabase, alert);
  }
}

async function processAlert(supabase: any, alert: PropertyAlert) {
  // Build the query based on alert criteria
  let query = supabase
    .from('properties')
    .select('*')
    .eq('status', 'available')
    .gt('created_at', alert.last_notified_at || alert.created_at);

  if (alert.property_type?.length) {
    query = query.in('property_type', alert.property_type);
  }

  if (alert.min_price) {
    query = query.gte('price', alert.min_price);
  }

  if (alert.max_price) {
    query = query.lte('price', alert.max_price);
  }

  if (alert.min_bedrooms) {
    query = query.gte('bedrooms', alert.min_bedrooms);
  }

  if (alert.min_bathrooms) {
    query = query.gte('bathrooms', alert.min_bathrooms);
  }

  if (alert.min_area_sqm) {
    query = query.gte('area_sqm', alert.min_area_sqm);
  }

  if (alert.location) {
    // Add location-based filtering using PostGIS
    // This is a simplified version - you might want to use actual PostGIS functions
    const { latitude, longitude, radius } = alert.location;
    query = query.raw(`
      ST_DWithin(
        ST_MakePoint(longitude, latitude)::geography,
        ST_MakePoint(${longitude}, ${latitude})::geography,
        ${radius * 1000}
      )
    `);
  }

  const { data: matchingProperties, error: propertiesError } = await query;

  if (propertiesError) {
    console.error('Error fetching matching properties:', propertiesError);
    return;
  }

  if (!matchingProperties.length) {
    // Update last_notified_at even if no matches found
    await supabase
      .from('property_alerts')
      .update({ last_notified_at: new Date().toISOString() })
      .eq('id', alert.id);
    return;
  }

  // Create notifications for matching properties
  const notifications = matchingProperties.map((property: any) => ({
    alert_id: alert.id,
    user_id: alert.user_id,
    property_id: property.id,
    status: 'pending',
  }));

  const { error: notificationError } = await supabase
    .from('alert_notifications')
    .insert(notifications);

  if (notificationError) {
    console.error('Error creating notifications:', notificationError);
    return;
  }

  // Update last_notified_at
  await supabase
    .from('property_alerts')
    .update({ last_notified_at: new Date().toISOString() })
    .eq('id', alert.id);
}

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Process alerts based on their frequency
    await Promise.all([
      processInstantAlerts(supabase),
      processDailyAlerts(supabase),
      processWeeklyAlerts(supabase),
    ]);

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error processing alerts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
