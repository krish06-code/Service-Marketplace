// Firebase configuration using Vite environment variables.
// Real values must be placed in client/.env.local (never committed).
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate that all required env vars are present in development
if (import.meta.env.DEV) {
  const missing = Object.entries(firebaseConfig)
    .filter(([, v]) => !v)
    .map(([k]) => `VITE_FIREBASE_${k.replace(/([A-Z])/g, '_$1').toUpperCase()}`);
  if (missing.length) {
    console.warn(
      '[Firebase] Missing environment variables:\n' +
      missing.join('\n') +
      '\nAdd them to client/.env.local'
    );
  }
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Request additional scopes so we get the user's profile picture
googleProvider.addScope('profile');
googleProvider.addScope('email');

/**
 * Triggers the Google Sign-In popup and returns the Firebase ID token.
 * Throws a structured error object so callers can show user-friendly messages.
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    return { user: result.user, idToken };
  } catch (error) {
    // Map Firebase error codes to friendly messages
    const messages = {
      'auth/popup-closed-by-user':       'Sign-in popup was closed. Please try again.',
      'auth/popup-blocked':              'Popup was blocked by your browser. Please allow popups for this site.',
      'auth/cancelled-popup-request':    'Sign-in was cancelled.',
      'auth/network-request-failed':     'Network error. Please check your connection and try again.',
      'auth/user-disabled':              'This Google account has been disabled.',
      'auth/account-exists-with-different-credential':
                                         'An account already exists with a different sign-in method.',
    };
    const friendly = messages[error.code] || error.message || 'Google Sign-In failed. Please try again.';
    const err = new Error(friendly);
    err.code = error.code;
    throw err;
  }
};

/**
 * Signs the user out from Firebase (does NOT clear the app JWT — call logout() from AuthContext for that).
 */
export const signOutFirebase = () => firebaseSignOut(auth);

export { app, auth, googleProvider };
