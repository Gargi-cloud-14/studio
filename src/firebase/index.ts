
// This file is part of the Firebase integration and is currently not in use.
// The exports here are placeholders to prevent breaking other parts of the application.

// Mock initialization
export function initializeFirebase() {
  console.warn("Firebase is not connected. Using mock implementation.");
  return {
    app: null,
    auth: null,
    firestore: null,
  };
}

// Re-export mock providers and hooks
export {
  FirebaseProvider,
  useFirebase,
  useFirebaseApp,
  useAuth as useFirebaseAuth,
  useFirestore,
  useMemoFirebase,
} from './provider';

// Re-export mock data hooks
export { useUser } from './auth/use-user';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export { FirebaseClientProvider } from './client-provider';
