'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, Upload, Plus, Bold, Italic, Underline, Link2, Image, Undo, X, Trash2 } from 'lucide-react';

export default function CreateProductPage() {
  const router = useRouter();
  const [productName, setProductName] = useState('');
  const [season, setSeason] = useState('');
  const [styleNumber, setStyleNumber] = useState('');
  const [skuNumber, setSkuNumber] = useState('');
  const [fabrication, setFabrication] = useState('');
  const [trims, setTrims] = useState('');
  const [packaging, setPackaging] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<(string | null)[]>([null, null, null, null]);
  const [techPack, setTechPack] = useState<File | null>(null);
  const [gradedPattern, setGradedPattern] = useState<File | null>(null);
  const [salesChannels, setSalesChannels] = useState<string[]>([]);
  const [variants, setVariants] = useState<Array<{color: string; sizes: string[]; quantity: string}>>([
    { color: '', sizes: [], quantity: '' },
    { color: '', sizes: [], quantity: '' },
    { color: '', sizes: [], quantity: '' },
    { color: '', sizes: [], quantity: '' },
    { color: '', sizes: [], quantity: '' },
    { color: '', sizes: [], quantity: '' }
  ]);
  const [msrp, setMsrp] = useState('');
  const [wholesalePrice, setWholesalePrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [marginPercent, setMarginPercent] = useState('');
  const [retailPrice, setRetailPrice] = useState('');
  const [grossProfit, setGrossProfit] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showChannelSearch, setShowChannelSearch] = useState(false);
  const [channelSearch, setChannelSearch] = useState('');

  const availableChannels = [
    'Shopify', 'TikTok', 'Instagram', 'WalMart', 'Pinterest', 'Farfetch',
    'Amazon', 'eBay', 'Etsy', 'BigCommerce', 'WooCommerce', 'Squarespace'
  ];

  const handleImageUpload = (file: File, index: number) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const newImages = [...images];
      newImages[index] = e.target?.result as string;
      setImages(newImages);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent, index?: number) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    if (index !== undefined) {
      handleImageUpload(files[0], index);
    } else {
      files.forEach((file, i) => {
        const emptyIndex = images.findIndex((img, idx) => img === null && idx >= i);
        if (emptyIndex !== -1) {
          handleImageUpload(file, emptyIndex);
        }
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const files = Array.from(e.target.files || []);

    if (index !== undefined) {
      if (files[0]) {
        handleImageUpload(files[0], index);
      }
    } else {
      files.forEach((file, i) => {
        const emptyIndex = images.findIndex(img => img === null);
        if (emptyIndex !== -1) {
          handleImageUpload(file, emptyIndex);
        }
      });
    }

    e.target.value = '';
  };

  const handleDeleteImage = (index: number) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  const handleAddChannel = (channel: string) => {
    if (!salesChannels.includes(channel)) {
      setSalesChannels([...salesChannels, channel]);
    }
    setShowChannelSearch(false);
    setChannelSearch('');
  };

  const handleRemoveChannel = (channel: string) => {
    setSalesChannels(salesChannels.filter(c => c !== channel));
  };

  const filteredChannels = availableChannels.filter(
    channel =>
      !salesChannels.includes(channel) &&
      channel.toLowerCase().includes(channelSearch.toLowerCase())
  );

  const handleVariantColorChange = (index: number, color: string) => {
    const newVariants = [...variants];
    newVariants[index].color = color;
    setVariants(newVariants);
  };

  const handleVariantQuantityChange = (index: number, quantity: string) => {
    const newVariants = [...variants];
    newVariants[index].quantity = quantity;
    setVariants(newVariants);
  };

  const handleSizeToggle = (variantIndex: number, size: string) => {
    const newVariants = [...variants];
    const sizes = newVariants[variantIndex].sizes;
    if (sizes.includes(size)) {
      newVariants[variantIndex].sizes = sizes.filter(s => s !== size);
    } else {
      newVariants[variantIndex].sizes = [...sizes, size];
    }
    setVariants(newVariants);
  };

  // Check if all required fields are filled
  const hasImages = images.some(img => img !== null);
  const allFieldsFilled = productName && description && hasImages && techPack && gradedPattern;

  const handleSaveProduct = async (status: 'draft' | 'published') => {
    try {
      const productData = {
        productName,
        season,
        styleNumber,
        skuNumber,
        fabrication,
        trims,
        packaging,
        description,
        images: images.filter(img => img !== null),
        salesChannels,
        variants: variants.filter(v => v.color || v.sizes.length > 0 || v.quantity),
        pricing: {
          msrp,
          wholesalePrice,
          costPrice,
          marginPercent,
          retailPrice,
          grossProfit
        },
        status,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'products'), productData);
      console.log('Product saved with ID:', docRef.id);

      if (status === 'published') {
        router.push('/products');
      } else {
        alert('Product saved as draft');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    }
  };

  const handleSave = () => {
    handleSaveProduct('draft');
  };

  const handlePreview = () => {
    handleSaveProduct('draft');
  };

  const handlePublish = () => {
    if (allFieldsFilled) {
      handleSaveProduct('published');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8 pt-32 max-w-6xl">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm mb-8">
          <Link href="/products" className="text-gray-400 hover:text-gray-600">
            Products
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="text-gray-900 font-medium">Untitled</span>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end items-center space-x-3 mb-8">
          <Button
            onClick={handlePreview}
            variant="outline"
            className="rounded-full bg-gray-100 border-0 text-gray-700 hover:bg-gray-200"
          >
            Save and Preview
          </Button>
          <Button
            onClick={handlePublish}
            className={`rounded-full px-6 transition-colors ${
              allFieldsFilled
                ? 'bg-pink-600 hover:bg-pink-700 text-white'
                : 'bg-white text-pink-600 border border-pink-600 hover:bg-pink-50'
            }`}
            disabled={!allFieldsFilled}
          >
            Publish
          </Button>
        </div>

        {/* Form Content */}
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Product Name and Season */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">Product Name</label>
                <Input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Product Name"
                  className="bg-white"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">Season</label>
                <Input
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  placeholder="Season"
                  className="bg-white"
                />
              </div>
            </div>

            {/* Style # and SKU # */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">Style #</label>
                <Input
                  value={styleNumber}
                  onChange={(e) => setStyleNumber(e.target.value)}
                  placeholder="Style #"
                  className="bg-white"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">SKU #</label>
                <Input
                  value={skuNumber}
                  onChange={(e) => setSkuNumber(e.target.value)}
                  placeholder="SKU #"
                  className="bg-white"
                />
              </div>
            </div>

            {/* Materials Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Materials</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Fabrication</label>
                  <Input
                    value={fabrication}
                    onChange={(e) => setFabrication(e.target.value)}
                    placeholder="Fabrication type"
                    className="bg-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Trims</label>
                  <Input
                    value={trims}
                    onChange={(e) => setTrims(e.target.value)}
                    placeholder="Trim type"
                    className="bg-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Packaging</label>
                  <Input
                    value={packaging}
                    onChange={(e) => setPackaging(e.target.value)}
                    placeholder="Packaging type"
                    className="bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div>
              <label className="text-sm font-semibold text-gray-900 mb-2 block">Description</label>
              <div className="border rounded-lg bg-white">
                <div className="flex items-center gap-2 p-3 border-b">
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <Bold className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <Italic className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <Underline className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <span className="text-sm font-bold">A</span>
                  </button>
                  <div className="w-px h-6 bg-gray-200 mx-1" />
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8M4 18h16" />
                    </svg>
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M4 18h16" />
                    </svg>
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <span className="text-sm">¶</span>
                  </button>
                  <div className="w-px h-6 bg-gray-200 mx-1" />
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <Link2 className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <Image className="h-4 w-4" />
                  </button>
                  <div className="flex-1" />
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <Undo className="h-4 w-4" />
                  </button>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your product"
                  className="w-full p-4 min-h-[120px] border-0 focus:outline-none resize-none placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Media Section */}
            <div>
              <label className="text-sm font-semibold text-gray-900 mb-3 block">Media</label>
              <div className="flex gap-4 h-[220px]">
                {/* Main Upload Area */}
                <div
                  className={`flex-1 border-2 border-dashed rounded-lg transition-colors ${
                    isDragging ? 'border-pink-500 bg-pink-50' : 'border-pink-300 bg-white'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                    <Upload className="h-12 w-12 text-pink-400 mb-4" />
                    <p className="text-pink-500 font-medium mb-2">Drag images to upload</p>
                    <p className="text-gray-400 mb-4">or</p>
                    <label className="cursor-pointer">
                      <span className="text-pink-500 font-medium hover:text-pink-600 underline">Browse</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Image Slots */}
                <div className="flex flex-col gap-3">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="group w-20 h-12 border-2 border-dashed border-pink-300 rounded-lg flex items-center justify-center bg-white relative"
                      onDrop={(e) => handleDrop(e, index)}
                      onDragOver={handleDragOver}
                    >
                      {image ? (
                        <>
                          <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                            <label className="cursor-pointer bg-white rounded p-1 hover:bg-gray-100">
                              <Upload className="h-2.5 w-2.5 text-gray-700" />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileSelect(e, index)}
                                className="hidden"
                              />
                            </label>
                            <button
                              onClick={() => handleDeleteImage(index)}
                              className="bg-white rounded p-1 hover:bg-gray-100"
                            >
                              <Trash2 className="h-2.5 w-2.5 text-gray-700" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <label className="w-full h-full flex items-center justify-center cursor-pointer">
                          <span className="text-pink-400 text-lg font-light">{index + 1}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileSelect(e, index)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Tech Pack and Graded Pattern */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">Tech Pack:</label>
                {techPack ? (
                  <div className="border-2 border-pink-300 rounded-lg p-3 bg-white h-10 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 truncate">{techPack.name}</span>
                    <button onClick={() => setTechPack(null)} className="text-pink-600 hover:text-pink-700 text-xs ml-2">
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-pink-300 rounded-lg p-3 flex items-center justify-center cursor-pointer hover:border-pink-400 transition-colors bg-white h-10">
                    <span className="text-pink-500 text-sm font-medium">Upload Document</span>
                    <input
                      type="file"
                      accept=".ai,.pdf,.zip"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setTechPack(file);
                      }}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">Graded Pattern:</label>
                {gradedPattern ? (
                  <div className="border-2 border-pink-300 rounded-lg p-3 bg-white h-10 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 truncate">{gradedPattern.name}</span>
                    <button onClick={() => setGradedPattern(null)} className="text-pink-600 hover:text-pink-700 text-xs ml-2">
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-pink-300 rounded-lg p-3 flex items-center justify-center cursor-pointer hover:border-pink-400 transition-colors bg-white h-10">
                    <span className="text-pink-500 text-sm font-medium">Upload Document</span>
                    <input
                      type="file"
                      accept=".dxf,.pdf,.zip"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setGradedPattern(file);
                      }}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Sales Channels */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Sales Channels</h3>
                <button
                  onClick={() => setShowChannelSearch(!showChannelSearch)}
                  className="w-6 h-6 rounded-full bg-pink-600 hover:bg-pink-700 flex items-center justify-center text-white"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {showChannelSearch && (
                <div className="mb-3">
                  <Input
                    value={channelSearch}
                    onChange={(e) => setChannelSearch(e.target.value)}
                    placeholder="Search platforms..."
                    className="mb-2 bg-white"
                    autoFocus
                  />
                  {filteredChannels.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                      {filteredChannels.map((channel) => (
                        <button
                          key={channel}
                          onClick={() => handleAddChannel(channel)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                        >
                          {channel}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {salesChannels.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {salesChannels.map((channel) => (
                    <button
                      key={channel}
                      onClick={() => handleRemoveChannel(channel)}
                      className="group border border-pink-600 text-pink-600 rounded-full px-4 py-1 font-medium relative cursor-pointer hover:bg-pink-50 transition-colors flex items-center"
                    >
                      <span className="group-hover:mr-5 transition-all">{channel}</span>
                      <X className="h-3 w-3 absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No sales channels added yet</p>
              )}
            </div>

            {/* Variants */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Variants</h3>
                <button className="w-6 h-6 rounded-full bg-pink-600 hover:bg-pink-700 flex items-center justify-center text-white">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="pt-4">
                {/* Header Row */}
                <div className="flex mb-4">
                  <div className="w-20 text-sm font-medium text-gray-600">Color</div>
                  <div className="flex-1 text-sm font-medium text-gray-600 pl-6">Sizes</div>
                  <div className="w-24 text-sm font-medium text-gray-600 text-right">Quantity</div>
                </div>

                {/* Variant Rows */}
                {variants.map((variant, i) => (
                  <div key={i} className="flex mb-4 items-center">
                    <div className="w-20">
                      <Input
                        value={variant.color}
                        onChange={(e) => handleVariantColorChange(i, e.target.value)}
                        placeholder="--"
                        className="bg-white h-10 text-sm"
                      />
                    </div>
                    <div className="flex-1 flex gap-2 pl-6">
                      {['S', 'M', 'L', 'XL', '2XL', '3XL'].map((size) => (
                        <button
                          key={size}
                          onClick={() => handleSizeToggle(i, size)}
                          className={`w-12 h-12 rounded-lg text-sm font-medium transition-colors ${
                            variant.sizes.includes(size)
                              ? 'bg-pink-600 text-white hover:bg-pink-700'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    <div className="w-24">
                      <Input
                        value={variant.quantity}
                        onChange={(e) => handleVariantQuantityChange(i, e.target.value)}
                        placeholder="--"
                        className="bg-white h-10 text-sm text-right"
                        type="number"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Pricing</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-700 mb-1 block">MSRP</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-200 text-gray-700 text-sm">$</span>
                    <Input
                      value={msrp}
                      onChange={(e) => setMsrp(e.target.value)}
                      placeholder="--"
                      className="rounded-l-none bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-700 mb-1 block">Wholesale Price</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-200 text-gray-700 text-sm">$</span>
                    <Input
                      value={wholesalePrice}
                      onChange={(e) => setWholesalePrice(e.target.value)}
                      placeholder="--"
                      className="rounded-l-none bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-700 mb-1 block">Cost Price</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-200 text-gray-700 text-sm">$</span>
                    <Input
                      value={costPrice}
                      onChange={(e) => setCostPrice(e.target.value)}
                      placeholder="--"
                      className="rounded-l-none bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-700 mb-1 block">Margin %</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-200 text-gray-700 text-sm">%</span>
                    <Input
                      value={marginPercent}
                      onChange={(e) => setMarginPercent(e.target.value)}
                      placeholder="--"
                      className="rounded-l-none bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-700 mb-1 block">Retail Price</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-200 text-gray-700 text-sm">$</span>
                    <Input
                      value={retailPrice}
                      onChange={(e) => setRetailPrice(e.target.value)}
                      placeholder="--"
                      className="rounded-l-none bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-700 mb-1 block">Gross Profit</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-200 text-gray-700 text-sm">$</span>
                    <Input
                      value={grossProfit}
                      onChange={(e) => setGrossProfit(e.target.value)}
                      placeholder="--"
                      className="rounded-l-none bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
