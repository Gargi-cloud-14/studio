
"use client";

// This file is part of the Firebase integration and is currently not in use.
// This mock hook returns a null document.

import { useEffect, useState } from 'react';

export function useDoc<T>(
  ref: any
) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, [ref]);
  
  return { data: null, loading: false, error: null };
}
