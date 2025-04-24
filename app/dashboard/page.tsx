'use client';

import { useEffect, useState } from 'react';
import { useNotes } from '@/hooks/use-notes';
import { NotesGrid } from '@/components/dashboard/notes-grid';
import { supabase } from '@/lib/supabase/client';
import { NoteFormValues } from '@/lib/validators';

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const {
    notes,
    isLoadingNotes,
    createNote,
    updateNote,
    deleteNote,
    generateSummary,
    isCreatingNote,
    isUpdatingNote,
    isDeletingNote,
    isGeneratingSummary,
  } = useNotes(userId || '');

  useEffect(() => {
    async function getUser() {
      try {
        setIsLoadingUser(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setUserId(session.user.id);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoadingUser(false);
      }
    }

    getUser();
  }, []);

  const isLoading = isLoadingUser || (userId && isLoadingNotes);

  // Wrapper functions to fix type issues
  const handleUpdateNote = (id: string, note: NoteFormValues) => {
    updateNote({ id, note });
  };

  const handleGenerateSummary = (id: string, content: string) => {
    generateSummary({ id, content });
  };

  return (
    <div>
      {userId ? (
        <NotesGrid
          notes={notes}
          isLoading={!!isLoading}
          createNote={createNote}
          updateNote={handleUpdateNote}
          deleteNote={deleteNote}
          generateSummary={handleGenerateSummary}
          isCreatingNote={isCreatingNote}
          isUpdatingNote={isUpdatingNote}
          isDeletingNote={isDeletingNote}
          isGeneratingSummary={isGeneratingSummary}
        />
      ) : null}
    </div>
  );
}