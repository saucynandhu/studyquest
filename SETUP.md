# StudyQuest Setup Instructions

## Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication and Firestore

2. **Configure Authentication**
   - In Firebase Console, go to Authentication > Sign-in method
   - Enable Email/Password authentication
   - Enable Google authentication

3. **Configure Firestore**
   - In Firebase Console, go to Firestore Database
   - Create a database in test mode

4. **Get Firebase Config**
   - In Firebase Console, go to Project Settings
   - Scroll down to "Your apps" section
   - Click the web app icon (</>) to add a web app
   - Copy the config object

5. **Create Environment File**
   Create a `.env.local` file in the root directory with:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
   ```

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run the Development Server**
   ```bash
   npm run dev
   ```

3. **Open the Application**
   - Navigate to `http://localhost:3000`
   - You'll be redirected to `/login` if not authenticated
   - After login, new users will be redirected to `/onboarding`

## Features

### Authentication
- Email/Password sign up and sign in
- Google OAuth sign in
- Protected routes
- Automatic redirects based on authentication state

### Onboarding Flow
- Welcome screen
- Username selection with availability checking
- Timetable setup (optional)
- Profile creation

### User Management
- User profiles stored in Firestore
- Onboarding status tracking
- Persistent user data

### Data Structure
Users are stored in Firestore with the following structure:
```javascript
{
  uid: string,
  username: string,
  email: string,
  displayName: string,
  xp: number,
  level: number,
  streak: number,
  achievements: string[],
  powerUps: any[],
  missions: any[],
  timetable: any[],
  createdAt: string,
  lastLoginDate: string,
  isOnboarded: boolean
}
```

## Security Rules

Add these Firestore security rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
``` 