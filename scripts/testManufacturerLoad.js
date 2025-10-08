// Test script to verify manufacturer loading
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
    }
  });
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('📋 Testing manufacturer service...\n');
console.log('Firebase Config:');
console.log(`- Project ID: ${firebaseConfig.projectId}`);
console.log(`- Auth Domain: ${firebaseConfig.authDomain}\n`);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testLoad() {
  try {
    console.log('🔄 Fetching all manufacturers...\n');

    const factoriesRef = collection(db, 'factories');
    const snapshot = await getDocs(factoriesRef);

    console.log(`✅ Total manufacturers: ${snapshot.size}\n`);

    // Group by country
    const byCountry = {};
    snapshot.forEach((doc) => {
      const data = doc.data();
      const country = data.country_of_origin || 'Unknown';
      byCountry[country] = (byCountry[country] || 0) + 1;
    });

    console.log('📊 Manufacturers by country:');
    Object.entries(byCountry)
      .sort((a, b) => b[1] - a[1])
      .forEach(([country, count]) => {
        console.log(`   ${country}: ${count}`);
      });

    console.log(`\n✅ All manufacturers are accessible and should load in the app!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testLoad();
