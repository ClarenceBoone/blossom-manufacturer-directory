'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Share, Star, Heart } from 'lucide-react';
import { Manufacturer } from '@/types';
import { getManufacturerById } from '@/services/manufacturerService';
import Link from 'next/link';

export default function ManufacturerProfilePage() {
  const params = useParams();
  const [manufacturer, setManufacturer] = useState<Manufacturer | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock manufacturer data
  const mockManufacturer: Manufacturer = {
    id: params.id as string,
    userId: 'user1',
    companyName: 'Manufacturer Name',
    location: 'West Java, Indonesia',
    description: 'Lorem ipsum dolor sit amet consectetur. Luctus sagittis adipiscing suspendisse eget morbi aenean neque proin libero. Lorem ipsum dolor sit amet consectetur. Luctus sagittis adipiscing suspendisse eget morbi aenean neque proin libero. Lorem ipsum dolor sit amet consectetur. Luctus sagittis adipiscing suspendisse eget morbi aenean neque proin libero.',
    services: ['Design Services', 'Dyeing', 'DTG/DTF', 'Cut & Sew', 'Embroidery', 'Heat Transfers', 'Graded Patterns', 'Samples', 'Screen Printing', 'Fabric Printing', 'Tech Packs', 'Fabric Sourcing', 'Embossing/Engraving'],
    productOfferings: ['Knitwear', "Women's Apparel", 'Outerwear', 'Polo Shirts', 'T-Shirts', 'Formal Shirts', 'Dresses', 'Pants', 'Sweatshirts', "Men's Apparel", 'Sweatpants'],
    moq: 100,
    leadTime: '3-4 wks',
    certifications: ['OEKO-TEX', 'GOTS'],
    notableClients: ['Kith', 'Balenciaga', 'Vuori', 'Ralph Lauren', 'Adidas', 'Gym Shark', 'Gucci', 'SKIMS', 'Alo', 'Prada'],
    images: [
      '/api/placeholder/600/400',
      '/api/placeholder/200/150',
      '/api/placeholder/200/150',
      '/api/placeholder/200/150',
      '/api/placeholder/200/150'
    ],
    reviews: [
      {
        clientName: 'Client Name',
        rating: 5,
        review: 'Lorem ipsum dolor sit amet consectetur.',
        date: new Date()
      },
      {
        clientName: 'Client Name',
        rating: 5,
        review: 'Lorem ipsum dolor sit amet consectetur. tiam suspendisse suspendisse congue orci ac id sit. Nunc elementum orci mattis sit. Dictumst sapien mauris odio pharetra scelerisque est urna mi.',
        date: new Date()
      }
    ],
    responseTime: '3 Hours',
    totalOrders: 1500000,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  useEffect(() => {
    const loadManufacturer = async () => {
      setLoading(true);
      try {
        const manufacturerData = await getManufacturerById(params.id as string);
        if (manufacturerData) {
          setManufacturer(manufacturerData);
        } else {
          // Fallback to mock data if not found in Firebase
          setManufacturer(mockManufacturer);
        }
      } catch (error) {
        console.error('Error loading manufacturer:', error);
        // Fallback to mock data on error
        setManufacturer(mockManufacturer);
      } finally {
        setLoading(false);
      }
    };

    loadManufacturer();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!manufacturer) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Manufacturer not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-500">
            <Link href="/manufacturers" className="hover:text-gray-700">Manufacturers</Link>
            <span className="mx-2">{'>'}</span>
            <span>{manufacturer.companyName}</span>
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">{manufacturer.companyName}</h1>
              <Heart className="h-5 w-5 text-pink-500" />
            </div>
            <p className="text-gray-600">{manufacturer.location}</p>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button className="bg-pink-500 hover:bg-pink-600" asChild>
              <Link href={`/messages/new?manufacturer=${manufacturer.id}`}>
                Start Message
              </Link>
            </Button>
          </div>
        </div>

        {/* Images and Description Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Side - Images */}
          <div className="flex gap-4">
            {/* Large Main Image */}
            <div className="flex-1">
              <div className="w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-100/30 to-purple-100/30 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-white/80 rounded-full flex items-center justify-center">
                      <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">Manufacturing Facility</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Small Thumbnail Images on Right */}
            <div className="w-24 space-y-2">
              {[1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className="w-full h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-100/30 to-purple-100/30 flex items-center justify-center">
                    <div className="w-5 h-5 bg-white/80 rounded-full flex items-center justify-center">
                      <svg className="h-2.5 w-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Description and Stats */}
          <div>
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed text-sm">{manufacturer.description}</p>
            </div>

            {/* Stats Card */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Avg. response time</div>
                  <div className="text-lg font-semibold">{manufacturer.responseTime}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Reviews</div>
                  <div className="text-lg font-semibold">180</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Total Orders ($)</div>
                  <div className="text-lg font-semibold">$1,500,000</div>
                </div>
              </div>
            </div>

            {/* Notable Clients */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-sm">Notable Clients:</h4>
              <div className="text-sm text-gray-700">
                <span>• Kith</span>
                <span className="mx-2">• Balenciaga</span>
                <span className="mx-2">• Vuori</span>
                <span className="mx-2">• Ralph Lauren</span>
                <span className="mx-2">• Adidas</span>
                <span className="mx-2">• Gym Shark</span>
                <br />
                <span>• Gucci</span>
                <span className="mx-2">• SKIMS</span>
                <span className="mx-2">• Alo</span>
                <span className="mx-2">• Prada</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Offerings and Services - Inline Below */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Offerings */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">Product Offerings:</h3>
            <div className="flex flex-wrap gap-2">
              {manufacturer.productOfferings.map((offering) => (
                <Badge key={offering} variant="secondary" className="text-xs px-2 py-1">
                  {offering}
                </Badge>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">Services:</h3>
            <div className="flex flex-wrap gap-2">
              {manufacturer.services.map((service) => (
                <Badge key={service} variant="outline" className="text-xs px-2 py-1">
                  {service}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold text-lg">Reviews (180)</h3>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {manufacturer.reviews.map((review, index) => (
              <div key={index}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-sm">{review.clientName}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 text-sm">{review.review}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button variant="outline" className="text-pink-500 border-pink-500 hover:bg-pink-50">
              See All Reviews
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}