import { collection, getDocs, query, orderBy, limit, startAfter, where, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Manufacturer } from '@/types';

export interface FirebaseManufacturer {
  id?: string;
  company_name: string;
  manufacturer_supplier: string;
  category: string;
  specialty: string;
  moq: string | null;
  website: string;
  used_by: string;
  email: string;
  phone_number: string;
  country_of_origin: string;
  createdAt?: any;
  updatedAt?: any;
}

// Transform Firebase data to match our Manufacturer interface
const transformFirebaseData = (doc: any): Manufacturer => {
  const data = doc.data() as FirebaseManufacturer;
  
  return {
    id: doc.id,
    userId: `user_${doc.id}`,
    companyName: data.company_name || 'Unknown Company',
    location: data.country_of_origin || 'Unknown Location',
    description: `${data.manufacturer_supplier || 'Manufacturer'} specializing in ${data.category || 'various products'} with expertise in ${data.specialty || 'multiple areas'}.`,
    services: data.category ? data.category.split(',').map((s: string) => s.trim()).slice(0, 6) : ['Manufacturing'],
    productOfferings: data.specialty ? data.specialty.split(',').map((s: string) => s.trim()).slice(0, 6) : ['General Manufacturing'],
    moq: data.moq ? parseInt(data.moq.replace(/[^\d]/g, '')) || 100 : 100,
    leadTime: '3-4 wks',
    certifications: ['ISO 9001'],
    notableClients: data.used_by && data.used_by !== 'Available Upon Request' 
      ? data.used_by.split(',').map((s: string) => s.trim()).slice(0, 8)
      : ['Various Brands'],
    images: ['/api/placeholder/400/300'],
    reviews: [{
      clientName: 'Verified Client',
      rating: 4 + Math.round(Math.random()),
      review: 'Professional manufacturer with good quality standards.',
      date: new Date()
    }],
    responseTime: Math.floor(Math.random() * 6 + 1) + ' Hours',
    totalOrders: Math.floor(Math.random() * 1000000 + 500000),
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    website: data.website,
    email: data.email,
    phoneNumber: data.phone_number,
  };
};

// Get all manufacturers from Firebase
export const getAllManufacturers = async (): Promise<Manufacturer[]> => {
  try {
    const manufacturersRef = collection(db, 'factories');
    const q = query(manufacturersRef, orderBy('company_name'));
    const querySnapshot = await getDocs(q);
    
    const manufacturers: Manufacturer[] = [];
    querySnapshot.forEach((doc) => {
      manufacturers.push(transformFirebaseData(doc));
    });
    
    return manufacturers;
  } catch (error) {
    console.error('Error fetching manufacturers from Firebase:', error);
    return [];
  }
};

// Get paginated manufacturers
export const getPaginatedManufacturers = async (
  pageSize: number = 50,
  lastDoc?: any
): Promise<{ manufacturers: Manufacturer[], lastDoc: any }> => {
  try {
    const manufacturersRef = collection(db, 'factories');
    let q = query(
      manufacturersRef,
      orderBy('company_name'),
      limit(pageSize)
    );
    
    if (lastDoc) {
      q = query(
        manufacturersRef,
        orderBy('company_name'),
        startAfter(lastDoc),
        limit(pageSize)
      );
    }
    
    const querySnapshot = await getDocs(q);
    
    const manufacturers: Manufacturer[] = [];
    let newLastDoc = null;
    
    querySnapshot.forEach((doc) => {
      manufacturers.push(transformFirebaseData(doc));
      newLastDoc = doc;
    });
    
    return { manufacturers, lastDoc: newLastDoc };
  } catch (error) {
    console.error('Error fetching paginated manufacturers:', error);
    return { manufacturers: [], lastDoc: null };
  }
};

// Search manufacturers
export const searchManufacturers = async (searchTerm: string): Promise<Manufacturer[]> => {
  try {
    const manufacturersRef = collection(db, 'factories');
    
    // Firebase doesn't support full-text search natively, so we'll get all docs and filter client-side
    // For production, consider using Algolia or Elasticsearch
    const querySnapshot = await getDocs(manufacturersRef);
    
    const manufacturers: Manufacturer[] = [];
    querySnapshot.forEach((doc) => {
      const manufacturer = transformFirebaseData(doc);
      const searchLower = searchTerm.toLowerCase();
      
      if (
        manufacturer.companyName.toLowerCase().includes(searchLower) ||
        manufacturer.location.toLowerCase().includes(searchLower) ||
        manufacturer.services.some(service => service.toLowerCase().includes(searchLower)) ||
        manufacturer.productOfferings.some(product => product.toLowerCase().includes(searchLower)) ||
        manufacturer.notableClients.some(client => client.toLowerCase().includes(searchLower))
      ) {
        manufacturers.push(manufacturer);
      }
    });
    
    return manufacturers.sort((a, b) => a.companyName.localeCompare(b.companyName));
  } catch (error) {
    console.error('Error searching manufacturers:', error);
    return [];
  }
};

// Filter manufacturers by criteria
export const filterManufacturers = async (filters: {
  location?: string;
  category?: string;
  specialty?: string;
  moqRange?: string;
}): Promise<Manufacturer[]> => {
  try {
    const manufacturersRef = collection(db, 'factories');
    const constraints: QueryConstraint[] = [];
    
    // Add location filter
    if (filters.location && filters.location !== 'all') {
      constraints.push(where('country_of_origin', '==', filters.location));
    }
    
    // Add category filter  
    if (filters.category && filters.category !== 'all') {
      constraints.push(where('category', 'array-contains', filters.category));
    }
    
    let q = query(manufacturersRef, ...constraints, orderBy('company_name'));
    const querySnapshot = await getDocs(q);
    
    const manufacturers: Manufacturer[] = [];
    querySnapshot.forEach((doc) => {
      manufacturers.push(transformFirebaseData(doc));
    });
    
    return manufacturers;
  } catch (error) {
    console.error('Error filtering manufacturers:', error);
    return [];
  }
};

// Get single manufacturer by ID
export const getManufacturerById = async (id: string): Promise<Manufacturer | null> => {
  try {
    const manufacturersRef = collection(db, 'factories');
    const q = query(manufacturersRef, where('__name__', '==', id));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return transformFirebaseData(doc);
  } catch (error) {
    console.error('Error fetching manufacturer by ID:', error);
    return null;
  }
};