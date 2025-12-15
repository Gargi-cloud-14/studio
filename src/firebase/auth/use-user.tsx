
"use client";

// This file is part of the Firebase integration and is currently not in use.
// This mock hook returns a null user.

import { useEffect, useState } from 'react';

export function useUser() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return { data: null, loading, error: null };
}
