'use client';

import { auth, db } from '@/lib/firebase/config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

// Helper to set auth cookie for middleware
const setAuthCookie = (token: string | null) => {
  if (token) {
    document.cookie = `firebase-auth-token=${token}; path=/; max-age=3600; SameSite=Lax`;
  } else {
    document.cookie = `firebase-auth-token=; path=/; max-age=0; SameSite=Lax`;
  }
};

export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Login with email and password
  const loginWithEmail = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Set auth cookie for middleware
      const token = await userCredential.user.getIdToken();
      setAuthCookie(token);
      toast.success('Logged in successfully');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  // Register with email and password
  const registerWithEmail = async (email: string, password: string, fullName?: string) => {
    try {
      setIsLoading(true);
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Set auth cookie for middleware
      const token = await user.getIdToken();
      setAuthCookie(token);
      
      // Create user profile in Firestore
      await setDoc(doc(db, 'profiles', user.uid), {
        id: user.uid,
        email: email,
        full_name: fullName || '',
        created_at: serverTimestamp()
      });
      
      toast.success('Account created successfully');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      
      // Configure custom OAuth parameters to avoid COOP issues
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      // Sign in with popup (Google OAuth)
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Set auth cookie for middleware
      const token = await user.getIdToken();
      setAuthCookie(token);
      
      // Save/update user profile in Firestore
      await setDoc(doc(db, 'profiles', user.uid), {
        id: user.uid,
        email: user.email,
        full_name: user.displayName || '',
        avatar_url: user.photoURL,
        updated_at: serverTimestamp()
      }, { merge: true }); // Use merge to update existing profiles without overwriting
      
      toast.success('Logged in with Google successfully');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Google login error:', error);
      toast.error(error.message || 'Failed to login with Google');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setIsLoading(true);
      await signOut(auth);
      // Clear auth cookie
      setAuthCookie(null);
      toast.success('Logged out successfully');
      router.push('/auth/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Failed to logout');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    logout,
    isLoading,
  };
}