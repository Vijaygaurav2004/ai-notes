'use client';

import { useState } from 'react';
import { formatDate, truncateText, cn } from '@/lib/utils';
import { Note } from '@/lib/firebase/types';
import { NoteFormValues } from '@/lib/validators';
import { EditNoteDialog } from './edit-note-dialog';

import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { 
  Sparkles, 
  Clock, 
  Calendar,
  Edit,
  Trash2
} from 'lucide-react';

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
  const [isAiInsightsOpen, setIsAiInsightsOpen] = useState(false);
  
  // Determine if this note is being updated or summarized
  const isProcessing = (isUpdating || isGeneratingSummary) && !isDeletingNote;
  const hasContent = note.content.length > 0;
  
  return (
    <>
      <Card 
        className={cn(
          "group h-full flex flex-col overflow-hidden transition-all duration-200",
          "hover:shadow-md hover:border-primary/20",
          "bg-gradient-to-br from-card to-background",
          isProcessing && "opacity-80"
        )}
      >
        <CardHeader className="pb-2 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold leading-tight group-hover:text-primary/90 transition-colors line-clamp-1">
              {note.title}
            </h3>
            <div className="flex gap-0.5">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onDelete(note.id)}
                disabled={isDeletingNote}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
          <CardDescription className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {formatDate(note.updated_at)}
          </CardDescription>
        </CardHeader>
        <CardContent 
          className="flex-grow cursor-pointer pt-2" 
          onClick={() => setIsDetailSheetOpen(true)}
        >
          <div className="text-sm line-clamp-4 group-hover:text-foreground/90 transition-colors">
            {hasContent ? note.content : (
              <span className="text-muted-foreground italic">No content</span>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-3 border-t border-border/50">
          {note.summary ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge 
                    variant="outline" 
                    className="gap-1 text-xs bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer border-primary/30"
                    onClick={() => setIsAiInsightsOpen(true)}
                  >
                    <Sparkles className="h-3 w-3 text-primary" />
                    AI Summary
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Click to view AI insights</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <div />
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "gap-1 h-7 text-xs transition-all",
              "hover:bg-primary/10 hover:text-primary",
              Boolean(note.summary) && "text-primary/70"
            )}
            onClick={() => onGenerateSummary(note.id, note.content)}
            disabled={isGeneratingSummary || Boolean(note.summary) || !hasContent}
            title={!hasContent ? "Add content to generate a summary" : ""}
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
            <SheetTitle className="text-xl">{note.title}</SheetTitle>
            <SheetDescription className="flex items-center text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              Last updated: {formatDate(note.updated_at)}
            </SheetDescription>
          </SheetHeader>
          
          <div className="whitespace-pre-wrap text-foreground/90">
            {hasContent ? note.content : (
              <div className="italic text-muted-foreground">This note has no content yet. Click Edit to add content.</div>
            )}
          </div>
          
          <div className="flex gap-2 mt-6">
            <Button variant="outline" size="sm" onClick={() => setIsDetailSheetOpen(false)}>
              Close
            </Button>
            <Button 
              size="sm"
              className="gap-1"
              onClick={() => {
                setIsDetailSheetOpen(false);
                setIsEditDialogOpen(true);
              }}
            >
              <Edit className="h-3.5 w-3.5" />
              Edit Note
            </Button>
            {!note.summary && hasContent && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => {
                  onGenerateSummary(note.id, note.content);
                }}
                disabled={isGeneratingSummary}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {isGeneratingSummary ? 'Generating...' : 'Generate Summary'}
              </Button>
            )}
            {note.summary && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => {
                  setIsDetailSheetOpen(false);
                  setIsAiInsightsOpen(true);
                }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                View AI Insights
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
      
      <Dialog open={isAiInsightsOpen} onOpenChange={setIsAiInsightsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Insights for "{note.title}"
            </DialogTitle>
            <DialogDescription>
              Our AI has analyzed your note and generated the following insights
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-primary/5 p-4 rounded-md border border-primary/20 my-4">
            <p className="text-foreground leading-relaxed">{note.summary}</p>
          </div>
          
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm" 
              onClick={() => setIsAiInsightsOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}