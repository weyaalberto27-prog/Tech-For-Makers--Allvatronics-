import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { initializeFirestore, getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const configAny = firebaseConfig as any;
export const isRemixed = configAny?.apiKey?.includes('remixed') || !configAny?.apiKey;

export let app: any = null;
export let db: any = null;
export let auth: any = null;

if (!isRemixed) {
  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    if (configAny.firestoreDatabaseId) {
      db = initializeFirestore(app, { experimentalForceLongPolling: true }, configAny.firestoreDatabaseId);
    } else {
      db = initializeFirestore(app, { experimentalForceLongPolling: true });
    }
    auth = getAuth(app);
  } catch (e) {
    console.warn("Firebase Init Error", e);
  }
}

// Ensure auth is at least a valid dummy if not initialized
if (!auth) {
  auth = {
    isDummy: true,
    currentUser: null,
    onAuthStateChanged: (cb: any) => {
      cb(null);
      return () => {};
    }
  };
}

export const googleProvider = !isRemixed ? new GoogleAuthProvider() : null;
if (googleProvider) {
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
}

export let cachedAccessToken: string | null = null;
export const setCachedAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};
export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

// clear token on sign out
if (!isRemixed && auth && !auth.isDummy) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      cachedAccessToken = null;
    }
  });
}


export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const user = auth?.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: user?.uid,
      email: user?.email,
      emailVerified: user?.emailVerified,
      isAnonymous: user?.isAnonymous,
      tenantId: user?.tenantId,
      providerInfo: user?.providerData?.map((p: any) => ({
        providerId: p.providerId,
        email: p.email,
      })) || [],
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  if (!isRemixed) {
    throw new Error(JSON.stringify(errInfo));
  }
}

