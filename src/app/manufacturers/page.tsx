'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Heart, Package } from 'lucide-react';
import { Manufacturer } from '@/types';
import Link from 'next/link';
import { getAllManufacturers } from '@/services/manufacturerService';

export default function ManufacturersPage() {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [filteredManufacturers, setFilteredManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    specialty: 'all',
    moq: 'all',
    location: 'all',
    leadTime: 'all',
  });

  const MANUFACTURERS_PER_PAGE = 50;

  const searchParams = useSearchParams();

  // Mock data removed for cleaner code - using Firebase data only
  /*
  const createMockData = () => [
    {
      id: 'mock-1',
      userId: 'user1',
      companyName: 'Textile Excellence Co.',
      location: 'West Java, Indonesia',
      description: 'Premium textile manufacturer specializing in sustainable fashion production with over 15 years of experience.',
      services: ['Design Services', 'Dyeing', 'DTG/DTF', 'Cut & Sew'],
      productOfferings: ['Knitwear', "Women's Apparel", 'Outerwear', 'Polo Shirts'],
      moq: 100,
      leadTime: '3-4 wks',
      certifications: ['OEKO-TEX', 'GOTS'],
      notableClients: ['Kith', 'Balenciaga', 'Vuori'],
      images: ['/api/placeholder/400/300'],
      reviews: [
        { clientName: 'Fashion Brand X', rating: 5, review: 'Outstanding quality and service.', date: new Date() }
      ],
      responseTime: '2 Hours',
      totalOrders: 1200000,
      createdAt: new Date(),
      updatedAt: new Date(),
      website: '',
      email: '',
      phoneNumber: '',
    },
    {
      id: 'mock-2',
      userId: 'user2',
      companyName: 'Premium Apparel Works',
      location: 'Ho Chi Minh, Vietnam',
      description: 'High-end apparel manufacturer with expertise in luxury fashion and streetwear.',
      services: ['Pattern Making', 'Sampling', 'Production', 'Quality Control'],
      productOfferings: ['Streetwear', 'Luxury Fashion', 'Activewear', 'Denim'],
      moq: 200,
      leadTime: '4-5 wks',
      certifications: ['ISO 9001', 'WRAP'],
      notableClients: ['Supreme', 'Off-White', 'Stone Island'],
      images: ['/api/placeholder/400/300'],
      reviews: [
        { clientName: 'Luxury Brand Y', rating: 5, review: 'Exceptional craftsmanship.', date: new Date() }
      ],
      responseTime: '1 Hour',
      totalOrders: 950000,
      createdAt: new Date(),
      updatedAt: new Date(),
      website: '',
      email: '',
      phoneNumber: '',
    },
    {
      id: 'mock-3',
      userId: 'user3',
      companyName: 'Sustainable Fashion Hub',
      location: 'Istanbul, Turkey',
      description: 'Eco-friendly manufacturer focused on sustainable and ethical fashion production.',
      services: ['Organic Production', 'Recycled Materials', 'Zero Waste', 'Eco Dyeing'],
      productOfferings: ['Organic Cotton', 'Recycled Polyester', 'Hemp Products', 'Bamboo Fiber'],
      moq: 50,
      leadTime: '2-3 wks',
      certifications: ['GOTS', 'Cradle to Cradle', 'B Corp'],
      notableClients: ['Patagonia', 'Eileen Fisher', 'Reformation'],
      images: ['/api/placeholder/400/300'],
      reviews: [
        { clientName: 'Eco Brand Z', rating: 5, review: 'Perfect for sustainable fashion.', date: new Date() }
      ],
      responseTime: '3 Hours',
      totalOrders: 800000,
      createdAt: new Date(),
      updatedAt: new Date(),
      website: '',
      email: '',
      phoneNumber: '',
    },
    {
      id: 'mock-4',
      userId: 'user4',
      companyName: 'Athletic Wear Specialists',
      location: 'Guangzhou, China',
      description: 'Leading manufacturer of high-performance athletic and fitness apparel.',
      services: ['Performance Fabrics', 'Moisture Wicking', 'Seamless Technology', 'Compression Wear'],
      productOfferings: ['Activewear', 'Gym Wear', 'Sports Bras', 'Leggings'],
      moq: 300,
      leadTime: '5-6 wks',
      certifications: ['Nike Approved', 'Adidas Certified'],
      notableClients: ['Nike', 'Adidas', 'Under Armour'],
      images: ['/api/placeholder/400/300'],
      reviews: [
        { clientName: 'Sports Brand A', rating: 4, review: 'Great for athletic wear production.', date: new Date() }
      ],
      responseTime: '4 Hours',
      totalOrders: 2000000,
      createdAt: new Date(),
      updatedAt: new Date(),
      website: '',
      email: '',
      phoneNumber: '',
    },
    {
      id: 'mock-5',
      userId: 'user5',
      companyName: 'Luxury Fashion House',
      location: 'Milan, Italy',
      description: 'High-end fashion manufacturer specializing in luxury garments.',
      services: ['Haute Couture', 'Luxury Materials', 'Handcrafted Details', 'Custom Design'],
      productOfferings: ['Evening Wear', 'Luxury Suits', 'Designer Dresses', 'Premium Accessories'],
      moq: 50,
      leadTime: '6-8 wks',
      certifications: ['Made in Italy', 'Luxury Certified'],
      notableClients: ['Versace', 'Armani', 'Dolce & Gabbana'],
      images: ['/api/placeholder/400/300'],
      reviews: [
        { clientName: 'Luxury Brand', rating: 5, review: 'Exceptional craftsmanship and attention to detail.', date: new Date() }
      ],
      responseTime: '6 Hours',
      totalOrders: 800000,
      createdAt: new Date(),
      updatedAt: new Date(),
      website: '',
      email: '',
      phoneNumber: '',
    },
    {
      id: 'mock-6',
      userId: 'user6',
      companyName: 'Denim Specialists Co.',
      location: 'Lahore, Pakistan',
      description: 'Specialized denim manufacturer with decades of experience.',
      services: ['Denim Washing', 'Distressing', 'Custom Fits', 'Raw Denim'],
      productOfferings: ['Jeans', 'Denim Jackets', 'Denim Shirts', 'Denim Accessories'],
      moq: 200,
      leadTime: '4-5 wks',
      certifications: ['Better Cotton Initiative', 'OEKO-TEX'],
      notableClients: ['Levis', 'Wrangler', 'Lee'],
      images: ['/api/placeholder/400/300'],
      reviews: [
        { clientName: 'Denim Brand', rating: 4, review: 'Excellent denim quality and washing techniques.', date: new Date() }
      ],
      responseTime: '3 Hours',
      totalOrders: 1500000,
      createdAt: new Date(),
      updatedAt: new Date(),
      website: '',
      email: '',
      phoneNumber: '',
    }
  ];

  // Load manufacturers from Firebase
  const loadManufacturers = async () => {
    setLoading(true);
    try {
      console.log('🔍 Loading updated manufacturers from Firebase...');

      // Load manufacturers directly from Firebase
      const firebaseManufacturers = await getAllManufacturers();
      console.log(`📦 Loaded ${firebaseManufacturers.length} manufacturers from Firebase`);

      if (firebaseManufacturers.length > 0) {
        setManufacturers(firebaseManufacturers);
        setFilteredManufacturers(firebaseManufacturers);
        console.log('✅ Successfully populated manufacturers with updated Firebase data');
        console.log('📋 Sample manufacturer services:', firebaseManufacturers[0]?.services || []);
      } else {
        console.warn('⚠️ No manufacturers found in Firebase');
        setManufacturers([]);
        setFilteredManufacturers([]);
      }
    } catch (error) {
      console.error('❌ Error loading manufacturers:', error);
      setManufacturers([]);
      setFilteredManufacturers([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Removed unused mock data - using Firebase data only
  /*
  const mockManufacturers: Manufacturer[] = [
    {
      id: '1',
      userId: 'user1',
      companyName: 'Textile Excellence Co.',
      location: 'West Java, Indonesia',
      description: 'Premium textile manufacturer specializing in sustainable fashion production with over 15 years of experience.',
      services: ['Design Services', 'Dyeing', 'DTG/DTF', 'Cut & Sew'],
      productOfferings: ['Knitwear', "Women's Apparel", 'Outerwear', 'Polo Shirts'],
      moq: 100,
      leadTime: '3-4 wks',
      certifications: ['OEKO-TEX', 'GOTS'],
      notableClients: ['Kith', 'Balenciaga', 'Vuori'],
      images: ['/api/placeholder/400/300'],
      reviews: [
        { clientName: 'Fashion Brand X', rating: 5, review: 'Outstanding quality and service.', date: new Date() }
      ],
      responseTime: '2 Hours',
      totalOrders: 1200000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      userId: 'user2',
      companyName: 'Premium Apparel Works',
      location: 'Ho Chi Minh, Vietnam',
      description: 'High-end apparel manufacturer with expertise in luxury fashion and streetwear.',
      services: ['Pattern Making', 'Sampling', 'Production', 'Quality Control'],
      productOfferings: ['Streetwear', 'Luxury Fashion', 'Activewear', 'Denim'],
      moq: 200,
      leadTime: '4-5 wks',
      certifications: ['ISO 9001', 'WRAP'],
      notableClients: ['Supreme', 'Off-White', 'Stone Island'],
      images: ['/api/placeholder/400/300'],
      reviews: [
        { clientName: 'Luxury Brand Y', rating: 5, review: 'Exceptional craftsmanship.', date: new Date() }
      ],
      responseTime: '1 Hour',
      totalOrders: 950000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      userId: 'user3',
      companyName: 'Sustainable Fashion Hub',
      location: 'Istanbul, Turkey',
      description: 'Eco-friendly manufacturer focused on sustainable and ethical fashion production.',
      services: ['Organic Production', 'Recycled Materials', 'Zero Waste', 'Eco Dyeing'],
      productOfferings: ['Organic Cotton', 'Recycled Polyester', 'Hemp Products', 'Bamboo Fiber'],
      moq: 50,
      leadTime: '2-3 wks',
      certifications: ['GOTS', 'Cradle to Cradle', 'B Corp'],
      notableClients: ['Patagonia', 'Eileen Fisher', 'Reformation'],
      images: ['/api/placeholder/400/300'],
      reviews: [
        { clientName: 'Eco Brand Z', rating: 5, review: 'Perfect for sustainable fashion.', date: new Date() }
      ],
      responseTime: '3 Hours',
      totalOrders: 800000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '4',
      userId: 'user4',
      companyName: 'Athletic Wear Specialists',
      location: 'Guangzhou, China',
      description: 'Leading manufacturer of high-performance athletic and fitness apparel.',
      services: ['Performance Fabrics', 'Moisture Wicking', 'Seamless Technology', 'Compression Wear'],
      productOfferings: ['Activewear', 'Gym Wear', 'Sports Bras', 'Leggings'],
      moq: 300,
      leadTime: '5-6 wks',
      certifications: ['Nike Approved', 'Adidas Certified'],
      notableClients: ['Nike', 'Adidas', 'Under Armour'],
      images: ['/api/placeholder/400/300'],
      reviews: [
        { clientName: 'Sports Brand A', rating: 4, review: 'Great for athletic wear production.', date: new Date() }
      ],
      responseTime: '4 Hours',
      totalOrders: 2000000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Add more duplicates for demo
    ...Array(8).fill(null).map((_, index) => ({
      id: `${index + 5}`,
      userId: `user${index + 5}`,
      companyName: 'Quality Manufacturer Co.',
      location: 'West Java, Indonesia',
      description: 'Reliable manufacturer with consistent quality and competitive pricing.',
      services: ['Cut & Sew', 'Embroidery', 'Screen Printing', 'Packaging'],
      productOfferings: ['T-Shirts', 'Hoodies', 'Jeans', 'Jackets'],
      moq: 150,
      leadTime: '3-4 wks',
      certifications: ['ISO 9001', 'OEKO-TEX'],
      notableClients: ['H&M', 'Zara', 'Uniqlo'],
      images: ['/api/placeholder/400/300'],
      reviews: [
        { clientName: 'Fashion Retailer', rating: 4, review: 'Consistent quality and delivery.', date: new Date() }
      ],
      responseTime: '6 Hours',
      totalOrders: 600000,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  ];
  */

  const loadManufacturers = async () => {
    setLoading(true);
    try {
      console.log('🔍 Loading manufacturers from Firebase...');
      const manufacturersData = await getAllManufacturers();
      setManufacturers(manufacturersData);
      console.log(`✅ Loaded ${manufacturersData.length} manufacturers from Firebase`);
    } catch (error) {
      console.error('❌ Error loading manufacturers:', error);
      setManufacturers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load manufacturers from Firebase
    loadManufacturers();

    // Handle search from homepage
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    let filtered = manufacturers;

    if (searchQuery) {
      filtered = filtered.filter(manufacturer =>
        manufacturer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        manufacturer.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        manufacturer.services.some(service => service.toLowerCase().includes(searchQuery.toLowerCase())) ||
        manufacturer.productOfferings.some(product => product.toLowerCase().includes(searchQuery.toLowerCase())) ||
        manufacturer.notableClients.some(client => client.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply specialty filter
    if (filters.specialty && filters.specialty !== 'all') {
      const specialtyLower = filters.specialty.toLowerCase();
      filtered = filtered.filter(manufacturer =>
        manufacturer.services.some(service =>
          service.toLowerCase().includes(specialtyLower) ||
          service.toLowerCase().replace(/[^a-z0-9]/g, '').includes(specialtyLower.replace(/[^a-z0-9]/g, ''))
        ) ||
        manufacturer.productOfferings.some(product =>
          product.toLowerCase().includes(specialtyLower) ||
          product.toLowerCase().replace(/[^a-z0-9]/g, '').includes(specialtyLower.replace(/[^a-z0-9]/g, ''))
        )
      );
    }

    // Apply location filter
    if (filters.location && filters.location !== 'all') {
      filtered = filtered.filter(manufacturer =>
        manufacturer.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply MOQ filter
    if (filters.moq && filters.moq !== 'all') {
      filtered = filtered.filter(manufacturer => {
        const moq = manufacturer.moq;
        if (filters.moq === 'low') return moq < 100;
        if (filters.moq === 'medium') return moq >= 100 && moq <= 500;
        if (filters.moq === 'high') return moq > 500;
        return true;
      });
    }

    // Apply lead time filter
    if (filters.leadTime && filters.leadTime !== 'all') {
      filtered = filtered.filter(manufacturer => {
        const leadTime = manufacturer.leadTime.toLowerCase();
        if (filters.leadTime === 'fast') return leadTime.includes('1-2') || leadTime.includes('2-3');
        if (filters.leadTime === 'medium') return leadTime.includes('3-4') || leadTime.includes('4-5');
        if (filters.leadTime === 'slow') return leadTime.includes('5-6') || leadTime.includes('6+');
        return true;
      });
    }


    setFilteredManufacturers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, filters, manufacturers]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredManufacturers.length / MANUFACTURERS_PER_PAGE);
  const startIndex = (currentPage - 1) * MANUFACTURERS_PER_PAGE;
  const endIndex = startIndex + MANUFACTURERS_PER_PAGE;
  const currentManufacturers = filteredManufacturers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Find Your Perfect Manufacturer</h1>
          
          {/* Search Bar */}
          <div className="max-w-3xl mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by manufacturers, specialty or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-3 text-base border-gray-300 rounded-lg"
              />
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Select value={filters.specialty} onValueChange={(value) => setFilters({...filters, specialty: value})}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                <SelectItem value="apparel">Apparel</SelectItem>
                <SelectItem value="textile">Textile</SelectItem>
                <SelectItem value="fashion">Fashion</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="garment">Garment</SelectItem>
                <SelectItem value="knitwear">Knitwear</SelectItem>
                <SelectItem value="cut-sew">Cut & Sew</SelectItem>
                <SelectItem value="dyeing">Dyeing</SelectItem>
                <SelectItem value="activewear">Activewear</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="leather">Leather</SelectItem>
                <SelectItem value="denim">Denim</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.moq} onValueChange={(value) => setFilters({...filters, moq: value})}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="MOQ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All MOQ</SelectItem>
                <SelectItem value="low">Under 100</SelectItem>
                <SelectItem value="medium">100-500</SelectItem>
                <SelectItem value="high">500+</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.location} onValueChange={(value) => setFilters({...filters, location: value})}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="indonesia">Indonesia</SelectItem>
                <SelectItem value="china">China</SelectItem>
                <SelectItem value="vietnam">Vietnam</SelectItem>
                <SelectItem value="turkey">Turkey</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.leadTime} onValueChange={(value) => setFilters({...filters, leadTime: value})}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Lead Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Lead Times</SelectItem>
                <SelectItem value="fast">1-3 weeks</SelectItem>
                <SelectItem value="medium">3-5 weeks</SelectItem>
                <SelectItem value="slow">5+ weeks</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center">
            <p className="text-gray-600 font-medium">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredManufacturers.length)} of {filteredManufacturers.length} manufacturers
              {process.env.NODE_ENV === 'development' && (
                <span className="text-xs text-blue-600 ml-2">
                  (Total loaded: {manufacturers.length}, Filtered: {filteredManufacturers.length}, Current page: {currentManufacturers.length})
                </span>
              )}
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Sort by:</span>
              <Select defaultValue="relevance">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="orders">Total Orders</SelectItem>
                  <SelectItem value="response">Response Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Manufacturers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {currentManufacturers.map((manufacturer) => (
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

                  {/* Heart Button */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-3 right-3 h-8 w-8 bg-white/20 hover:bg-white/30 text-white border-0"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-4 space-y-3">
                {/* Category Badges */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {manufacturer.services.slice(0, 4).map((service, index) => (
                    <Badge
                      key={index}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-2.5 py-1 rounded-full border border-gray-300 font-medium transition-colors"
                    >
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
                  <span className="font-semibold">MOQ:</span> {manufacturer.moq}pcs • <span className="font-semibold">Lead Time:</span> {manufacturer.leadTime}
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
                    👁️ View Details
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              {/* Previous Button */}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-10 h-10"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt;
              </Button>
              
              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNumber}
                    variant="outline"
                    size="sm"
                    className={`w-10 h-10 ${
                      currentPage === pageNumber
                        ? 'bg-pink-600 text-white border-pink-600'
                        : ''
                    }`}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              })}
              
              {/* Next Button */}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-10 h-10"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                &gt;
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}