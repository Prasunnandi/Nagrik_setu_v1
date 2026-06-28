const fs = require('fs');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, setDoc } = require('firebase/firestore');

// Load environment variables from .env.local
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

// Simulate the reply from the screenshot
const reply = `Hello! Thank you for reporting this issue.

I've registered your complaint regarding garbage accumulation at Dum Dum Cantonment.

Here are the details:
📍 Location: Dum Dum Cantonment, Kolkata
🏛️ Department: Sanitation Department
⏰ SLA Deadline: Within 48 hours
🆔 Complaint ID: NS-KOL-20240728-0001

We appreciate your vigilance in keeping our city clean!

Track: hot-news-clean.loca.lt`;

const userText = 'garbage dumdum cantonment';

async function testSync() {
  try {
    const idMatch = reply.match(/(?:ID|Complaint ID)[:\s*]*([NS|NG]{2}-[A-Z]{3}-\d{8}-\d{4})/i);
    if (!idMatch) {
      console.log('Regex failed to match ID!');
      process.exit(1);
    }
    const complaintId = idMatch[1].toUpperCase();
    console.log('Matched ID:', complaintId);

    const locMatch = reply.match(/(?:Location|📍)[:\s*]*([^\n\r]+)/i);
    const address = locMatch ? locMatch[1].trim().replace(/[*\-\s]+$/, '') : 'Location not specified';
    console.log('Matched Address:', address);

    const deptMatch = reply.match(/(?:Department|🏛️)[:\s*]*([^\n\r|]+)/i);
    const department = deptMatch ? deptMatch[1].trim().replace(/[*\-\s]+$/, '') : 'Municipal Services';
    console.log('Matched Department:', department);

    let issueType = 'SOLID_WASTE';
    const lowerReply = reply.toLowerCase();
    if (lowerReply.includes('pothole') || lowerReply.includes('road')) {
      issueType = 'POTHOLE';
    } else if (lowerReply.includes('light') || lowerReply.includes('electricity')) {
      issueType = 'STREET_LIGHT';
    }
    console.log('Issue Type:', issueType);

    let severity = 'HIGH';
    if (lowerReply.includes('critical')) severity = 'CRITICAL';
    else if (lowerReply.includes('medium')) severity = 'MEDIUM';
    else if (lowerReply.includes('low')) severity = 'LOW';
    console.log('Severity:', severity);

    let lat = 22.5726;
    let lng = 88.3639;
    let ward = 'Ward 57';
    if (lowerReply.includes('dumdum') || lowerReply.includes('dum dum') || address.toLowerCase().includes('dum dum') || address.toLowerCase().includes('dumdum')) {
      lat = 22.6200;
      lng = 88.4200;
      ward = 'Dum Dum';
    }
    console.log('Coordinates:', lat, lng, 'Ward:', ward);

    // Save to Firestore
    const docRef = doc(db, 'complaints', complaintId);
    await setDoc(docRef, {
      id: complaintId,
      issueType,
      severity,
      status: 'FILED',
      location: {
        lat,
        lng,
        address,
        ward,
        city: 'KOLKATA',
        wardNumber: 57
      },
      department,
      municipalBody: 'Kolkata Municipal Corporation',
      filedAt: new Date().toISOString(),
      userId: 'test-user',
      userName: 'Test Citizen',
      description: userText
    });
    console.log('Successfully saved to DB!');
    
    // Now verify by reading it back
    const verifySnap = await getDoc(docRef);
    if (verifySnap.exists()) {
      console.log('Verification Success! Document read back:', verifySnap.data());
    } else {
      console.log('Verification failed: Document not found after set!');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error during testSync:', err);
    process.exit(1);
  }
}

testSync();
