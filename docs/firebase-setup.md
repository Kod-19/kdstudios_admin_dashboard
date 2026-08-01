# Firebase Setup

## Goal

Firebase will be the shared backend for the admin dashboard and the public KD Studios portfolio site.

## Services To Enable

- Firebase Authentication
- Firestore Database
- Firebase Cloud Messaging
- Firebase Cloud Functions
- Firebase Hosting, if choosing Firebase Hosting for deployment
- Firebase Storage only if a fallback file store is needed

## Authentication Setup

Recommended v1 setup:

- Enable Email/Password sign in.
- Create the owner account.
- Add an `admins` document where the document ID matches the owner's Firebase Auth UID.
- Set the owner admin document to active.

Recommended owner admin document:

```text
admins/{ownerUid}
```

Fields:

- `email`
- `displayName`
- `role: "owner"`
- `active: true`
- `createdAt`
- `updatedAt`

## Firestore Setup

Create Firestore in production mode, then deploy security rules before connecting the public portfolio site.

Planned collections:

- `admins`
- `messages`
- `notificationTokens`
- `projects`
- `blogPosts`
- `payments`
- `clients`
- `mediaAssets`
- `siteSettings`
- `activityLogs`

## Cloud Messaging Setup

Steps:

1. Enable Firebase Cloud Messaging.
2. Generate a web push certificate key pair.
3. Add the public VAPID key to `.env.local` as `VITE_FIREBASE_VAPID_KEY`.
4. Store browser tokens in `notificationTokens`.
5. Use a Cloud Function to send notifications when important documents are created.

## Cloud Functions Setup

Use Cloud Functions for trusted actions:

- Sending push notifications.
- Creating signed Cloudinary upload signatures.
- Verifying Paystack payments.
- Cleaning invalid notification tokens.
- Writing trusted activity logs.

## Local Development

Use the Firebase Emulator Suite later for:

- Firestore rule tests.
- Auth development.
- Function testing.
- Safer iteration before production deployment.
