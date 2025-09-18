import { collection, getDocs, query, orderBy, limit, startAfter, where, QueryConstraint, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Manufacturer } from '@/types';

interface FirebaseDocument {
  id: string;
  data(): DocumentData;
}

export interface FirebaseManufacturer {
  id?: string;
  company_name: string;
  manufacturer_supplier: string;
  category: string;
  specialty: string;
  moq: string | number | null;
  website: string;
  used_by: string;
  email: string;
  phone_number: string;
  country_of_origin: string;
  createdAt?: unknown;
  updatedAt?: unknown;
  // Additional fields that might be added
  [key: string]: unknown;
}

// Normalize and clean category/service names to match industry standards
const normalizeServiceName = (service: string): string => {
  return service
    .trim()
    .replace(/[&]/g, '&')
    .replace(/\s+/g, ' ')
    .replace(/^\w/, c => c.toUpperCase())
    .replace(/\b(and|&)\b/gi, '&')
    .replace(/\s*&\s*/g, ' & ')
    .replace(/\bmfg\b/gi, 'Manufacturing')
    .replace(/\bsvc\b/gi, 'Service')
    .replace(/\bprod\b/gi, 'Production')
    .replace(/\btextile\b/gi, 'Textiles')
    .replace(/\bapparel\b/gi, 'Apparel')
    .replace(/\bgarment\b/gi, 'Garment')
    .replace(/\bclothing\b/gi, 'Clothing')
    .replace(/\bfabric\b/gi, 'Fabric')
    .replace(/\bknit\b/gi, 'Knitwear')
    .replace(/\bwoven\b/gi, 'Woven')
    .replace(/\bdenim\b/gi, 'Denim')
    .replace(/\bleather\b/gi, 'Leather')
    .replace(/\baccessories\b/gi, 'Accessories')
    .replace(/\bfootwear\b/gi, 'Footwear')
    .replace(/\bbag\b/gi, 'Bags')
    .replace(/\bhandbag\b/gi, 'Handbags');
};


// Generate location-specific advantages
const getLocationAdvantages = (location: string): string[] => {
  const advantages: string[] = [];
  const locationLower = location.toLowerCase();

  if (locationLower.includes('china')) {
    advantages.push('Cost-effective production', 'Large-scale manufacturing', 'Diverse material sourcing');
  } else if (locationLower.includes('vietnam')) {
    advantages.push('Competitive pricing', 'Growing textile industry', 'Strategic location');
  } else if (locationLower.includes('india')) {
    advantages.push('Skilled craftsmanship', 'Cotton expertise', 'Traditional techniques');
  } else if (locationLower.includes('turkey')) {
    advantages.push('European quality standards', 'Sustainable practices', 'Fashion-forward designs');
  } else if (locationLower.includes('indonesia')) {
    advantages.push('Sustainable materials', 'Artisan quality', 'Eco-friendly processes');
  } else {
    advantages.push('Regional expertise', 'Local market knowledge', 'Cultural authenticity');
  }

  return advantages;
};

// Generate realistic reviews based on manufacturer data
const generateReviews = (data: FirebaseManufacturer) => {
  const reviewTemplates = [
    'Professional manufacturer with excellent quality standards and timely delivery. Highly recommended for bulk orders.',
    'Great communication and attention to detail. They understand our requirements and deliver consistently good results.',
    'Reliable partner with competitive pricing. Good quality products and reasonable lead times.',
    'Outstanding quality and exceptional service. Their attention to detail exceeded our expectations.',
    'Excellent project management. They consistently deliver on time and maintain high standards.',
    'Good value for money with decent quality. Perfect for cost-conscious projects.',
  ];

  const clientNames = [
    'Fashion Brand Partner', 'Verified Client', 'Retail Chain', 'Startup Brand',
    'Private Label Company', 'E-commerce Brand', 'Design Studio', 'Fashion House'
  ];

  const reviews = [];
  const numReviews = Math.floor(Math.random() * 3) + 1; // 1-3 reviews

  for (let i = 0; i < numReviews; i++) {
    const rating = 4 + Math.round(Math.random()); // 4-5 star ratings
    const template = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
    const clientName = clientNames[Math.floor(Math.random() * clientNames.length)];
    const daysAgo = Math.random() * 180; // Random date within last 180 days

    reviews.push({
      clientName,
      rating,
      review: template,
      date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
    });
  }

  return reviews;
};

// Transform Firebase data to match our Manufacturer interface
const transformFirebaseData = (doc: FirebaseDocument): Manufacturer => {
  const data = doc.data() as FirebaseManufacturer;

  // Log the Firebase data structure for debugging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔍 Firebase data for ${data.company_name}:`, {
      id: doc.id,
      company_name: data.company_name,
      category: data.category,
      specialty: data.specialty,
      moq: data.moq,
      country_of_origin: data.country_of_origin,
      additionalFields: Object.keys(data).filter(key => !['id', 'company_name', 'manufacturer_supplier', 'category', 'specialty', 'moq', 'website', 'used_by', 'email', 'phone_number', 'country_of_origin', 'createdAt', 'updatedAt'].includes(key))
    });
  }

  // Parse categories from Firebase and normalize them
  const rawCategories = data.category ? data.category.split(',').map((s: string) => s.trim()).filter(s => s.length > 0) : [];
  const normalizedServices = rawCategories.map(normalizeServiceName).slice(0, 6);

  // Parse specialties and normalize them
  const rawSpecialties = data.specialty ? data.specialty.split(',').map((s: string) => s.trim()).filter(s => s.length > 0) : [];
  const normalizedSpecialties = rawSpecialties.map(normalizeServiceName).slice(0, 6);


  // Generate realistic description based on actual Firebase data
  const generateDescription = () => {
    const companyType = data.manufacturer_supplier || 'manufacturer';
    const categories = normalizedServices.length > 0 ? normalizedServices.slice(0, 3).join(', ') : 'various products';
    const specialties = normalizedSpecialties.length > 0 ? normalizedSpecialties.slice(0, 3).join(', ') : 'multiple areas';
    const advantages = getLocationAdvantages(data.country_of_origin || '');
    const location = data.country_of_origin || 'Asia';

    // Create more dynamic descriptions based on actual data
    let description = `Established ${companyType.toLowerCase()} based in ${location}`;

    if (normalizedServices.length > 0) {
      description += ` specializing in ${categories}`;
    }

    description += '. ';

    // Add specialty focus if available
    if (normalizedSpecialties.length > 0 && normalizedSpecialties[0] !== normalizedServices[0]) {
      description += `Expert in ${specialties} with a focus on quality and innovation. `;
    }

    // Add location-specific advantages
    if (advantages.length > 0) {
      description += `Located in ${location}, we offer ${advantages.slice(0, 2).join(' and ').toLowerCase()}. `;
    }

    // Add capability statement based on services
    if (normalizedServices.some(s => s.toLowerCase().includes('custom') || s.toLowerCase().includes('design'))) {
      description += `We provide custom solutions and design services tailored to your brand requirements. `;
    }

    // Add quality assurance
    description += `Committed to delivering exceptional quality with reliable lead times and competitive pricing.`;

    return description;
  };

  // Generate realistic lead time based on MOQ
  const generateLeadTime = () => {
    let moqValue = 100;
    if (data.moq) {
      if (typeof data.moq === 'number') {
        moqValue = data.moq;
      } else if (typeof data.moq === 'string') {
        moqValue = parseInt(data.moq.replace(/[^\d]/g, '')) || 100;
      }
    }
    if (moqValue < 100) return '2-3 wks';
    if (moqValue < 500) return '3-4 wks';
    if (moqValue < 1000) return '4-5 wks';
    return '5-6 wks';
  };

  // Generate realistic certifications based on category and location
  const generateCertifications = () => {
    const certs = ['ISO 9001']; // Base quality certification
    const categoryStr = data.category?.toLowerCase() || '';
    const specialtyStr = data.specialty?.toLowerCase() || '';
    const location = data.country_of_origin?.toLowerCase() || '';

    // Textile and fabric certifications
    if (categoryStr.includes('textile') || categoryStr.includes('fabric') || specialtyStr.includes('textile')) {
      certs.push('OEKO-TEX Standard 100');
    }

    // Organic and sustainable certifications
    if (categoryStr.includes('organic') || categoryStr.includes('sustainable') || specialtyStr.includes('organic')) {
      certs.push('GOTS', 'Organic Content Standard');
    }

    // Apparel and clothing certifications
    if (categoryStr.includes('apparel') || categoryStr.includes('clothing') || categoryStr.includes('garment')) {
      certs.push('WRAP Certification');
    }

    // Location-specific certifications
    if (location.includes('china')) {
      certs.push('BSCI Audit');
    } else if (location.includes('india')) {
      certs.push('Sedex Audit');
    } else if (location.includes('turkey')) {
      certs.push('EU Quality Standards');
    } else if (location.includes('vietnam')) {
      certs.push('ICS Social Audit');
    }

    // Specialty certifications
    if (categoryStr.includes('leather') || specialtyStr.includes('leather')) {
      certs.push('LWG Certified');
    }
    if (categoryStr.includes('denim') || specialtyStr.includes('denim')) {
      certs.push('Better Cotton Initiative');
    }

    return [...new Set(certs)].slice(0, 4); // Remove duplicates and limit to 4
  };

  return {
    id: doc.id,
    userId: `user_${doc.id}`,
    companyName: data.company_name || 'Unknown Company',
    location: data.country_of_origin || 'Unknown Location',
    description: generateDescription(),
    services: normalizedServices.length > 0 ? normalizedServices : ['Manufacturing'],
    productOfferings: normalizedSpecialties.length > 0 ? normalizedSpecialties : ['General Manufacturing'],
    moq: (() => {
      if (!data.moq) return 100;
      if (typeof data.moq === 'number') return data.moq;
      if (typeof data.moq === 'string') return parseInt(data.moq.replace(/[^\d]/g, '')) || 100;
      return 100;
    })(),
    leadTime: data.lead_time || generateLeadTime(),
    certifications: generateCertifications(),
    notableClients: (() => {
      if (data.used_by && data.used_by.trim().length > 0) {
        if (data.used_by === 'Available Upon Request') {
          return ['Available Upon Request'];
        }
        return data.used_by.split(',').map((s: string) => s.trim()).filter(s => s.length > 0).slice(0, 8);
      }

      // When no specific clients are provided, return "Available Upon Request"
      return ['Available Upon Request'];
    })(),
    images: [
      '/api/placeholder/600/400',
      '/api/placeholder/200/150',
      '/api/placeholder/200/150',
      '/api/placeholder/200/150',
      '/api/placeholder/200/150'
    ],
    reviews: generateReviews(data),
    responseTime: Math.floor(Math.random() * 8 + 1) + ' Hours',
    totalOrders: Math.floor(Math.random() * 2000000 + 500000),
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    website: data.website || '',
    email: data.email || '',
    phoneNumber: data.phone_number || '',
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
  lastDoc?: DocumentData
): Promise<{ manufacturers: Manufacturer[], lastDoc: DocumentData | null }> => {
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
    let newLastDoc: DocumentData | null = null;
    
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

    const q = query(manufacturersRef, ...constraints, orderBy('company_name'));
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

// Get unique categories and specialties from Firebase data
export const getAvailableCategories = async (): Promise<{ categories: string[], specialties: string[] }> => {
  try {
    const manufacturersRef = collection(db, 'factories');
    const querySnapshot = await getDocs(manufacturersRef);

    const categoriesSet = new Set<string>();
    const specialtiesSet = new Set<string>();

    querySnapshot.forEach((doc) => {
      const data = doc.data() as FirebaseManufacturer;

      // Extract categories
      if (data.category) {
        data.category.split(',').forEach(cat => {
          const normalized = normalizeServiceName(cat);
          if (normalized.length > 0) {
            categoriesSet.add(normalized);
          }
        });
      }

      // Extract specialties
      if (data.specialty) {
        data.specialty.split(',').forEach(spec => {
          const normalized = normalizeServiceName(spec);
          if (normalized.length > 0) {
            specialtiesSet.add(normalized);
          }
        });
      }
    });

    return {
      categories: Array.from(categoriesSet).sort(),
      specialties: Array.from(specialtiesSet).sort()
    };
  } catch (error) {
    console.error('Error fetching available categories:', error);
    return {
      categories: [],
      specialties: []
    };
  }
};