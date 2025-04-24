'use client';

import { useEffect, useState } from 'react';

export default function ResetCachePage() {
  const [status, setStatus] = useState<string>('Initializing...');
  const [countdown, setCountdown] = useState<number>(5);
  const [complete, setComplete] = useState<boolean>(false);

  useEffect(() => {
    async function clearCaches() {
      try {
        // Clear localStorage and sessionStorage
        setStatus('Clearing localStorage and sessionStorage...');
        localStorage.clear();
        sessionStorage.clear();
        await new Promise(r => setTimeout(r, 300));

        // Clear service workers if any
        setStatus('Unregistering service workers...');
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            await registration.unregister();
          }
        }
        await new Promise(r => setTimeout(r, 300));

        // Clear application cache
        setStatus('Clearing application cache...');
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map(key => caches.delete(key)));
        }
        await new Promise(r => setTimeout(r, 300));

        setStatus('Cache cleared successfully! Redirecting to dashboard...');
        setComplete(true);

        // Start countdown
        let count = 5;
        const intervalId = setInterval(() => {
          count -= 1;
          setCountdown(count);
          if (count <= 0) {
            clearInterval(intervalId);
            window.location.href = '/dashboard';
          }
        }, 1000);

        return () => clearInterval(intervalId);
      } catch (error) {
        console.error('Error clearing cache:', error);
        setStatus('Error clearing cache. Please try refreshing manually.');
      }
    }

    clearCaches();
  }, []);

  const handleManualRedirect = () => {
    window.location.href = '/dashboard';
  };

  const handleAltPortRedirect = () => {
    // Get the current port
    const currentPort = window.location.port;
    // Use an alternative port if needed
    const usePort = currentPort === '3000' ? '3001' : currentPort === '3001' ? '3000' : currentPort;
    
    window.location.href = `${window.location.protocol}//${window.location.hostname}:${usePort}/dashboard`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold mb-3">Resetting Browser Cache</h1>
        
        <div className="mb-6">
          <p className="text-gray-600">{status}</p>
          {complete && (
            <p className="text-green-600 font-semibold mt-2">
              Redirecting in {countdown} seconds...
            </p>
          )}
        </div>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={handleManualRedirect}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            disabled={!complete}
          >
            Go to Dashboard Now
          </button>
          
          <button 
            onClick={handleAltPortRedirect}
            className="w-full py-2 px-4 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Try Alternative Port
          </button>
          
          <a 
            href="/"
            className="text-sm text-blue-600 hover:underline mt-2"
          >
            Return to Home Page
          </a>
        </div>
      </div>
    </div>
  );
} 