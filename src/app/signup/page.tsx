'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';

function SignupContent() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    company: '',
    location: '',
    role: 'brand_owner' as const,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup, loginWithGoogle } = useAuth();
  const router = useRouter();

  const selectedPlan = searchParams.get('plan') || 'free';
  const billingCycle = searchParams.get('billing') || 'monthly';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signup(formData.email, formData.password, {
        name: formData.name,
        role: formData.role,
        profile: {
          company: formData.company,
          location: formData.location,
        },
        subscription: {
          plan: selectedPlan as 'free' | 'basic' | 'pro',
          status: 'active',
        },
      });

      // Redirect based on selected plan
      if (selectedPlan === 'free') {
        router.push('/manufacturers');
      } else {
        // Get the appropriate price ID based on plan and billing cycle
        const planPriceIds: Record<string, { monthly: string; yearly: string }> = {
          basic: {
            monthly: 'price_basic_monthly',
            yearly: 'price_basic_yearly',
          },
          pro: {
            monthly: 'price_pro_monthly',
            yearly: 'price_pro_yearly',
          },
        };

        const priceId = planPriceIds[selectedPlan]?.[billingCycle as 'monthly' | 'yearly'];

        if (priceId) {
          router.push(`/checkout?priceId=${priceId}&plan=${selectedPlan}`);
        } else {
          router.push('/pricing');
        }
      }
    } catch (error: unknown) {
      setError((error as Error).message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');

    try {
      await loginWithGoogle();

      // Redirect based on selected plan
      if (selectedPlan === 'free') {
        router.push('/manufacturers');
      } else {
        // Get the appropriate price ID based on plan and billing cycle
        const planPriceIds: Record<string, { monthly: string; yearly: string }> = {
          basic: {
            monthly: 'price_basic_monthly',
            yearly: 'price_basic_yearly',
          },
          pro: {
            monthly: 'price_pro_monthly',
            yearly: 'price_pro_yearly',
          },
        };

        const priceId = planPriceIds[selectedPlan]?.[billingCycle as 'monthly' | 'yearly'];

        if (priceId) {
          router.push(`/checkout?priceId=${priceId}&plan=${selectedPlan}`);
        } else {
          router.push('/pricing');
        }
      }
    } catch (error: unknown) {
      setError((error as Error).message || 'An error occurred during Google signup');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
          <CardDescription>Get started with Blossom today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Google Sign Up Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full border-2 border-blue-500 hover:bg-blue-50"
              onClick={handleGoogleSignup}
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                type="text"
                placeholder="Enter your company name"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                type="text"
                placeholder="Enter your location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Account Type</Label>
              <Select value={formData.role} onValueChange={(value: 'brand_owner' | 'manufacturer') => handleInputChange('role', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brand_owner">Brand Owner</SelectItem>
                  <SelectItem value="manufacturer">Manufacturer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
            
            <div className="text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link href="/login" className="text-pink-600 hover:text-pink-500 font-medium">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}