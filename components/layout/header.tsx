'use client';

import { UserMenu } from './user-menu';
import { Profile } from '@/lib/supabase/types';

interface HeaderProps {
  user: Profile | null;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <svg 
            viewBox="0 0 24 24"
            className="h-6 w-6 text-primary"
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <h1 className="text-xl font-bold">AI Notes</h1>
        </div>
        {user && <UserMenu user={user} />}
      </div>
    </header>
  );
}