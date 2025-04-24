'use client';

import { supabase } from '@/lib/supabase/client';
import { NoteFormValues } from '@/lib/validators';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export function useNotes(userId: string) {
  const queryClient = useQueryClient();

  // Fetch all notes for the user
  const { data: notes, isLoading: isLoadingNotes } = useQuery({
    queryKey: ['notes', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    },
    enabled: !!userId,
  });

  // Create a new note
  const createNoteMutation = useMutation({
    mutationFn: async (note: NoteFormValues) => {
      const { data, error } = await supabase.from('notes').insert({
        title: note.title,
        content: note.content,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).select();

      if (error) {
        throw error;
      }

      return data[0];
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
      const { data, error } = await supabase
        .from('notes')
        .update({
          title: note.title,
          content: note.content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select();

      if (error) {
        throw error;
      }

      return data[0];
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
      const { error } = await supabase.from('notes').delete().eq('id', id);

      if (error) {
        throw error;
      }

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

  // Generate summary for a note using DeepSeek API
  const generateSummaryMutation = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate summary');
      }

      const { summary } = await response.json();

      // Update the note with the generated summary
      const { error } = await supabase
        .from('notes')
        .update({ summary })
        .eq('id', id);

      if (error) {
        throw error;
      }

      return { id, summary };
    },
    onSuccess: () => {
      toast.success('Summary generated successfully');
      queryClient.invalidateQueries({ queryKey: ['notes', userId] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to generate summary');
    },
  });

  return {
    notes,
    isLoadingNotes,
    createNote: createNoteMutation.mutate,
    isCreatingNote: createNoteMutation.isPending,
    updateNote: updateNoteMutation.mutate,
    isUpdatingNote: updateNoteMutation.isPending,
    deleteNote: deleteNoteMutation.mutate,
    isDeletingNote: deleteNoteMutation.isPending,
    generateSummary: generateSummaryMutation.mutate,
    isGeneratingSummary: generateSummaryMutation.isPending,
  };
}