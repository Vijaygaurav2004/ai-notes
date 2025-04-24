'use client';

import { useAuth } from '@/hooks/use-auth';
import { Profile } from '@/lib/firebase/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';

interface UserMenuProps {
  user: Profile;
}

export function UserMenu({ user }: UserMenuProps) {
  const { logout, isLoading } = useAuth();

  const getInitials = (name: string | null) => {
    if (!name) return 'UN';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar_url || undefined} />
          <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center gap-2" disabled>
          <User className="h-4 w-4" />
          <span>{user.full_name || user.email}</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="flex items-center gap-2 text-destructive focus:text-destructive" 
          onClick={() => logout()}
          disabled={isLoading}
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}