'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { auth, db } from '@/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Profile } from '@/lib/firebase/types';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    console.log('DashboardLayout mounting');
    
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setLoading(true);
      setError(null);
      
      try {
        if (authUser) {
          console.log('User authenticated:', authUser.uid);
          // Get user profile from Firestore
          const profileDocRef = doc(db, 'profiles', authUser.uid);
          const profileDoc = await getDoc(profileDocRef);
          
          if (profileDoc.exists()) {
            console.log('Profile found in Firestore');
            setUser({ 
              id: profileDoc.id, 
              ...profileDoc.data() 
            } as Profile);
          } else {
            console.log('No profile found, using fallback');
            // Fallback if profile doesn't exist
            setUser({
              id: authUser.uid,
              email: authUser.email,
              full_name: authUser.displayName,
              avatar_url: authUser.photoURL,
              created_at: new Date().toISOString(),
            });
          }
        } else {
          console.log('No authenticated user, redirecting');
          setUser(null);
          router.push('/auth/login');
        }
      } catch (err) {
        console.error('Error in auth state change:', err);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    });
    
    return () => {
      console.log('DashboardLayout unmounting');
      unsubscribe();
    };
  }, [router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
      <div className="p-8 rounded-lg bg-card shadow-lg flex flex-col items-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <span className="text-lg font-medium text-muted-foreground">Loading your workspace...</span>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30">
      <div className="p-8 rounded-lg bg-card shadow-lg flex flex-col items-center max-w-md">
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-destructive"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </div>
        <div className="mb-4 text-lg font-semibold text-foreground">{error}</div>
        <p className="text-sm text-muted-foreground mb-6 text-center">
          There was a problem loading your profile. Please try again or return to login.
        </p>
        <button 
          onClick={() => router.push('/auth/login')}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors w-full"
        >
          Return to Login
        </button>
      </div>
    </div>
  );
  
  if (!user) return null;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-background to-background/95">
      <Header user={user} />
      <div className="flex-1 container py-6 md:py-10 max-w-7xl mx-auto px-4">
        <div className="bg-card rounded-xl shadow-sm border border-border/40 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}