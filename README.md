# AI-Powered Notes App

A mini notes application with AI summarization capabilities built with Next.js, TypeScript, TailwindCSS, Shadcn UI, and Firebase.

## Features

- **User Authentication**: Sign up and login with email/password or Google OAuth
- **Notes Management**: Create, read, update, and delete notes
- **AI Summarization**: Generate concise summaries of your notes using the Google Gemini API
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
  - Firebase (Authentication & Firestore Database)
  - Google Gemini API (AI Summarization)

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- Google Gemini API key

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
GEMINI_API_KEY=your-gemini-api-key
```

### Firebase Setup

1. Create a new Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication with Email/Password and Google providers
3. Create a Firestore database and set up security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Profiles collection
    match /profiles/{userId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null && request.auth.uid == userId;
    }
    
    // Notes collection
    match /notes/{noteId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.user_id;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.user_id;
    }
  }
}
```

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
5. Configure all the environment variables:
   - All Firebase environment variables (see above)
   - `GEMINI_API_KEY` - Your Google Gemini API key
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
  - `firebase/` - Firebase configuration and types
- `providers/` - React context providers
- `public/` - Static assets

