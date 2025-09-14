import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const testFirebaseConnection = async () => {
  try {
    console.log('🔗 Testing Firebase connection...');
    
    const factoriesRef = collection(db, 'factories');
    const querySnapshot = await getDocs(factoriesRef);
    
    console.log(`✅ Successfully connected to Firebase!`);
    console.log(`📊 Found ${querySnapshot.size} documents in 'factories' collection`);
    
    if (querySnapshot.size > 0) {
      console.log('📋 Sample document structure:');
      const firstDoc = querySnapshot.docs[0];
      const data = firstDoc.data();
      console.log('Document ID:', firstDoc.id);
      console.log('Document Data:', JSON.stringify(data, null, 2));
      
      // Log all available fields
      const fields = Object.keys(data);
      console.log('📝 Available fields:', fields);
    }
    
    return {
      success: true,
      count: querySnapshot.size,
      documents: querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    };
  } catch (error) {
    console.error('❌ Firebase connection error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      count: 0,
      documents: []
    };
  }
};

export const importLatestFactoryData = async () => {
  try {
    console.log('📥 Importing latest factory data from Firebase...');
    
    const factoriesRef = collection(db, 'factories');
    const querySnapshot = await getDocs(factoriesRef);
    
    const factories = [];
    querySnapshot.forEach((doc) => {
      factories.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`✅ Successfully imported ${factories.length} factories from Firebase`);
    
    // Log sample of imported data
    if (factories.length > 0) {
      console.log('📋 Sample imported factory:', JSON.stringify(factories[0], null, 2));
    }
    
    return factories;
  } catch (error) {
    console.error('❌ Error importing factory data:', error);
    throw error;
  }
};