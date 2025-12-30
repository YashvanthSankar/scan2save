import * as admin from 'firebase-admin';

// Lazy initialization flag
let firebaseInitialized = false;

function initializeFirebaseAdmin() {
  if (firebaseInitialized || admin.apps.length > 0) {
    return true;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.warn('[Firebase Admin] Missing environment variables. Firebase Admin SDK not initialized.');
    console.warn('Required: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
    return false;
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        // Handle Vercel/System environment variable newline differences
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
    firebaseInitialized = true;
    console.log('[Firebase Admin] Initialized successfully');
    return true;
  } catch (error) {
    console.error('[Firebase Admin] Initialization failed:', error);
    return false;
  }
}

// Initialize on module load
initializeFirebaseAdmin();

// Export auth getter with safety check
export const adminAuth = {
  verifyIdToken: async (idToken: string) => {
    if (!initializeFirebaseAdmin()) {
      throw new Error('Firebase Admin SDK not initialized. Check environment variables.');
    }
    return admin.auth().verifyIdToken(idToken);
  }
};

export const db = admin.apps.length > 0 ? admin.firestore() : null;
export default admin;