const path = require('path');
const fs = require('fs');
const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

let authInstance;

const getFirebaseAuth = () => {
  if (authInstance) return authInstance;

  try {
    const apps = getApps();
    let app;

    if (!apps.length) {
      let credential;
      const defaultConfigPath = path.join(__dirname, '../config/serviceAccountKey.json');

      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        credential = cert(serviceAccount);
      } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        const credPath = path.isAbsolute(process.env.GOOGLE_APPLICATION_CREDENTIALS)
          ? process.env.GOOGLE_APPLICATION_CREDENTIALS
          : path.resolve(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS);

        if (fs.existsSync(credPath)) {
          const serviceAccount = JSON.parse(fs.readFileSync(credPath, 'utf8'));
          credential = cert(serviceAccount);
        } else {
          const { applicationDefault } = require('firebase-admin/app');
          credential = applicationDefault();
        }
      } else if (fs.existsSync(defaultConfigPath)) {
        const serviceAccount = JSON.parse(fs.readFileSync(defaultConfigPath, 'utf8'));
        credential = cert(serviceAccount);
      } else {
        throw new Error(
          'Firebase Admin credentials not found. Please set GOOGLE_APPLICATION_CREDENTIALS in server/.env or save your service account key to server/config/serviceAccountKey.json'
        );
      }

      app = initializeApp({ credential });
    } else {
      app = apps[0];
    }

    authInstance = getAuth(app);
    return authInstance;
  } catch (err) {
    authInstance = null;
    console.error('[Firebase Admin] Initialisation failed:', err.message);
    throw err;
  }
};

/**
 * Verifies a Firebase ID token sent from the frontend.
 * Returns the decoded token payload (uid, email, name, picture, etc.).
 * Throws if the token is invalid or expired.
 */
const verifyFirebaseToken = async (idToken) => {
  const auth = getFirebaseAuth();
  const decoded = await auth.verifyIdToken(idToken);
  return decoded;
};

module.exports = { verifyFirebaseToken };
