import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;
const CHAPA_API_URL = 'https://api.chapa.co/v1/transaction/initialize';

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const supabase = createRouteHandlerClient({ cookies });

    // Get user from session
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Initialize Chapa payment
    const response = await fetch(CHAPA_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: json.amount,
        currency: 'ETB',
        email: user.email,
        first_name: json.first_name,
        last_name: json.last_name,
        tx_ref: json.tx_ref,
        callback_url: json.callback_url,
        return_url: json.return_url,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Payment initialization failed');
    }

    // Store payment attempt in database
    await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        amount: json.amount,
        provider: 'chapa',
        status: 'pending',
        transaction_ref: json.tx_ref,
      });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tx_ref = searchParams.get('tx_ref');
    const status = searchParams.get('status');

    const supabase = createRouteHandlerClient({ cookies });

    // Update payment status in database
    if (tx_ref) {
      await supabase
        .from('payments')
        .update({ status: status === 'success' ? 'completed' : 'failed' })
        .eq('transaction_ref', tx_ref);
    }

    // Redirect to appropriate page
    return NextResponse.redirect(
      new URL(
        status === 'success' ? '/dashboard' : '/payment-failed',
        request.url
      )
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
