import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const TELEBIRR_APP_ID = process.env.TELEBIRR_APP_ID;
const TELEBIRR_APP_KEY = process.env.TELEBIRR_APP_KEY;
const TELEBIRR_PUBLIC_KEY = process.env.TELEBIRR_PUBLIC_KEY;
const TELEBIRR_API_URL = process.env.TELEBIRR_API_URL;

export async function POST(request: Request) {
  try {
    // Check if this is a webhook notification
    const signature = request.headers.get('x-telebirr-signature');
    if (signature) {
      return handleWebhook(request, signature);
    }

    // Otherwise, handle payment initialization
    return handlePaymentInitialization(request);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

async function handlePaymentInitialization(request: Request) {
  if (!TELEBIRR_API_URL || !TELEBIRR_APP_ID || !TELEBIRR_APP_KEY) {
    throw new Error('Missing required Telebirr configuration');
  }

  const json = await request.json();
  const supabase = createRouteHandlerClient({ cookies });

  // Get user from session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Generate unique order number
  const outTradeNo = `TB${Date.now()}${Math.random().toString(36).substring(2, 7)}`;

  // Prepare payment request data
  const requestData = {
    appId: TELEBIRR_APP_ID,
    nonce: json.nonce,
    notifyUrl: json.notifyUrl,
    outTradeNo,
    receiveName: 'Your Company Name',
    returnUrl: json.returnUrl,
    shortCode: 'YOUR_SHORT_CODE',
    subject: 'Subscription Payment',
    timeoutExpress: '30',
    timestamp: Math.floor(Date.now() / 1000).toString(),
    totalAmount: json.amount.toString(),
  };

  // Sign the request
  const signature = generateTelebirrSignature(requestData);

  // Encrypt the request
  const encryptedRequest = encryptRequest({
    ...requestData,
    sign: signature,
  });

  // Make request to Telebirr API
  const response = await fetch(TELEBIRR_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      appId: TELEBIRR_APP_ID,
      sign: signature,
      ussd: encryptedRequest,
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
      provider: 'telebirr',
      status: 'pending',
      transaction_ref: outTradeNo,
    });

  return NextResponse.json(data);
}

async function handleWebhook(request: Request, signature: string) {
  const json = await request.json();
  const supabase = createRouteHandlerClient({ cookies });

  // Verify signature
  const isValidSignature = verifyTelebirrSignature(json, signature);

  if (!isValidSignature) {
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Update payment status
  await supabase
    .from('payments')
    .update({
      status: json.trade_status === 'SUCCESS' ? 'completed' : 'failed',
      provider_transaction_id: json.trade_no,
    })
    .eq('transaction_ref', json.out_trade_no);

  return NextResponse.json({ code: '0', message: 'success' });
}

function generateTelebirrSignature(data: any) {
  const sortedParams = Object.keys(data)
    .sort()
    .map(key => `${key}=${data[key]}`)
    .join('&');

  return crypto
    .createHmac('sha256', TELEBIRR_APP_KEY!)
    .update(sortedParams)
    .digest('hex');
}

function encryptRequest(data: any) {
  const publicKey = crypto.createPublicKey(TELEBIRR_PUBLIC_KEY!);
  const buffer = Buffer.from(JSON.stringify(data));
  const encrypted = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    new Uint8Array(Buffer.from(buffer))
  );
  return encrypted.toString('base64');
}

function verifyTelebirrSignature(data: any, signature: string) {
  if (!signature) return false;

  const sortedParams = Object.keys(data)
    .sort()
    .map(key => `${key}=${data[key]}`)
    .join('&');

  const calculatedSignature = crypto
    .createHmac('sha256', TELEBIRR_APP_KEY!)
    .update(sortedParams)
    .digest('hex');

  return signature === calculatedSignature;
}
