import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with type checking
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
})

export async function GET(request) {
  if (!supabaseUrl || !supabaseKey) {
    return new Response(
      JSON.stringify({ error: 'Supabase credentials not configured' }), 
      { status: 500 }
    )
  }

  try {
    // Your existing GET logic here
    const { data, error } = await supabase
      .from('your_table')
      .select('*')

    if (error) throw error

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 500 }
    )
  }
}

export async function POST(request) {
  if (!supabaseUrl || !supabaseKey) {
    return new Response(
      JSON.stringify({ error: 'Supabase credentials not configured' }), 
      { status: 500 }
    )
  }

  try {
    // Your existing POST logic here
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('your_table')
      .insert([body])

    if (error) throw error

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 500 }
    )
  }
} 