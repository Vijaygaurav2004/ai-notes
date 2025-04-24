'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to the console
    console.error('Dashboard Error:', error);
  }, [error]);

  const isChunkLoadError = 
    error.message.includes('Loading chunk') || 
    error.message.includes('Failed to fetch') ||
    error.message.includes('chunk load failed') || 
    error.message.includes('Loading CSS chunk') ||
    error.message.includes('NEXT_NOT_FOUND');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            {isChunkLoadError 
              ? 'Application Load Error' 
              : 'Something went wrong!'}
          </h1>
          
          <div className="text-red-500 p-4 rounded-md bg-red-50 mb-6 text-sm">
            {isChunkLoadError 
              ? 'The application encountered an error loading required resources. This is usually caused by a caching issue or network problem.' 
              : error.message || 'An unexpected error occurred'}
          </div>
        </div>

        <div className="space-y-3">
          {isChunkLoadError ? (
            <Link 
              href="/reset-cache"
              className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-center transition-colors"
            >
              Clear Cache & Fix Issue
            </Link>
          ) : (
            <button
              onClick={reset}
              className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-center transition-colors"
            >
              Try Again
            </button>
          )}

          <Link 
            href="/"
            className="block w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md text-center transition-colors"
          >
            Return to Home
          </Link>
          
          <p className="text-xs text-gray-500 mt-6 text-center">
            If the issue persists, please try clearing your browser cache or using a different browser.
          </p>
        </div>
      </div>
    </div>
  );
} 