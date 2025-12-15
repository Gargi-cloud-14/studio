
"use client";

import React from "react";
import { FirebaseProvider } from "./provider";
import { initializeFirebase } from ".";

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [firebase, setFirebase] = React.useState<
    ReturnType<typeof initializeFirebase> | undefined
  >(undefined);

  React.useEffect(() => {
    const { app, auth, firestore } = initializeFirebase();
    setFirebase({ app, auth, firestore });
  }, []);

  if (!firebase) {
    // You can show a loading spinner here
    return <div>Loading Firebase...</div>;
  }

  return <FirebaseProvider value={firebase}>{children}</FirebaseProvider>;
}
