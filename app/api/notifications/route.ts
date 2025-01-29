import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PropertyNotification } from '@/types/saved-features';

export async function GET(req: Request) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get('unread') === 'true';

    let query = supabase
      .from('property_notifications')
      .select(`
        *,
        property:property_id(*)
      `)
      .order('created_at', { ascending: false });

    if (unreadOnly) {
      query = query.eq('read', false);
    }

    const { data: notifications, error } = await query;

    if (error) throw error;

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const data: Omit<PropertyNotification, 'id' | 'createdAt'> = await req.json();

    const { data: notification, error } = await supabase
      .from('property_notifications')
      .insert([data])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const data = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    const { data: notification, error } = await supabase
      .from('property_notifications')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}
