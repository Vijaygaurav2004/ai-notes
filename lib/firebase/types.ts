// Firebase database types
export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: any;
  updated_at?: any;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  summary?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
} 