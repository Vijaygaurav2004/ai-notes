'use client';

import { Note } from '@/lib/supabase/types';
import { NoteFormValues } from '@/lib/validators';
import { NoteCard } from './note-card';
import { CreateNoteDialog } from './create-note-dialog';
import { Loader2, StickyNote } from 'lucide-react';

interface NotesGridProps {
  notes: Note[] | undefined;
  isLoading: boolean;
  createNote: (note: NoteFormValues) => void;
  updateNote: (id: string, note: NoteFormValues) => void;
  deleteNote: (id: string) => void;
  generateSummary: (id: string, content: string) => void;
  isCreatingNote: boolean;
  isUpdatingNote: boolean;
  isDeletingNote: boolean;
  isGeneratingSummary: boolean;
}

export function NotesGrid({
  notes,
  isLoading,
  createNote,
  updateNote,
  deleteNote,
  generateSummary,
  isCreatingNote,
  isUpdatingNote,
  isDeletingNote,
  isGeneratingSummary,
}: NotesGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="rounded-full bg-muted p-4">
          <StickyNote className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No notes yet</h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          You don&apos;t have any notes yet. Create your first note to get started.
        </p>
        <CreateNoteDialog onCreate={createNote} isCreating={isCreatingNote} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Notes</h2>
        <CreateNoteDialog onCreate={createNote} isCreating={isCreatingNote} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onUpdate={updateNote}
            onDelete={deleteNote}
            onGenerateSummary={generateSummary}
            isUpdating={isUpdatingNote}
            isDeletingNote={isDeletingNote}
            isGeneratingSummary={isGeneratingSummary}
          />
        ))}
      </div>
    </div>
  );
}