'use client';

import { useEffect, useCallback } from 'react';
import { Note } from '@/lib/firebase/types';
import { NoteFormValues } from '@/lib/validators';
import { NoteCard } from './note-card';
import { CreateNoteDialog } from './create-note-dialog';
import { Loader2, Plus, Search, StickyNote, Filter, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { SearchBox } from './search-box';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface NotesGridProps {
  notes: Note[] | undefined;
  isLoading: boolean;
  userId: string;
  createNote: (note: NoteFormValues) => void;
  updateNote: (id: string, note: NoteFormValues) => void;
  deleteNote: (id: string) => void;
  deleteAllNotes: () => void;
  generateSummary: (id: string, content: string) => void;
  isCreatingNote: boolean;
  isUpdatingNote: boolean;
  isDeletingNote: boolean;
  isDeletingAllNotes: boolean;
  isGeneratingSummary: boolean;
}

export function NotesGrid({
  notes,
  isLoading,
  userId,
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
}: NotesGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNotes, setFilteredNotes] = useState<Note[] | undefined>(notes);
  
  // Memoize the search handler
  const handleSearch = useCallback((term: string) => {
    console.log('Notes grid handling search:', term);
    setSearchTerm(term);
  }, []);

  useEffect(() => {
    console.log('Search useEffect triggered:', { 
      searchTerm, 
      hasNotes: !!notes, 
      notesCount: notes?.length || 0 
    });
    
    if (!notes) {
      setFilteredNotes([]);
      return;
    }
    
    if (!searchTerm.trim()) {
      console.log('Empty search term, showing all notes');
      setFilteredNotes(notes);
      return;
    }
    
    const filtered = notes.filter(note => 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log('Filtered notes:', { 
      original: notes.length, 
      filtered: filtered.length,
      searchTerm
    });
    setFilteredNotes(filtered);
  }, [notes, searchTerm]);

  // Only show the "Return to top" button if we have a certain number of notes
  const showDeleteAllButton = notes && notes.length > 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 h-96">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground animate-pulse">Loading your notes...</p>
        </div>
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 h-96 bg-muted/5">
        <div className="flex flex-col items-center max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <StickyNote className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Start capturing your thoughts</h3>
          <p className="text-muted-foreground mb-8">
            Create your first note to begin organizing your ideas with the power of AI summarization.
          </p>
          <CreateNoteDialog onCreate={createNote} isCreating={isCreatingNote}>
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Create Your First Note
            </Button>
          </CreateNoteDialog>
        </div>
      </div>
    );
  }

  const hasFiltered = searchTerm.trim() !== '';
  const notesCount = filteredNotes?.length || 0;

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex flex-col gap-4 md:gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Your Notes</h1>
            <p className="text-muted-foreground mt-1">
              Manage your notes and create AI-powered summaries
            </p>
          </div>
          
          <div className="flex gap-2">
            <CreateNoteDialog onCreate={createNote} isCreating={isCreatingNote}>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Note
              </Button>
            </CreateNoteDialog>
            
            {showDeleteAllButton && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="gap-2" disabled={isDeletingAllNotes}>
                    <Trash2 className="h-4 w-4" />
                    {isDeletingAllNotes ? 'Deleting...' : 'Delete All'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete all notes?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all your notes.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={deleteAllNotes}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="w-full md:w-80">
            <SearchBox 
              placeholder="Search notes..."
              onSearch={handleSearch}
            />
          </div>
          
          <div className="flex gap-2 items-center ml-auto">
            {hasFiltered && (
              <Badge variant="outline" className="gap-1 h-9 px-3 border-muted-foreground/30">
                {notesCount} {notesCount === 1 ? 'result' : 'results'}
              </Badge>
            )}
            {hasFiltered && (
              <Button variant="ghost" size="icon" onClick={() => setSearchTerm('')} title="Clear search">
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes?.map((note) => (
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
        {hasFiltered && filteredNotes?.length === 0 && (
          <div className="col-span-full p-12 flex flex-col items-center justify-center text-center border border-dashed rounded-lg">
            <div className="text-muted-foreground mb-2">No notes found matching "{searchTerm}"</div>
            <Button variant="outline" size="sm" onClick={() => setSearchTerm('')}>Clear Search</Button>
          </div>
        )}
      </div>
    </div>
  );
}