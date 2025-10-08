// Script to check Firebase data
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, limit } = require('firebase/firestore');
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkData() {
  try {
    console.log('🔍 Checking Firebase factories collection...\n');

    const factoriesRef = collection(db, 'factories');
    const q = query(factoriesRef);
    const snapshot = await getDocs(q);

    console.log(`📊 Total documents found: ${snapshot.size}\n`);

    if (snapshot.empty) {
      console.log('❌ No manufacturers found in Firebase!');
      console.log('\nℹ️  You need to import factory data. Run:');
      console.log('   node scripts/importFactories.js');
    } else {
      console.log('✅ First 10 manufacturers:\n');
      let count = 0;
      snapshot.forEach((doc) => {
        if (count < 10) {
          const data = doc.data();
          console.log(`${count + 1}. ${data.company_name || 'Unknown'}`);
          console.log(`   Location: ${data.country_of_origin || 'Unknown'}`);
          console.log(`   Category: ${data.category || 'Unknown'}`);
          console.log(`   MOQ: ${data.moq || 'Unknown'}\n`);
          count++;
        }
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking Firebase:', error);
    process.exit(1);
  }
}

checkData();
