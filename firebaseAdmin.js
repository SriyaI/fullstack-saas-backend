// firebaseAdmin.js
import admin from 'firebase-admin';
import serviceAccount from './assignment-4c669-firebase-adminsdk-wpvf6-412002d2c5.json'; // Update with your path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
