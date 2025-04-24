'use client';

import { useState } from 'react';
import { Note } from '@/lib/supabase/types';
import { NoteFormValues } from '@/lib/validators';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EditNoteDialog } from './edit-note-dialog';
import { Edit, Trash2, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';

interface NoteCardProps {
  note: Note;
  onUpdate: (id: string, note: NoteFormValues) => void;
  onDelete: (id: string) => void;
  onGenerateSummary: (id: string, content: string) => void;
  isUpdating: boolean;
  isDeletingNote: boolean;
  isGeneratingSummary: boolean;
}

export function NoteCard({
  note,
  onUpdate,
  onDelete,
  onGenerateSummary,
  isUpdating,
  isDeletingNote,
  isGeneratingSummary
}: NoteCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);

  return (
    <>
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex justify-between">
            <CardTitle className="truncate text-lg">{note.title}</CardTitle>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-destructive"
                onClick={() => onDelete(note.id)}
                disabled={isDeletingNote}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
          <CardDescription className="text-xs">
            Last updated: {formatDate(note.updated_at)}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div 
            className="text-sm line-clamp-4 cursor-pointer" 
            onClick={() => setIsDetailSheetOpen(true)}
          >
            {note.content}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-3 border-t">
          {note.summary ? (
            <Badge variant="outline" className="gap-1 text-xs">
              <Sparkles className="h-3 w-3" />
              AI Summary
            </Badge>
          ) : (
            <div />
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1 h-8 text-xs"
            onClick={() => onGenerateSummary(note.id, note.content)}
            disabled={isGeneratingSummary || Boolean(note.summary)}
          >
            <Sparkles className="h-3 w-3" />
            {note.summary ? 'Summarized' : isGeneratingSummary ? 'Generating...' : 'Generate Summary'}
          </Button>
        </CardFooter>
      </Card>

      <EditNoteDialog
        note={note}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onUpdate={onUpdate}
        isUpdating={isUpdating}
      />

      <Sheet open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle>{note.title}</SheetTitle>
            <SheetDescription>
              Last updated: {formatDate(note.updated_at)}
            </SheetDescription>
          </SheetHeader>
          
          {note.summary && (
            <div className="mb-6 p-4 bg-muted/50 rounded-md">
              <div className="flex items-center gap-1 mb-2 text-sm font-medium">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>AI Summary</span>
              </div>
              <p className="text-sm">{note.summary}</p>
            </div>
          )}
          
          <div className="whitespace-pre-wrap">{note.content}</div>
          
          <div className="flex gap-2 mt-6">
            <Button variant="outline" size="sm" onClick={() => setIsDetailSheetOpen(false)}>
              Close
            </Button>
            <Button 
              size="sm"
              onClick={() => {
                setIsDetailSheetOpen(false);
                setIsEditDialogOpen(true);
              }}
            >
              Edit Note
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}