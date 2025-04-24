export type Database = {
    public: {
      Tables: {
        notes: {
          Row: {
            id: string;
            title: string;
            content: string;
            summary: string | null;
            created_at: string;
            updated_at: string;
            user_id: string;
          };
          Insert: {
            id?: string;
            title: string;
            content: string;
            summary?: string | null;
            created_at?: string;
            updated_at?: string;
            user_id: string;
          };
          Update: {
            id?: string;
            title?: string;
            content?: string;
            summary?: string | null;
            created_at?: string;
            updated_at?: string;
            user_id?: string;
          };
        };
        profiles: {
          Row: {
            id: string;
            email: string;
            full_name: string | null;
            avatar_url: string | null;
            created_at: string;
          };
          Insert: {
            id: string;
            email: string;
            full_name?: string | null;
            avatar_url?: string | null;
            created_at?: string;
          };
          Update: {
            id?: string;
            email?: string;
            full_name?: string | null;
            avatar_url?: string | null;
            created_at?: string;
          };
        };
      };
      Views: {
        [_ in never]: never;
      };
      Functions: {
        [_ in never]: never;
      };
      Enums: {
        [_ in never]: never;
      };
    };
  };
  
  export type Note = Database['public']['Tables']['notes']['Row'];
  export type Profile = Database['public']['Tables']['profiles']['Row'];