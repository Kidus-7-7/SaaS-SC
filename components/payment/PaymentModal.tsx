'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

const paymentMethods = [
  {
    id: 'chapa',
    name: 'Chapa',
    description: 'Pay with your bank account or mobile money',
  },
  {
    id: 'telebirr',
    name: 'Telebirr',
    description: 'Pay with your Telebirr account',
  },
  {
    id: 'apollo',
    name: 'Apollo',
    description: 'Pay with your Apollo wallet',
  },
];

interface PaymentModalProps {
  plan: {
    name: string;
    price: number;
  };
  onClose: () => void;
}

export function PaymentModal({ plan, onClose }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast({
        title: 'Error',
        description: 'Please select a payment method',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Initialize payment based on selected method
      let paymentResponse;

      switch (selectedMethod) {
        case 'chapa':
          paymentResponse = await initiateChapaPayment();
          break;
        case 'telebirr':
          paymentResponse = await initiateTelebirrPayment();
          break;
        case 'apollo':
          paymentResponse = await initiateApolloPayment();
          break;
      }

      // Redirect to payment gateway
      if (paymentResponse?.redirectUrl) {
        window.location.href = paymentResponse.redirectUrl;
      }
    } catch (error) {
      toast({
        title: 'Payment Error',
        description: 'Failed to initiate payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const initiateChapaPayment = async () => {
    // Implement Chapa payment integration
    // Documentation: https://developer.chapa.co/docs/
    const response = await fetch('/api/payments/chapa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: plan.price,
        currency: 'ETB',
        email: 'customer@example.com', // Get from user context
        first_name: 'John', // Get from user context
        last_name: 'Doe', // Get from user context
        tx_ref: `${Date.now()}`, // Generate unique reference
        callback_url: `${window.location.origin}/api/payments/chapa/callback`,
        return_url: `${window.location.origin}/dashboard`,
      }),
    });

    return response.json();
  };

  const initiateTelebirrPayment = async () => {
    // Implement Telebirr payment integration
    const response = await fetch('/api/payments/telebirr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: plan.price,
        nonce: `${Date.now()}`,
        notifyUrl: `${window.location.origin}/api/payments/telebirr/notify`,
        returnUrl: `${window.location.origin}/dashboard`,
      }),
    });

    return response.json();
  };

  const initiateApolloPayment = async () => {
    // Implement Apollo payment integration
    const response = await fetch('/api/payments/apollo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: plan.price,
        currency: 'ETB',
        description: `Subscription to ${plan.name} plan`,
        returnUrl: `${window.location.origin}/dashboard`,
      }),
    });

    return response.json();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Subscribe to {plan.name}</DialogTitle>
          <DialogDescription>
            Choose your preferred payment method to complete the subscription
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select onValueChange={setSelectedMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.id} value={method.id}>
                    <div className="flex flex-col">
                      <span>{method.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {method.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="text"
              value={`ETB ${plan.price}`}
              disabled
              className="bg-muted"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handlePayment} disabled={loading}>
            {loading ? 'Processing...' : 'Pay Now'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
