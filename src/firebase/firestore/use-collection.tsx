
"use client";

// This file is part of the Firebase integration and is currently not in use.
// This mock hook returns an empty array.

import { useEffect, useState } from 'react';

export function useCollection<T>(
  query: any
) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, [query]);
  return { data: [], loading, error: null };
}
