'use client';

/**
 * Gets the base URL for the current environment
 * This ensures all URLs are correct regardless of port changes
 */
export function getBaseUrl() {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // Get current origin (which includes the port)
    return window.location.origin;
  }
  
  // Fallback for server-side
  return process.env.NEXT_PUBLIC_BASE_URL || '';
}

/**
 * Creates a URL path that's safe to use regardless of port
 * @param path - The path to append to the base URL
 */
export function createSafeUrl(path: string) {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // Return the URL with the current origin
  return `${getBaseUrl()}/${cleanPath}`;
} 