# Firebase Security Rules

The error "Missing or insufficient permissions" indicates that Firebase security rules are blocking writes to the `users` collection. Here are the correct rules to fix this:

## Firestore Security Rules

Go to your Firebase Console → Firestore Database → Rules and replace the current rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow reading all users for leaderboard (optional)
    match /users/{userId} {
      allow read: if request.auth != null;
    }
    
    // Allow test collection for debugging
    match /test/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Default rule - deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Authentication Rules

Make sure Authentication is enabled in Firebase Console:
1. Go to Firebase Console → Authentication
2. Click "Get started" if not already set up
3. Enable Email/Password authentication
4. Add your test users or enable sign-up

## Steps to Fix:

1. **Update Firestore Rules:**
   - Go to Firebase Console → Firestore Database → Rules
   - Replace existing rules with the ones above
   - Click "Publish"

2. **Test the Fix:**
   - Go back to your app
   - Sign in again
   - Try creating a mission
   - Check if data persists after refresh

3. **Verify in Firebase Console:**
   - Go to Firestore Database → Data
   - Look for a `users` collection
   - Check if documents are being created with your user ID

## Alternative Rules (More Permissive for Testing)

If you want to allow all authenticated users to read/write during development:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all authenticated users to read/write (for testing only)
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

⚠️ **Warning:** The permissive rules are for testing only. Use the first set of rules for production.

## Testing the Fix

After updating the rules:
1. Sign out and sign back in
2. Create a mission
3. Complete the mission
4. Refresh the page
5. Check if data persists
6. Go to `/debug` and test the buttons

The error should disappear and data should start persisting in Firebase! 