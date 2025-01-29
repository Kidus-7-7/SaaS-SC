import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PropertyComparison } from '@/types/saved-features';

export async function GET(req: Request) {
  try {
    const supabase = createClient();
    const { data: comparisons, error } = await supabase
      .from('property_comparisons')
      .select(`
        *,
        properties:property_ids(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(comparisons);
  } catch (error) {
    console.error('Error fetching comparisons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comparisons' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const data: Omit<PropertyComparison, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = await req.json();

    const { data: comparison, error } = await supabase
      .from('property_comparisons')
      .insert([data])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(comparison);
  } catch (error) {
    console.error('Error creating comparison:', error);
    return NextResponse.json(
      { error: 'Failed to create comparison' },
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
        { error: 'Comparison ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('property_comparisons')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting comparison:', error);
    return NextResponse.json(
      { error: 'Failed to delete comparison' },
      { status: 500 }
    );
  }
}
