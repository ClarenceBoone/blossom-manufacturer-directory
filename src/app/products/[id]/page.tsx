'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Share2, ShoppingBag, ChevronRight, X, Pencil, Upload, Plus, Trash2 } from 'lucide-react';
import { Product } from '@/types';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [soldOnPlatforms, setSoldOnPlatforms] = useState(['Shopify', 'TikTok', 'Instagram', 'WalMart', 'Pinterest', 'Farfetch']);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [techPackFile, setTechPackFile] = useState<{ name: string; type: string; url: string } | null>(null);
  const [gradedPatternFile, setGradedPatternFile] = useState<{ name: string; type: string; url: string } | null>(null);
  const [showIntegrationSearch, setShowIntegrationSearch] = useState(false);
  const [integrationSearch, setIntegrationSearch] = useState('');

  const availableIntegrations = [
    'Shopify', 'TikTok', 'Instagram', 'WalMart', 'Pinterest', 'Farfetch',
    'Amazon', 'eBay', 'Etsy', 'BigCommerce', 'WooCommerce', 'Squarespace'
  ];

  // Mock product data
  const mockProduct: Product = {
    id: params.id as string,
    userId: 'user-1',
    name: 'Leonard Tee',
    description: 'Lorem ipsum dolor sit amet consectetur. Luctus sagittis adipiscing suspendisse eget morbi aenean neque proin libero. Lorem ipsum dolor sit amet consectetur. Luctus sagittis adipiscing suspendisse eget morbi aenean neque proin libero.',
    category: 'Apparel',
    images: [
      '/api/placeholder/800/800',
      '/api/placeholder/800/800',
      '/api/placeholder/800/800',
      '/api/placeholder/800/800',
    ],
    specifications: {
      material: 'Cotton',
      color: 'Tan',
      size: 'Medium'
    },
    files: [
      { name: 'Leonard Tee.ai', type: 'ai', url: '#' },
      { name: 'Leonard Tee.dxf', type: 'dxf', url: '#' }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  useEffect(() => {
    setProduct(mockProduct);
    setEditedName(mockProduct.name);
    setEditedDescription(mockProduct.description);
    // Set initial files if they exist
    if (mockProduct.files && mockProduct.files.length > 0) {
      const techPack = mockProduct.files.find((f: any) => f.type === 'ai');
      const gradedPattern = mockProduct.files.find((f: any) => f.type === 'dxf');
      if (techPack) setTechPackFile(techPack);
      if (gradedPattern) setGradedPatternFile(gradedPattern);
    }
  }, [params.id]);

  const handleRemovePlatform = (platform: string) => {
    setSoldOnPlatforms(soldOnPlatforms.filter(p => p !== platform));
  };

  const handleSaveName = () => {
    if (product) {
      setProduct({ ...product, name: editedName });
    }
    setIsEditingName(false);
  };

  const handleSaveDescription = () => {
    if (product) {
      setProduct({ ...product, description: editedDescription });
    }
    setIsEditingDescription(false);
  };

  const handleTechPackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTechPackFile({
        name: file.name,
        type: file.name.split('.').pop() || 'ai',
        url: URL.createObjectURL(file)
      });
    }
  };

  const handleGradedPatternUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setGradedPatternFile({
        name: file.name,
        type: file.name.split('.').pop() || 'dxf',
        url: URL.createObjectURL(file)
      });
    }
  };

  const handleAddPlatform = (platform: string) => {
    if (!soldOnPlatforms.includes(platform)) {
      setSoldOnPlatforms([...soldOnPlatforms, platform]);
    }
    setShowIntegrationSearch(false);
    setIntegrationSearch('');
  };

  const filteredIntegrations = availableIntegrations.filter(
    platform =>
      !soldOnPlatforms.includes(platform) &&
      platform.toLowerCase().includes(integrationSearch.toLowerCase())
  );

  // Check if all required fields are filled
  const allFieldsFilled = product?.name && product?.description && techPackFile && gradedPatternFile && soldOnPlatforms.length > 0;

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-8 pt-32">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm mb-8">
          <Link href="/products" className="text-gray-400 hover:text-gray-600">
            Products
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>

        {/* Product Title & Actions */}
        <div className="flex items-center justify-between mb-8">
          {isEditingName ? (
            <div className="flex-1 mr-4">
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleSaveName}
                onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
                className="text-4xl font-bold border-pink-600 h-auto py-2"
                autoFocus
              />
            </div>
          ) : (
            <div
              className="group relative cursor-pointer"
              onClick={() => setIsEditingName(true)}
            >
              <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
              <Pencil className="h-4 w-4 text-gray-400 absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="rounded-full">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              className={`rounded-full px-6 transition-colors ${
                allFieldsFilled
                  ? 'bg-pink-600 hover:bg-pink-700 text-white border-pink-600'
                  : 'bg-white text-pink-600 border-pink-600 hover:bg-pink-600 hover:text-white'
              }`}
              disabled={!allFieldsFilled}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Send to Production
            </Button>
          </div>
        </div>

        {/* Product Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Images */}
          <div className="flex gap-4 h-[400px]">
            {/* Main Image */}
            <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Column */}
            <div className="flex flex-col justify-between h-full">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-24 flex-1 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-pink-600' : 'border-gray-200'
                  } ${index < product.images.length - 1 ? 'mb-4' : ''}`}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-8">
            {/* Description */}
            {isEditingDescription ? (
              <Textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                onBlur={handleSaveDescription}
                className="text-gray-700 leading-relaxed border-pink-600 min-h-[100px]"
                autoFocus
              />
            ) : (
              <div
                className="group relative cursor-pointer"
                onClick={() => setIsEditingDescription(true)}
              >
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
                <Pencil className="h-4 w-4 text-gray-400 absolute -right-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}

            {/* Tech Pack & Graded Pattern */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Tech Pack:</h3>
                {techPackFile ? (
                  <div className="group w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:border-pink-600 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-600 rounded flex items-center justify-center text-white text-xs font-bold">
                        {techPackFile.type.toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{techPackFile.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <label className="cursor-pointer">
                        <Upload className="h-4 w-4 text-gray-600 hover:text-pink-600" />
                        <input
                          type="file"
                          className="hidden"
                          accept=".ai,.pdf,.zip"
                          onChange={handleTechPackUpload}
                        />
                      </label>
                      <button onClick={() => setTechPackFile(null)}>
                        <Trash2 className="h-4 w-4 text-gray-600 hover:text-red-600" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-600 transition-colors cursor-pointer">
                    <Upload className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">Upload Tech Pack</span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".ai,.pdf,.zip"
                      onChange={handleTechPackUpload}
                    />
                  </label>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Graded Pattern:</h3>
                {gradedPatternFile ? (
                  <div className="group w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:border-pink-600 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                        {gradedPatternFile.type.toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{gradedPatternFile.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <label className="cursor-pointer">
                        <Upload className="h-4 w-4 text-gray-600 hover:text-pink-600" />
                        <input
                          type="file"
                          className="hidden"
                          accept=".dxf,.pdf,.zip"
                          onChange={handleGradedPatternUpload}
                        />
                      </label>
                      <button onClick={() => setGradedPatternFile(null)}>
                        <Trash2 className="h-4 w-4 text-gray-600 hover:text-red-600" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-600 transition-colors cursor-pointer">
                    <Upload className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">Upload Pattern</span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".dxf,.pdf,.zip"
                      onChange={handleGradedPatternUpload}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Sales Channels */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Sales Channels:</h3>
              <div className="flex flex-wrap gap-2">
                {soldOnPlatforms.map((platform) => (
                  <button
                    key={platform}
                    className="group border border-pink-600 text-pink-600 rounded-full px-4 py-1 font-medium relative cursor-pointer hover:bg-pink-50 transition-colors flex items-center"
                    onClick={() => handleRemovePlatform(platform)}
                  >
                    <span className="group-hover:mr-5 transition-all">{platform}</span>
                    <X className="h-3 w-3 absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}

                {/* Add Platform Button */}
                <div className="relative">
                  {showIntegrationSearch ? (
                    <div className="absolute top-0 left-0 z-10">
                      <Input
                        value={integrationSearch}
                        onChange={(e) => setIntegrationSearch(e.target.value)}
                        onBlur={() => setTimeout(() => setShowIntegrationSearch(false), 200)}
                        placeholder="Search platforms..."
                        className="w-48 mb-1"
                        autoFocus
                      />
                      {filteredIntegrations.length > 0 && (
                        <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                          {filteredIntegrations.map((platform) => (
                            <button
                              key={platform}
                              onClick={() => handleAddPlatform(platform)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                            >
                              {platform}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowIntegrationSearch(true)}
                      className="border-2 border-dashed border-pink-600 text-pink-600 rounded-full px-4 py-1 font-medium hover:bg-pink-50 transition-colors flex items-center space-x-1"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Platform</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
