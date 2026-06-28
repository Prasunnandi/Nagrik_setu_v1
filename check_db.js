const admin = require('firebase-admin');
const fs = require('fs');

const credPath = 'c:/Users/prasu/Downloads/nagrik-setu/service-account.json';
if (fs.existsSync(credPath)) {
  const serviceAccount = require(credPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  const db = admin.firestore();
  
  db.collection('complaints').document('NS-KOL-20240728-0001').get()
    .then(doc => {
      if (doc.exists) {
        console.log('Found NS-KOL-20240728-0001 in DB!');
        console.log(doc.data());
      } else {
        console.log('NS-KOL-20240728-0001 not found in DB.');
      }
      return db.collection('complaints').document('NS-KOL-20240728-1234').get();
    })
    .then(doc2 => {
      if (doc2.exists) {
        console.log('Found NS-KOL-20240728-1234 in DB!');
      } else {
        console.log('NS-KOL-20240728-1234 not found in DB.');
      }
      process.exit(0);
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
} else {
  console.log('service-account.json not found');
  process.exit(1);
}
