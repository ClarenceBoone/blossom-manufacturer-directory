'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, FileText, Target, Award, Package } from 'lucide-react';
import Link from 'next/link';
import { Manufacturer } from '@/types';
import { getPaginatedManufacturers } from '@/services/manufacturerService';

export default function Home() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredManufacturers, setFeaturedManufacturers] = useState<Manufacturer[]>([]);
  const [loadingManufacturers, setLoadingManufacturers] = useState(true);

  useEffect(() => {
    if (currentUser) {
      router.push('/manufacturers');
    }
  }, [currentUser, router]);

  useEffect(() => {
    const loadFeaturedManufacturers = async () => {
      setLoadingManufacturers(true);
      try {
        const { manufacturers } = await getPaginatedManufacturers(4);
        setFeaturedManufacturers(manufacturers);
        console.log(`✅ Loaded ${manufacturers.length} featured manufacturers from Firebase`);
      } catch (error) {
        console.error('Error loading featured manufacturers:', error);
        setFeaturedManufacturers([]);
      } finally {
        setLoadingManufacturers(false);
      }
    };

    loadFeaturedManufacturers();
  }, []);

  if (currentUser) {
    return null; // Will redirect
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/manufacturers?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const productTags = [
    'Cowboy Boots',
    'Acid Washed Hoodies', 
    'Tweed Blazer',
    'Vegan Leather Handbags'
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-16 pt-32">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-8">
              Work with the best manufacturers.
            </h1>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by manufacturers, speciality or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-12 py-4 text-lg border-gray-300 rounded-full"
                />
              </div>
            </div>
            
            {/* Product Tags */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {productTags.map((tag, index) => (
                <Badge 
                  key={index}
                  variant="secondary" 
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-full"
                  onClick={() => setSearchQuery(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
        </div>

        {/* Featured Manufacturers Section */}
        <div className="mb-20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Manufacturers</h2>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => {
                if (!currentUser) {
                  router.push('/login');
                } else {
                  router.push('/manufacturers');
                }
              }}
            >
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingManufacturers ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="overflow-hidden border-0 shadow-md bg-white rounded-xl">
                  <div className="aspect-[4/3] bg-gray-200 animate-pulse rounded-t-xl" />
                  <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-6 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                    <div className="h-10 bg-gray-200 rounded-full animate-pulse" />
                  </CardContent>
                </Card>
              ))
            ) : featuredManufacturers.length > 0 ? (
              featuredManufacturers.map((manufacturer) => (
              <Card key={manufacturer.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 shadow-md bg-white rounded-xl">
                <div className="relative">
                  {/* Manufacturer Image */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden rounded-t-xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white/70">
                        <Package className="h-12 w-12 mx-auto mb-2" />
                        <span className="text-sm font-medium">Manufacturing Facility</span>
                      </div>
                    </div>
                    
                    
                    {/* Featured Badge for Premium Manufacturers */}
                    {manufacturer.moq >= 1000 && (
                      <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        ⭐ Featured
                      </div>
                    )}

                    {/* Plus Button */}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-3 right-3 h-8 w-8 bg-white/20 hover:bg-white/30 text-white border-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-4 space-y-3">
                  {/* Category Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {manufacturer.services.slice(0, 4).map((service, index) => (
                      <Badge key={index} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-2.5 py-1 rounded-full border border-gray-300 font-medium transition-colors">
                        {service}
                      </Badge>
                    ))}
                    {manufacturer.services.length > 4 && (
                      <Badge className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-2.5 py-1 rounded-full border border-gray-300 font-medium">
                        +{manufacturer.services.length - 4}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Company Name */}
                  <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                    {manufacturer.companyName}
                  </h3>
                  
                  {/* Location */}
                  <p className="text-sm text-gray-600">
                    {manufacturer.location}
                  </p>
                  
                  {/* MOQ and Lead Time */}
                  <p className="text-sm text-gray-900 font-medium">
                    <span className="font-semibold">MOQ:</span> {manufacturer.moq.toLocaleString()}pcs • <span className="font-semibold">Lead Time:</span> {manufacturer.leadTime}
                  </p>


                  {/* Works with (Past Clients) */}
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold">Works with:</span> {manufacturer.notableClients.slice(0, 2).join(', ')}{manufacturer.notableClients.length > 2 ? ` and ${manufacturer.notableClients.length - 2} more` : ''}
                  </div>
                  
                  {/* View Details Button */}
                  <Button
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-full py-2 font-medium"
                    asChild
                  >
                    <Link href={`/manufacturers/${manufacturer.id}`}>
                      View Details
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))
            ) : (
              // No manufacturers found
              <div className="col-span-full text-center py-12">
                <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No manufacturers found</h3>
                <p className="text-gray-600">We&apos;re working on adding more manufacturers to our platform.</p>
              </div>
            )}
          </div>
        </div>

        {/* Why Choose Blossom Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Blossom?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Verified Manufacturers</h3>
              <p className="text-gray-600 leading-relaxed">
                All manufacturers are pre-screened and verified for quality, reliability and fair expertise.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Smart Matching</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI powered agents will match you with the best manufacturer for your design needs.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Quality Guaranteed</h3>
              <p className="text-gray-600 leading-relaxed">
                Work with confidence knowing that each manufacturer meets industry standards.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl py-16 px-8">
          <div className="max-w-2xl mx-auto">
            <p className="text-pink-600 font-medium mb-2">Get Blossom</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Reduce production pain points
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Trial and error with manufacturers is a waste of your time and resources.
            </p>
            <Button 
              size="lg" 
              className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 rounded-full text-lg"
            >
              Get Started for Free
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              © 2025 Blossom Haus Studios
            </p>
            <div className="flex items-center space-x-6">
              <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">
                Terms
              </Link>
              <div className="flex space-x-3">
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <span className="sr-only">Facebook</span>
                  f
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <span className="sr-only">Twitter</span>
                  t
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <span className="sr-only">Instagram</span>
                  i
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
