'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { getBaseUrl } from '@/app/utils/client-helper';

// Dynamic DevTools component for client-side only
function ReactQueryDevToolsProduction() {
  const [isDevtoolsEnabled, setIsDevtoolsEnabled] = useState(false);
  const [DevToolsComponent, setDevToolsComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    // Only enable in development and client-side
    if (process.env.NODE_ENV === 'production' || typeof window === 'undefined') {
      return;
    }

    // Set flag to prevent re-importing
    setIsDevtoolsEnabled(true);
  }, []);

  useEffect(() => {
    // Only import when enabled and component not loaded
    if (!isDevtoolsEnabled || DevToolsComponent !== null) {
      return;
    }

    // Dynamically import the DevTools with proper path handling
    import('@tanstack/react-query-devtools')
      .then(({ ReactQueryDevtools }) => {
        console.log('React Query DevTools loaded successfully');
        setDevToolsComponent(() => ReactQueryDevtools);
      })
      .catch((error) => {
        console.error('Failed to load React Query DevTools:', error);
      });
  }, [isDevtoolsEnabled, DevToolsComponent]);

  // Return nothing if DevTools aren't enabled or component isn't loaded
  if (!isDevtoolsEnabled || !DevToolsComponent) {
    return null;
  }

  // Return the DevTools component when loaded
  return <DevToolsComponent initialIsOpen={false} />;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevToolsProduction />
    </QueryClientProvider>
  );
}