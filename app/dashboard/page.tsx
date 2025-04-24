'use client';

import { useEffect, useState } from 'react';
import { useNotes } from '@/hooks/use-notes';
import { NotesGrid } from '@/components/dashboard/notes-grid';
import { auth } from '@/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { NoteFormValues } from '@/lib/validators';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const {
    notes,
    isLoadingNotes,
    notesError,
    createNote,
    updateNote,
    deleteNote,
    deleteAllNotes,
    generateSummary,
    isCreatingNote,
    isUpdatingNote,
    isDeletingNote,
    isDeletingAllNotes,
    isGeneratingSummary,
  } = useNotes(userId || '');

  useEffect(() => {
    console.log('Dashboard useEffect running');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'No user');
      setIsLoadingUser(true);
      if (user) {
        console.log('Setting user ID:', user.uid);
        setUserId(user.uid);
      } else {
        console.log('No user found, redirecting to login');
        setUserId(null);
        // Redirect to login if not authenticated
        window.location.href = '/auth/login';
      }
      setIsLoadingUser(false);
    });

    // Clean up subscription
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log('Notes state:', { 
      userId, 
      isLoadingUser, 
      isLoadingNotes, 
      noteCount: notes?.length || 0 
    });
  }, [userId, isLoadingUser, isLoadingNotes, notes]);

  const isLoading = isLoadingUser || (!!userId && isLoadingNotes);

  // Helper functions to adapt the hook's function signatures
  const handleUpdateNote = (id: string, note: any) => {
    updateNote({ id, note });
  };
  
  const handleGenerateSummary = (id: string, content: string) => {
    generateSummary({ id, content });
  };

  if (notesError) {
    console.error('Error loading notes:', notesError);
    return (
      <div className="p-6 md:p-8">
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading notes</AlertTitle>
          <AlertDescription>
            There was a problem fetching your notes. Please refresh the page or try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground mt-4">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <p className="text-muted-foreground">You need to be logged in to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <NotesGrid
      notes={notes}
      isLoading={isLoading}
      userId={userId}
      createNote={createNote}
      updateNote={handleUpdateNote}
      deleteNote={deleteNote}
      deleteAllNotes={deleteAllNotes}
      generateSummary={handleGenerateSummary}
      isCreatingNote={isCreatingNote}
      isUpdatingNote={isUpdatingNote}
      isDeletingNote={isDeletingNote}
      isDeletingAllNotes={isDeletingAllNotes}
      isGeneratingSummary={isGeneratingSummary}
    />
  );
}