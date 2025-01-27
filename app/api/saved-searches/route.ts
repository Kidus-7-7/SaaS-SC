import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SavedSearch } from '@/types/saved-features';

export async function GET(req: Request) {
  try {
    const supabase = createClient();
    const { data: savedSearches, error } = await supabase
      .from('saved_searches')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(savedSearches);
  } catch (error) {
    console.error('Error fetching saved searches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved searches' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const data: Omit<SavedSearch, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = await req.json();

    const { data: savedSearch, error } = await supabase
      .from('saved_searches')
      .insert([data])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(savedSearch);
  } catch (error) {
    console.error('Error creating saved search:', error);
    return NextResponse.json(
      { error: 'Failed to create saved search' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Search ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('saved_searches')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting saved search:', error);
    return NextResponse.json(
      { error: 'Failed to delete saved search' },
      { status: 500 }
    );
  }
}
