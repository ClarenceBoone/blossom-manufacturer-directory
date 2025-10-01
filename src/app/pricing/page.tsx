'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true);
  const { currentUser } = useAuth();
  const router = useRouter();

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for getting started',
      monthlyPrice: 0,
      yearlyPrice: 0,
      stripePriceId: null,
      features: [
        'Access to 10 Manufacturers',
        '1 user seat',
        '2 product uploads',
        'Community support',
        'Basic search filters'
      ]
    },
    {
      name: 'Basic',
      description: 'Perfect for new companies',
      monthlyPrice: 13,
      yearlyPrice: 9,
      stripePriceIdMonthly: 'price_basic_monthly', // Replace with actual Stripe Price ID
      stripePriceIdYearly: 'price_basic_yearly', // Replace with actual Stripe Price ID
      features: [
        'Access to 60 Manufacturers',
        '1 user seat per project',
        '8 product uploads',
        '24/7 support',
        'Google Suite integrations'
      ]
    },
    {
      name: 'Pro',
      description: 'For companies looking to increase production.',
      monthlyPrice: 23,
      yearlyPrice: 16,
      stripePriceIdMonthly: 'price_pro_monthly', // Replace with actual Stripe Price ID
      stripePriceIdYearly: 'price_pro_yearly', // Replace with actual Stripe Price ID
      features: [
        'Access to 300+ manufacturers',
        '3 user seats per project',
        'Unlimited product uploads',
        '24/7 Support',
        'Google Suite integrations'
      ],
      popular: true
    }
  ];

  const handleGetStarted = (plan: typeof plans[0]) => {
    // If user is not logged in, redirect to signup with plan parameter
    if (!currentUser) {
      router.push(`/signup?plan=${plan.name.toLowerCase()}&billing=${isYearly ? 'yearly' : 'monthly'}`);
      return;
    }

    // If Free plan, just redirect to manufacturers
    if (plan.name === 'Free') {
      router.push('/manufacturers');
      return;
    }

    // For paid plans, redirect to checkout
    const priceId = isYearly
      ? (plan as any).stripePriceIdYearly
      : (plan as any).stripePriceIdMonthly;

    router.push(`/checkout?priceId=${priceId}&plan=${plan.name.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose your strategy</h1>
          <p className="text-xl text-gray-600 mb-8">
            From concept to scale, find the plan that works best for your company needs.
          </p>
          
          <div className="flex items-center justify-center mb-8">
            <span className={`mr-3 ${!isYearly ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>Monthly</span>
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={isYearly}
                onChange={() => setIsYearly(!isYearly)}
              />
              <div
                className="w-12 h-6 bg-pink-500 rounded-full flex items-center px-1 cursor-pointer"
                onClick={() => setIsYearly(!isYearly)}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${isYearly ? 'translate-x-6' : ''}`}></div>
              </div>
            </div>
            <span className={`ml-3 ${isYearly ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>Yearly</span>
            <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">Save 15%</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.name} className={`relative ${plan.popular ? 'ring-2 ring-pink-500' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-pink-500 text-white px-4 py-1">Most Popular</Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-gray-600 mt-2">{plan.description}</CardDescription>

                <div className="mt-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold">
                      ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-gray-600 ml-1">/month USD</span>
                  </div>
                  {plan.monthlyPrice > 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      {isYearly
                        ? `Billed Yearly ($${plan.yearlyPrice * 12}/year)`
                        : `Billed Monthly ($${plan.monthlyPrice}/month)`
                      }
                    </p>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <Button
                  className="w-full mb-8 bg-pink-500 hover:bg-pink-600 text-white"
                  onClick={() => handleGetStarted(plan)}
                >
                  Get Started
                </Button>
                
                <ul className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Need a custom plan? We&apos;ve got you covered.
          </p>
          <Button variant="outline">
            Contact Sales
          </Button>
        </div>
      </main>
    </div>
  );
}