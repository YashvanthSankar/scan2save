import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID, 
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Handle Vercel/System environment variable newline differences
      privateKey: process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : undefined,
    }),
  });
}

export const adminAuth = admin.auth();
export const db = admin.firestore(); // Export Firestore if you need it
export default admin;