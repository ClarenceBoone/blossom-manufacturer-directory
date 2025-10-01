'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currentUser, userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const priceId = searchParams.get('priceId');
  const planName = searchParams.get('plan');

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  const handleCheckout = async () => {
    if (!currentUser || !userData) {
      router.push('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          planName,
          userId: currentUser.uid,
          email: userData.email,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Error creating checkout session:', err);
      setError('Failed to create checkout session');
      setLoading(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-16 pt-32">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Complete Your Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-2">You selected:</p>
                <p className="text-xl font-bold capitalize">{planName} Plan</p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <Button
                className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redirecting to checkout...
                  </>
                ) : (
                  'Proceed to Payment'
                )}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/pricing')}
                disabled={loading}
              >
                Back to Pricing
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
