'use client';

import { db } from '@/lib/firebase/config';
import { Note } from '@/lib/firebase/types';
import { NoteFormValues } from '@/lib/validators';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  orderBy,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getBaseUrl } from '@/app/utils/client-helper';

export function useNotes(userId: string) {
  const queryClient = useQueryClient();

  // Fetch all notes for the user
  const { data: notes, isLoading: isLoadingNotes, error: notesError } = useQuery({
    queryKey: ['notes', userId],
    queryFn: async () => {
      // Only fetch if we have a userId
      if (!userId) return [];
      
      try {
        console.log('Fetching notes for user:', userId);
        const notesRef = collection(db, 'notes');
        const q = query(
          notesRef, 
          where('user_id', '==', userId),
          orderBy('updated_at', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        console.log('Notes query returned:', querySnapshot.size, 'documents');
        const notesList: Note[] = [];
        
        querySnapshot.forEach((docSnapshot: QueryDocumentSnapshot<DocumentData>) => {
          notesList.push({ 
            id: docSnapshot.id, 
            ...docSnapshot.data() as Omit<Note, 'id'>
          });
        });
        
        return notesList;
      } catch (error) {
        console.error('Error fetching notes:', error);
        throw error;
      }
    },
    enabled: !!userId,
  });

  // Create a new note
  const createNoteMutation = useMutation({
    mutationFn: async (note: NoteFormValues) => {
      const notesRef = collection(db, 'notes');
      const now = new Date().toISOString();
      
      const newNote = {
        title: note.title,
        content: note.content,
        user_id: userId,
        created_at: now,
        updated_at: now,
      };
      
      const docRef = await addDoc(notesRef, newNote);
      
      return { id: docRef.id, ...newNote } as Note;
    },
    onSuccess: () => {
      toast.success('Note created successfully');
      queryClient.invalidateQueries({ queryKey: ['notes', userId] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create note');
    },
  });

  // Update an existing note
  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, note }: { id: string; note: NoteFormValues }) => {
      const noteRef = doc(db, 'notes', id);
      const now = new Date().toISOString();
      
      const updatedFields = {
        title: note.title,
        content: note.content,
        updated_at: now,
      };
      
      await updateDoc(noteRef, updatedFields);
      
      return { id, ...updatedFields } as Partial<Note>;
    },
    onSuccess: () => {
      toast.success('Note updated successfully');
      queryClient.invalidateQueries({ queryKey: ['notes', userId] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update note');
    },
  });

  // Delete a note
  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      const noteRef = doc(db, 'notes', id);
      await deleteDoc(noteRef);
      return id;
    },
    onSuccess: () => {
      toast.success('Note deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['notes', userId] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete note');
    },
  });

  // Delete all notes for the user
  const deleteAllNotesMutation = useMutation({
    mutationFn: async () => {
      if (!userId) return;
      
      console.log('Deleting all notes for user:', userId);
      const notesRef = collection(db, 'notes');
      const q = query(notesRef, where('user_id', '==', userId));
      
      const querySnapshot = await getDocs(q);
      const deletePromises: Promise<void>[] = [];
      
      querySnapshot.forEach((docSnapshot) => {
        deletePromises.push(deleteDoc(doc(db, 'notes', docSnapshot.id)));
      });
      
      await Promise.all(deletePromises);
      return { count: deletePromises.length };
    },
    onSuccess: (result) => {
      const count = result?.count ?? 0;
      toast.success(`Successfully deleted ${count} note${count === 1 ? '' : 's'}`);
      queryClient.invalidateQueries({ queryKey: ['notes', userId] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete all notes');
    },
  });

  // Generate summary for a note using DeepSeek API
  const generateSummaryMutation = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      // Call the summary API using the current origin
      console.log(`Generating summary for note: ${id} (content length: ${content.length})`);
      
      try {
        const apiUrl = `${getBaseUrl()}/api/summarize`;
        console.log('Using API URL:', apiUrl);
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        });

        console.log('API response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response text:', errorText);
          
          let error;
          try {
            error = JSON.parse(errorText);
          } catch (e) {
            throw new Error(`API error: ${response.status} - ${errorText.substring(0, 100)}`);
          }
          
          throw new Error(error.message || `Failed to generate summary (status: ${response.status})`);
        }

        const data = await response.json();
        console.log('Summary generated successfully');

        // Update the note with the generated summary
        const noteRef = doc(db, 'notes', id);
        await updateDoc(noteRef, { summary: data.summary });

        return { id, summary: data.summary };
      } catch (error: any) {
        console.error('Error generating summary:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Summary generated successfully');
      queryClient.invalidateQueries({ queryKey: ['notes', userId] });
    },
    onError: (error: any) => {
      console.error('Summary generation error details:', error);
      toast.error(error.message || 'Failed to generate summary');
    },
  });

  return {
    notes,
    isLoadingNotes,
    notesError,
    createNote: createNoteMutation.mutate,
    isCreatingNote: createNoteMutation.isPending,
    updateNote: updateNoteMutation.mutate,
    isUpdatingNote: updateNoteMutation.isPending,
    deleteNote: deleteNoteMutation.mutate,
    isDeletingNote: deleteNoteMutation.isPending,
    deleteAllNotes: deleteAllNotesMutation.mutate,
    isDeletingAllNotes: deleteAllNotesMutation.isPending,
    generateSummary: generateSummaryMutation.mutate,
    isGeneratingSummary: generateSummaryMutation.isPending,
  };
}