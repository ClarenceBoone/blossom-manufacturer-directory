const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDAuvbrLfTs8ENZBsGyb9CZrnwI2jT8zgs",
  authDomain: "factory-directory.firebaseapp.com",
  projectId: "factory-directory",
  storageBucket: "factory-directory.firebasestorage.app",
  messagingSenderId: "62125302802",
  appId: "1:62125302802:web:f72433cf8b8427703724cb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function importFactoriesData() {
  try {
    console.log('🔗 Connecting to Firebase...');
    
    const factoriesRef = collection(db, 'factories');
    console.log('📡 Fetching data from "factories" collection...');
    
    const querySnapshot = await getDocs(factoriesRef);
    
    console.log(`✅ Successfully connected to Firebase!`);
    console.log(`📊 Found ${querySnapshot.size} documents in "factories" collection\n`);
    
    if (querySnapshot.size === 0) {
      console.log('⚠️ No documents found in the "factories" collection');
      console.log('Make sure your collection name is correct and contains data');
      return;
    }
    
    const factories = [];
    let count = 0;
    
    querySnapshot.forEach((doc) => {
      count++;
      const data = doc.data();
      
      factories.push({
        id: doc.id,
        ...data
      });
      
      // Log first few documents for inspection
      if (count <= 3) {
        console.log(`📋 Document ${count} (ID: ${doc.id}):`);
        console.log('   Fields:', Object.keys(data).join(', '));
        console.log('   Sample data:', JSON.stringify({
          companyName: data.companyName || data['Company Name'],
          location: data.countryOfOrigin || data['Country of Origin'],
          category: data.category || data['Category'],
        }, null, 4));
        console.log('');
      }
    });
    
    console.log(`🎉 Successfully imported ${factories.length} factories from Firebase!`);
    
    // Show field analysis
    const allFields = new Set();
    factories.forEach(factory => {
      Object.keys(factory).forEach(key => allFields.add(key));
    });
    
    console.log('📝 All available fields in the collection:');
    Array.from(allFields).sort().forEach(field => {
      console.log(`   - ${field}`);
    });
    
    return factories;
  } catch (error) {
    console.error('❌ Error importing factory data:', error);
    if (error.code === 'permission-denied') {
      console.log('🔐 Check your Firebase security rules allow read access');
    }
    throw error;
  }
}

// Run the import
importFactoriesData()
  .then(() => {
    console.log('\n✅ Import completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Import failed:', error.message);
    process.exit(1);
  });