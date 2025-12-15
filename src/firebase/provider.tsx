
"use client"

// This file is part of the Firebase integration and is currently not in use.

import React, { ReactNode } from 'react';

// Mock context and providers so dependent components don't break.
const MockContext = React.createContext(undefined);

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  return (
    <MockContext.Provider value={undefined}>
      {children}
    </MockContext.Provider>
  );
};

// Mock hooks that return dummy values.
export const useFirebase = () => { throw new Error('Firebase is not connected.'); };
export const useFirebaseApp = () => { throw new Error('Firebase is not connected.'); };
export const useAuth = () => { throw new Error('Firebase is not connected.'); };
export const useFirestore = () => { throw new Error('Firebase is not connected.'); };
export function useMemoFirebase<T>(
  factory: () => T,
  deps: React.DependencyList,
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useMemo(factory, deps);
}
