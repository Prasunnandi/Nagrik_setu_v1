const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');
const fs = require('fs');

if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  envContent.split(/\r?\n/).forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
      process.env[key] = val;
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

async function checkDocs() {
  try {
    const docRef1 = doc(db, 'complaints', 'NS-KOL-20240728-0001');
    const snap1 = await getDoc(docRef1);
    if (snap1.exists()) {
      console.log('Found NS-KOL-20240728-0001 in DB!');
      console.log(snap1.data());
    } else {
      console.log('NS-KOL-20240728-0001 not found in DB.');
    }

    const docRef2 = doc(db, 'complaints', 'NS-KOL-20240728-1234');
    const snap2 = await getDoc(docRef2);
    if (snap2.exists()) {
      console.log('Found NS-KOL-20240728-1234 in DB!');
      console.log(snap2.data());
    } else {
      console.log('NS-KOL-20240728-1234 not found in DB.');
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkDocs();
