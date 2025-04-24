# AI-Powered Notes App

A mini notes application with AI summarization capabilities built with Next.js, TypeScript, TailwindCSS, Shadcn UI, and Supabase.

## Features

- **User Authentication**: Sign up and login with email/password or Google OAuth
- **Notes Management**: Create, read, update, and delete notes
- **AI Summarization**: Generate concise summaries of your notes using the DeepSeek API
- **Responsive Design**: Works on desktop and mobile devices
- **State Management**: Uses React Query for efficient data fetching and caching

## Tech Stack

- **Frontend**:
  - Next.js (App Router)
  - TypeScript
  - TailwindCSS
  - Shadcn UI Components
  - React Query

- **Backend**:
  - Supabase (Authentication & Database)
  - DeepSeek API (AI Summarization)

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- DeepSeek API key

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
DEEPSEEK_API_KEY=your-deepseek-api-key
```

### Database Setup

1. Create a new Supabase project
2. Set up the following tables in your Supabase database:

#### Profiles Table
```sql
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using (true);

create policy "Users can insert their own profile."
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile."
  on profiles for update
  using (auth.uid() = id);
```

#### Notes Table
```sql
create table notes (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text not null,
  summary text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  user_id uuid references auth.users not null
);

-- Enable RLS
alter table notes enable row level security;

-- Create policies
create policy "Users can view their own notes."
  on notes for select
  using (auth.uid() = user_id);

create policy "Users can create their own notes."
  on notes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own notes."
  on notes for update
  using (auth.uid() = user_id);

create policy "Users can delete their own notes."
  on notes for delete
  using (auth.uid() = user_id);
```

3. Set up Google OAuth in your Supabase Authentication settings (optional)

### Installation and Running

1. Clone the repository
```bash
git clone https://github.com/yourusername/ai-notes-app.git
cd ai-notes-app
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Deployment on Vercel

This application is configured for easy deployment on Vercel:

1. Push your code to a GitHub repository
2. Sign up for a Vercel account at [vercel.com](https://vercel.com) if you don't have one
3. Click "New Project" on your Vercel dashboard
4. Import your GitHub repository
5. Configure the following environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
   - `DEEPSEEK_API_KEY` - Your DeepSeek API key
6. Click "Deploy"

The project will be deployed to a Vercel URL, and you can configure a custom domain in the Vercel project settings if desired.

**Note**: If you encounter deployment issues, try:
1. Ensure you're using Node.js 18 or higher
2. Make sure Tailwind CSS is configured correctly
3. Check that all environment variables are set properly

## Project Structure

- `app/` - Next.js app router pages and layouts
- `components/` - React components
  - `auth/` - Authentication-related components
  - `dashboard/` - Dashboard and notes management components
  - `layout/` - Layout-related components
  - `ui/` - Shadcn UI components
- `hooks/` - Custom React hooks
- `lib/` - Utility functions and type definitions
  - `supabase/` - Supabase client and types
- `providers/` - React context providers
- `public/` - Static assets

## License

MIT