'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Share, Star, Plus, Package, Paperclip, X } from 'lucide-react';
import { Manufacturer } from '@/types';
import { getManufacturerById } from '@/services/manufacturerService';
import { logMessage } from '@/services/messageService';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function ManufacturerProfilePage() {
  const params = useParams();
  const { currentUser, userData } = useAuth();
  const [manufacturer, setManufacturer] = useState<Manufacturer | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(true);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [messageAttachments, setMessageAttachments] = useState<File[]>([]);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [shareRecipient, setShareRecipient] = useState('');

  // Default manufacturer data for fallback
  const getDefaultManufacturer = (): Manufacturer => ({
    id: params.id as string,
    userId: 'user_unknown',
    companyName: 'Manufacturer Not Found',
    location: 'Unknown Location',
    description: 'Manufacturer details are currently unavailable. Please try again later or contact support.',
    services: ['Manufacturing'],
    productOfferings: ['General Manufacturing'],
    moq: 100,
    leadTime: '3-4 wks',
    certifications: ['ISO 9001'],
    notableClients: ['Various Brands'],
    images: ['/api/placeholder/600/400'],
    reviews: [],
    responseTime: '24 Hours',
    totalOrders: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    website: '',
    email: '',
    phoneNumber: '',
  });

  useEffect(() => {
    const loadManufacturer = async () => {
      setLoading(true);
      try {
        console.log(`🔍 Loading manufacturer detail for ID: ${params.id}`);
        const manufacturerData = await getManufacturerById(params.id as string);
        if (manufacturerData) {
          setManufacturer(manufacturerData);
          console.log(`✅ Loaded manufacturer detail from Firebase:`, {
            name: manufacturerData.companyName,
            services: manufacturerData.services,
            location: manufacturerData.location
          });
        } else {
          console.warn(`⚠️ No manufacturer found for ID: ${params.id}, using fallback`);
          // Fallback to default data if not found in Firebase
          setManufacturer(getDefaultManufacturer());
        }
      } catch (error) {
        console.error('❌ Error loading manufacturer:', error);
        // Fallback to default data on error
        setManufacturer(getDefaultManufacturer());
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
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="max-w-4xl mx-auto">
            {/* Loading skeleton */}
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="h-80 bg-gray-200 rounded-lg"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!manufacturer) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="max-w-2xl mx-auto text-center">
            <Package className="h-20 w-20 mx-auto mb-6 text-gray-400" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Manufacturer Not Found</h1>
            <p className="text-gray-600 mb-8">
              The manufacturer that you&apos;re looking for doesn&apos;t exist or may have been removed.
            </p>
            <div className="space-x-4">
              <Button asChild>
                <Link href="/manufacturers">
                  Browse All Manufacturers
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-8 pt-48">
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
          <div className="flex-1">
            <div className="mb-2">
              <h1 className="text-3xl font-bold">{manufacturer.companyName}</h1>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span>📍 {manufacturer.location}</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => setShowShareDialog(true)}
            >
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-6"
              onClick={() => setShowMessageDialog(true)}
            >
              Start Message
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
                {manufacturer.images && manufacturer.images[0] && !manufacturer.images[0].includes('placeholder') ? (
                  <img
                    src={manufacturer.images[0]}
                    alt={manufacturer.companyName}
                    className="w-full h-full object-cover"
                  />
                ) : (
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
                )}
              </div>
            </div>

            {/* Small Thumbnail Images on Right */}
            <div className="w-24 flex flex-col gap-2">
              {[1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className="w-full flex-1 bg-gradient-to-br from-gray-100 to-gray-200 rounded relative overflow-hidden"
                >
                  {manufacturer.images && manufacturer.images[index] && !manufacturer.images[index].includes('placeholder') ? (
                    <img
                      src={manufacturer.images[index]}
                      alt={`${manufacturer.companyName} - ${index}`}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-75 transition-opacity"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-100/30 to-purple-100/30 flex items-center justify-center">
                      <div className="w-5 h-5 bg-white/80 rounded-full flex items-center justify-center">
                        <svg className="h-2.5 w-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  )}
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
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h4 className="font-semibold mb-4">Manufacturing Details</h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Minimum Order Quantity:</span>
                    <span className="text-sm font-semibold">{manufacturer.moq.toLocaleString()} pcs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Lead Time:</span>
                    <span className="text-sm font-semibold">{manufacturer.leadTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Orders:</span>
                    <span className="text-sm font-semibold">{manufacturer.totalOrders.toLocaleString()}+</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Location:</span>
                    <span className="text-sm font-semibold">{manufacturer.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Services Offered:</span>
                    <span className="text-sm font-semibold">{manufacturer.services.length}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Notable Clients and Contact Information Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Notable Clients */}
          {manufacturer.notableClients && manufacturer.notableClients.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Notable Clients:</h4>
              <div className="text-sm text-gray-700">
                {manufacturer.notableClients.map((client, index) => (
                  <span key={client}>
                    {index > 0 && <span className="mx-2">•</span>}
                    {client}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact Information */}
          {(manufacturer.website || manufacturer.phoneNumber) && (
            <div>
              <h4 className="font-semibold mb-3">Contact Information:</h4>
              <div className="text-sm text-gray-700 space-y-1">
                {manufacturer.website && (
                  <div>
                    <span>Website:</span>{' '}
                    <a href={manufacturer.website} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700">
                      {manufacturer.website}
                    </a>
                  </div>
                )}
                {manufacturer.phoneNumber && (
                  <div>
                    <span>Phone:</span> {manufacturer.phoneNumber}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Services and Product Offerings - Inline Below */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Services */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">Services:</h3>
            <div className="flex flex-wrap gap-2">
              {manufacturer.services.map((service) => (
                <Badge key={service} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-2.5 py-1 rounded-full border border-gray-300">
                  {service}
                </Badge>
              ))}
            </div>
          </div>

          {/* Product Offerings */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">Product Offerings:</h3>
            <div className="flex flex-wrap gap-2">
              {manufacturer.productOfferings.map((offering) => (
                <Badge key={offering} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-2.5 py-1 rounded-full border border-gray-300">
                  {offering}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Reviews ({manufacturer.reviews.length})</h3>
            <Button
              variant="outline"
              className="bg-white text-pink-600 border-pink-600 rounded-full hover:bg-pink-600 hover:text-white transition-colors"
              onClick={() => setShowReviewDialog(true)}
            >
              Write a Review
            </Button>
          </div>

          {/* Share Dialog */}
          <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Manufacturer</DialogTitle>
                <DialogDescription>
                  Share {manufacturer.companyName} with your contacts
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Recipient */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Send To</label>
                  <Input
                    value={shareRecipient}
                    onChange={(e) => setShareRecipient(e.target.value)}
                    placeholder="Enter email or username..."
                  />
                </div>

                {/* Share URL */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Share Link</label>
                  <div className="flex gap-2">
                    <Input
                      value={typeof window !== 'undefined' ? window.location.href : ''}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          navigator.clipboard.writeText(window.location.href);
                          alert('Link copied to clipboard!');
                        }
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Message (Optional)</label>
                  <Textarea
                    value={shareMessage}
                    onChange={(e) => setShareMessage(e.target.value)}
                    placeholder="Add a message to share with this manufacturer..."
                    rows={4}
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowShareDialog(false);
                      setShareMessage('');
                      setShareRecipient('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-pink-600 hover:bg-pink-700 text-white"
                    onClick={() => {
                      if (!shareRecipient.trim()) {
                        alert('Please enter a recipient email or username.');
                        return;
                      }

                      // Navigate to messages page to share via chat
                      const shareText = shareMessage
                        ? `${shareMessage}\n\nCheck out ${manufacturer.companyName}: ${typeof window !== 'undefined' ? window.location.href : ''}`
                        : `Check out ${manufacturer.companyName}: ${typeof window !== 'undefined' ? window.location.href : ''}`;

                      // TODO: Send message to recipient via chat system
                      console.log('Sharing with:', shareRecipient);
                      console.log('Message:', shareText);

                      alert(`Manufacturer shared with ${shareRecipient}!`);

                      setShowShareDialog(false);
                      setShareMessage('');
                      setShareRecipient('');
                    }}
                    disabled={!shareRecipient.trim()}
                  >
                    Share via Chat
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Message Dialog */}
          <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Message</DialogTitle>
                <DialogDescription>
                  Start a conversation with {manufacturer.companyName}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Subject */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Input
                    value={messageSubject}
                    onChange={(e) => setMessageSubject(e.target.value)}
                    placeholder="Enter message subject..."
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Type your message here..."
                    rows={6}
                  />
                </div>

                {/* Attachments */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Attachments</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.multiple = true;
                          input.accept = 'image/*,video/*,.pdf,.doc,.docx';
                          input.onchange = (e) => {
                            const files = Array.from((e.target as HTMLInputElement).files || []);
                            setMessageAttachments([...messageAttachments, ...files]);
                          };
                          input.click();
                        }}
                      >
                        <Paperclip className="h-4 w-4 mr-2" />
                        Add Files
                      </Button>
                      <span className="text-xs text-gray-500">
                        Images, videos, PDFs, or documents
                      </span>
                    </div>

                    {/* Display attached files */}
                    {messageAttachments.length > 0 && (
                      <div className="space-y-2">
                        {messageAttachments.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-50 rounded p-2 text-sm"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <Paperclip className="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <span className="truncate">{file.name}</span>
                              <span className="text-xs text-gray-500 flex-shrink-0">
                                ({(file.size / 1024).toFixed(1)} KB)
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                setMessageAttachments(
                                  messageAttachments.filter((_, i) => i !== index)
                                );
                              }}
                              className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowMessageDialog(false);
                      setMessageSubject('');
                      setMessageContent('');
                      setMessageAttachments([]);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-pink-600 hover:bg-pink-700 text-white"
                    onClick={async () => {
                      if (messageSubject.trim() && messageContent.trim() && currentUser && userData) {
                        try {
                          // Log message to Firebase
                          await logMessage({
                            senderId: currentUser.uid,
                            senderName: userData.name,
                            recipientId: manufacturer.id,
                            recipientEmail: manufacturer.email || '',
                            subject: messageSubject,
                            content: messageContent,
                            attachments: messageAttachments.map(f => f.name)
                          });

                          // Send email to manufacturer
                          const mailtoLink = `mailto:${manufacturer.email}?subject=${encodeURIComponent(messageSubject)}&body=${encodeURIComponent(messageContent)}`;
                          window.location.href = mailtoLink;

                          setShowMessageDialog(false);
                          setMessageSubject('');
                          setMessageContent('');
                          setMessageAttachments([]);
                        } catch (error) {
                          console.error('Failed to log message:', error);
                          alert('Failed to send message. Please try again.');
                        }
                      }
                    }}
                    disabled={!messageSubject.trim() || !messageContent.trim()}
                  >
                    Send Message
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Review Dialog */}
          <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Write a Review</DialogTitle>
                <DialogDescription>
                  Share your experience with {manufacturer.companyName}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Rating */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Review</label>
                  <Textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience working with this manufacturer..."
                    rows={4}
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowReviewDialog(false);
                      setRating(0);
                      setReviewText('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-pink-600 hover:bg-pink-700 text-white"
                    onClick={() => {
                      if (rating > 0 && reviewText.trim()) {
                        // Add review logic here
                        const newReview = {
                          clientName: userData?.name || 'Anonymous',
                          rating,
                          review: reviewText,
                          date: new Date()
                        };
                        setManufacturer({
                          ...manufacturer,
                          reviews: [...manufacturer.reviews, newReview]
                        });
                        setShowReviewDialog(false);
                        setRating(0);
                        setReviewText('');
                      }
                    }}
                    disabled={rating === 0 || !reviewText.trim()}
                  >
                    Submit Review
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {manufacturer.reviews.length > 0 ? (
            <>
              <div className="space-y-6">
                {manufacturer.reviews.slice(0, 3).map((review, index) => (
                  <div key={index}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-sm">{review.clientName}</span>
                      <div className="flex">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                        {[...Array(5 - review.rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 text-gray-300" />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">
                        {review.date.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{review.review}</p>
                  </div>
                ))}
              </div>

              {manufacturer.reviews.length > 3 && (
                <div className="mt-6 text-center">
                  <Button variant="outline" className="bg-white text-pink-600 border-pink-600 rounded-full hover:bg-pink-600 hover:text-white transition-colors">
                    See All Reviews
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Be the first to write a review.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}