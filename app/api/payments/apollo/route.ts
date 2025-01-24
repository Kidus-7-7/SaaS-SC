import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const APOLLO_API_KEY = process.env.APOLLO_API_KEY;
const APOLLO_API_URL = process.env.APOLLO_API_URL;

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const supabase = createRouteHandlerClient({ cookies });

    // Check if environment variables are configured
    if (!APOLLO_API_URL || !APOLLO_API_KEY) {
      return NextResponse.json(
        { error: 'Apollo API configuration is missing' },
        { status: 500 }
      );
    }

    // Get user from session
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate unique transaction reference
    const transactionRef = `AP${Date.now()}${Math.random().toString(36).substring(2, 7)}`;

    // Initialize Apollo payment
    const response = await fetch(APOLLO_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${APOLLO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: json.amount,
        currency: json.currency,
        description: json.description,
        transaction_ref: transactionRef,
        return_url: json.returnUrl,
        customer: {
          email: user.email,
          name: user.user_metadata?.full_name,
        },
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
        provider: 'apollo',
        status: 'pending',
        transaction_ref: transactionRef,
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
    const transactionRef = searchParams.get('transaction_ref');
    const status = searchParams.get('status');

    const supabase = createRouteHandlerClient({ cookies });

    // Check if environment variables are configured
    if (!APOLLO_API_URL || !APOLLO_API_KEY) {
      return NextResponse.json(
        { error: 'Apollo API configuration is missing' },
        { status: 500 }
      );
    }

    // Verify payment status with Apollo
    const response = await fetch(
      `${APOLLO_API_URL}/transactions/${transactionRef}`,
      {
        headers: {
          'Authorization': `Bearer ${APOLLO_API_KEY}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to verify payment');
    }

    // Update payment status in database
    await supabase
      .from('payments')
      .update({
        status: data.status === 'successful' ? 'completed' : 'failed',
        provider_transaction_id: data.provider_transaction_id,
      })
      .eq('transaction_ref', transactionRef);

    // Redirect to appropriate page
    return NextResponse.redirect(
      new URL(
        data.status === 'successful' ? '/dashboard' : '/payment-failed',
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
