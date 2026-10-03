'use client';

import { createContext, useContext, useState } from 'react';
import LoadingOverlay from '@/components/ui/loading-overlay';

const LoadingContext = createContext({
  setLoading: (loading: boolean) => {},
});

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ setLoading }}>
      {children}
      {loading && <LoadingOverlay />}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => useContext(LoadingContext); 