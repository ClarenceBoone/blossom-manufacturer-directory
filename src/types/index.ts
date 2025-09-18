export interface User {
  id: string;
  email: string;
  name: string;
  role: 'brand_owner' | 'manufacturer';
  profile: {
    company: string;
    location: string;
    avatar?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  userId: string;
  name: string;
  description: string;
  category: string;
  images: string[];
  specifications: Record<string, unknown>;
  files: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Manufacturer {
  id: string;
  userId: string;
  companyName: string;
  location: string;
  description: string;
  services: string[];
  productOfferings: string[];
  moq: number;
  leadTime: string;
  certifications: string[];
  notableClients: string[];
  images: string[];
  reviews: Review[];
  responseTime: string;
  totalOrders: number;
  createdAt: Date;
  updatedAt: Date;
  website?: string;
  email?: string;
  phoneNumber?: string;
}

export interface Review {
  clientName: string;
  rating: number;
  review: string;
  date: Date;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  attachments: string[];
  timestamp: Date;
  type: 'text' | 'file';
}

export interface MessageThread {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: Date;
  messages: Message[];
}

export interface FileDocument {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  size: number;
  uploadedAt: Date;
}