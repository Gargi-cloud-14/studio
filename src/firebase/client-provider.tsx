
"use client";

// This file is part of the Firebase integration and is currently not in use.
// To re-enable Firebase, you would wrap your app's layout with this provider.

import React from "react";

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Since Firebase is disconnected, we just render the children.
  return <>{children}</>;
}
