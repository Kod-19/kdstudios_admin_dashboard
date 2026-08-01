# KD Studios Admin Dashboard Project Guide

## 1. Project Vision

The KD Studios Admin Dashboard is a private owner dashboard for managing the KD Studios portfolio website and client operations without repeatedly opening the portfolio site's project folder to edit static files and push changes.

The dashboard will become the control center for:

- Receiving contact and project brief messages.
- Seeing browser push notifications for new messages and important activity.
- Uploading and managing portfolio project cards.
- Publishing blog posts and studio updates.
- Viewing Paystack payment information.
- Managing client records.
- Monitoring dashboard activity and basic business metrics.
- Updating shared website settings.
- Uploading and organizing media through Cloudinary.

The dashboard and the public portfolio site should share Firebase as the backend source of truth. The admin dashboard writes and manages data. The portfolio site reads published data and submits messages/payment records into Firebase.

## 2. Success Criteria

The project is successful when the owner can:

- Sign in securely with an owner-only Firebase account.
- View unread messages from contact and project brief forms.
- Receive browser push notifications when new messages arrive.
- Create, edit, publish, unpublish, archive, and delete project cards.
- Upload project and blog images to Cloudinary from the dashboard.
- Publish blog/update posts without editing `src/data/blogPosts.js` in the portfolio site.
- View payment records with amount, email, Paystack reference, status, and timestamp.
- Manage client records and connect clients to messages, projects, and payments.
- See an overview page with key counts and recent activity.
- Update selected site settings from a dashboard settings screen.
- Keep public data readable by the portfolio site while keeping admin actions protected.

## 3. Recommended Tech Stack

### Frontend

- React with Vite for the dashboard application.
- Tailwind CSS for styling.
- React Router for dashboard routes.
- React Hook Form for forms.
- Zod or Yup for validation.
- TanStack Table or a lightweight table pattern for admin lists.
- Recharts or a small charting library for dashboard analytics.

### Backend And Services

- Firebase Authentication for owner-only sign in.
- Firestore for messages, projects, blog posts, payments, clients, settings, and activity logs.
- Firebase Cloud Messaging for browser push notifications.
- Firebase Cloud Functions for trusted backend actions.
- Firebase Hosting or Vercel for deployment.
- Firebase Storage only as an optional fallback for files that should not live in Cloudinary.
- Cloudinary for project images, blog images, thumbnails, and general media assets.

### Existing Portfolio Integration

The current KD Studios portfolio site is a React/Vite/Tailwind app that stores projects and blog posts in static data files and routes contact/project brief submissions to WhatsApp. For this dashboard to fully control the public website, the portfolio site must later be updated to read and write Firebase data.

## 4. Core Product Modules

### 4.1 Authentication

Purpose:

- Keep the dashboard private.
- Allow only the KD Studios owner to access admin tools.

Expected behavior:

- Owner signs in with Firebase Authentication.
- Unauthenticated users are redirected to the login page.
- Authenticated non-admin users are blocked.
- Admin status is checked from the `admins` Firestore collection.
- The dashboard shell only loads after the admin check passes.

Core screens:

- Login
- Forgot password
- Protected app layout
- Access denied

Acceptance checklist:

- Owner can sign in.
- Owner can sign out.
- Non-admin accounts cannot access dashboard pages.
- Refreshing a protected page keeps the owner signed in.
- Auth loading states do not show private data before access is confirmed.

### 4.2 Overview Dashboard

Purpose:

- Give the owner a quick daily snapshot.

Recommended widgets:

- New unread messages.
- Total published projects.
- Draft projects.
- Recent payments.
- Total received payments.
- Recent clients.
- Recent activity log.
- Quick actions for adding project, writing blog post, checking messages, and uploading media.

Acceptance checklist:

- Overview loads summary counts from Firestore.
- Recent activity shows the newest dashboard events.
- Empty states are helpful when no data exists yet.
- Quick actions navigate to the correct modules.

### 4.3 Inbox And Messages

Purpose:

- Replace WhatsApp-only form handling with stored dashboard messages.

Message sources:

- Homepage contact form.
- Project brief form.
- Future service inquiry forms.
- Optional manual admin-created notes.

Expected behavior:

- Portfolio forms write messages to Firestore.
- Dashboard lists messages by newest first.
- Owner can filter by unread, read, archived, project brief, contact, payment question, and general inquiry.
- Owner can open a message detail view.
- Owner can mark messages as read, unread, replied, archived, or converted.
- Owner can convert a useful inquiry into a client record and optional project lead.
- WhatsApp remains available as a quick reply option, but it is no longer the only message record.

Acceptance checklist:

- New Firestore messages appear in the dashboard.
- Unread count updates correctly.
- Message status changes are saved.
- Archived messages are hidden from the default inbox.
- Conversion to client keeps a reference to the original message.

### 4.4 Push Notifications

Purpose:

- Alert the owner when important activity happens, especially new messages.

Recommended behavior:

- Owner opts in to browser notifications from the dashboard.
- The dashboard saves the browser's Firebase Cloud Messaging token in `notificationTokens`.
- A Cloud Function sends a push notification when a new message is created.
- Tokens can be disabled or removed when the owner signs out or revokes notifications.

Notification examples:

- New project brief received.
- New contact message received.
- Payment record created.
- Payment verification failed.

Acceptance checklist:

- Owner can enable notifications.
- Notification permission state is shown clearly.
- FCM token is stored without duplicates.
- New messages trigger push notifications.
- Invalid tokens are cleaned up by backend logic.

### 4.5 Projects CMS

Purpose:

- Let the owner manage portfolio project cards without editing `src/data/projects.js`.

Expected behavior:

- Create, edit, preview, publish, unpublish, archive, and delete project cards.
- Upload project images to Cloudinary.
- Save Cloudinary image metadata in Firestore.
- Support featured projects and full project library entries.
- Allow draft projects to exist only inside the dashboard.
- Public portfolio reads only published projects.

Recommended project fields:

- Title
- Slug
- Short description
- Long description
- Status
- Featured flag
- Publish status
- Sort order
- Tags
- Demo link
- GitHub link, if public
- Image URL
- Cloudinary public ID
- Image alt text
- Case study sections
- Details list
- Created at
- Updated at
- Published at

Acceptance checklist:

- Owner can create a draft project.
- Owner can upload an image and save the Cloudinary URL.
- Published projects appear in the portfolio site after integration.
- Draft projects do not appear publicly.
- Featured projects can be ordered.
- Deleting or archiving a project does not break the public site.

### 4.6 Blog And Updates CMS

Purpose:

- Let the owner publish KD Studios updates, learning notes, and future plans without editing static blog data.

Expected behavior:

- Create, edit, preview, publish, unpublish, archive, and delete posts.
- Save tags, highlights, read time, excerpt, and body content.
- Upload cover images to Cloudinary when needed.
- Public portfolio reads published posts from Firestore.

Recommended post fields:

- Title
- Slug
- Excerpt
- Body
- Tags
- Highlights
- Read time
- Cover image URL
- Cloudinary public ID
- Publish status
- Created at
- Updated at
- Published at

Acceptance checklist:

- Owner can create a draft post.
- Owner can publish and unpublish a post.
- Blog preview can show the newest published posts.
- Full blog page can list published posts.
- Draft posts stay private.

### 4.7 Payments

Purpose:

- Let the owner monitor payments from the public portfolio payment page.

Expected behavior:

- Portfolio payment page continues using Paystack checkout.
- After successful checkout, the portfolio site writes payment reference data to Firestore.
- Dashboard lists payment records by newest first.
- Owner can filter by status, client email, date range, and amount.
- Future Cloud Function support can verify Paystack references server-side.

Recommended payment fields:

- Paystack reference
- Email
- Amount in GHS
- Amount in pesewas
- Currency
- Status
- Payment channel, when available
- Client ID, when connected
- Message ID, when connected
- Created at
- Verified at
- Raw verification summary, if using backend verification

Acceptance checklist:

- Successful Paystack payment creates a Firestore payment record.
- Dashboard displays amount, email, status, reference, and timestamp.
- Duplicate references are not saved twice.
- Owner can connect a payment to a client.
- Failed or unverified payments are visually distinct.

### 4.8 Clients

Purpose:

- Track people and businesses connected to messages, projects, and payments.

Expected behavior:

- Create clients manually or from messages.
- Store basic client contact details.
- Link clients to payments and project inquiries.
- Track client status.

Recommended client statuses:

- New lead
- Contacted
- Quoted
- Active
- Completed
- Archived

Acceptance checklist:

- Owner can create and edit clients.
- Client records can be created from messages.
- Client detail shows related messages and payments.
- Archived clients are hidden from default views.

### 4.9 Media Library

Purpose:

- Organize Cloudinary uploads used across projects and blog posts.

Expected behavior:

- Upload images to Cloudinary.
- Save media metadata in Firestore.
- Show uploaded assets in a media library.
- Allow selecting existing media when editing a project or blog post.

Recommended media fields:

- Cloudinary public ID
- Secure URL
- Asset type
- Width
- Height
- Format
- Folder
- Alt text
- Usage type
- Created at
- Uploaded by

Acceptance checklist:

- Owner can upload image assets.
- Uploaded assets appear in the media library.
- Existing assets can be selected for project/blog forms.
- Alt text can be added or updated.

### 4.10 Settings

Purpose:

- Store shared public website settings and dashboard preferences.

Recommended settings:

- Studio name
- Owner name
- Contact phone
- WhatsApp number
- Email
- Social links
- Default SEO title
- Default SEO description
- Payment instructions
- Notification preferences

Acceptance checklist:

- Owner can view and update settings.
- Portfolio site can read public-safe settings after integration.
- Private dashboard preferences are not readable publicly.

### 4.11 Analytics And Activity

Purpose:

- Give the owner lightweight operational visibility.

Recommended dashboard analytics:

- New messages this week.
- Payments this month.
- Published projects count.
- Draft projects count.
- Recent content updates.
- Most recent activity.

Activity log examples:

- Project created.
- Project published.
- Blog post updated.
- Message archived.
- Payment linked to client.
- Settings changed.

Acceptance checklist:

- Important admin actions write activity log entries.
- Overview page displays recent activity.
- Analytics do not expose private data publicly.

## 5. Firestore Data Model

Use predictable collection names and consistent fields. Every document that is created or updated by the dashboard should include timestamps.

### 5.1 `admins`

Purpose:

- Controls who can access the dashboard.

Recommended document ID:

- Firebase Auth UID.

Fields:

- `email`
- `displayName`
- `role`
- `active`
- `createdAt`
- `updatedAt`

V1 rule:

- Only active owner admins can use the dashboard.

### 5.2 `messages`

Purpose:

- Stores contact and project brief submissions.

Important fields:

- `type`
- `source`
- `status`
- `name`
- `email`
- `phone`
- `businessName`
- `subject`
- `message`
- `projectType`
- `timeline`
- `budget`
- `pages`
- `features`
- `mainGoal`
- `targetAudience`
- `designStyle`
- `contentReadiness`
- `extraNotes`
- `clientId`
- `createdAt`
- `updatedAt`
- `readAt`
- `archivedAt`

Recommended statuses:

- `unread`
- `read`
- `replied`
- `converted`
- `archived`

### 5.3 `notificationTokens`

Purpose:

- Stores FCM browser tokens for the owner.

Important fields:

- `adminId`
- `token`
- `platform`
- `browser`
- `enabled`
- `createdAt`
- `updatedAt`
- `lastUsedAt`

### 5.4 `projects`

Purpose:

- Stores portfolio project cards.

Important fields:

- `title`
- `slug`
- `description`
- `longDescription`
- `status`
- `publishStatus`
- `featured`
- `sortOrder`
- `tags`
- `demoLink`
- `githubLink`
- `imageUrl`
- `imagePublicId`
- `imageAlt`
- `caseStudy`
- `details`
- `createdAt`
- `updatedAt`
- `publishedAt`

Recommended publish statuses:

- `draft`
- `published`
- `archived`

### 5.5 `blogPosts`

Purpose:

- Stores KD Studios updates and blog posts.

Important fields:

- `title`
- `slug`
- `excerpt`
- `body`
- `tags`
- `highlights`
- `readTime`
- `coverImageUrl`
- `coverImagePublicId`
- `publishStatus`
- `createdAt`
- `updatedAt`
- `publishedAt`

### 5.6 `payments`

Purpose:

- Stores Paystack payment records from the portfolio site.

Important fields:

- `reference`
- `email`
- `amountGhs`
- `amountPesewas`
- `currency`
- `status`
- `channel`
- `clientId`
- `messageId`
- `createdAt`
- `verifiedAt`

### 5.7 `clients`

Purpose:

- Stores client and lead records.

Important fields:

- `name`
- `email`
- `phone`
- `businessName`
- `status`
- `notes`
- `sourceMessageId`
- `createdAt`
- `updatedAt`

### 5.8 `mediaAssets`

Purpose:

- Stores Cloudinary asset metadata.

Important fields:

- `publicId`
- `secureUrl`
- `assetType`
- `format`
- `width`
- `height`
- `folder`
- `altText`
- `usageType`
- `createdAt`
- `uploadedBy`

### 5.9 `siteSettings`

Purpose:

- Stores shared site settings and dashboard preferences.

Recommended structure:

- Use one public document for public-safe site settings.
- Use one private document for dashboard-only preferences.

### 5.10 `activityLogs`

Purpose:

- Stores important dashboard actions.

Important fields:

- `actorId`
- `action`
- `entityType`
- `entityId`
- `summary`
- `createdAt`

## 6. Main Data Flows

### 6.1 Message Flow

1. Visitor submits a contact or project brief form on the portfolio site.
2. Portfolio site validates required fields.
3. Portfolio site writes the message to `messages` in Firestore.
4. New message starts with `status: "unread"`.
5. A Cloud Function listens for new message documents.
6. The function sends a Firebase Cloud Messaging push notification to active owner tokens.
7. Admin dashboard shows the message in the inbox.
8. Owner marks it read, replies through WhatsApp/email, archives it, or converts it to a client.

### 6.2 Project Card Flow

1. Owner opens the Projects CMS in the dashboard.
2. Owner creates a draft project card.
3. Owner uploads an image to Cloudinary.
4. Dashboard saves the Cloudinary URL and public ID to the project document.
5. Owner previews the project card.
6. Owner publishes the project.
7. Portfolio site reads published projects from Firestore.
8. Draft and archived projects remain private.

### 6.3 Blog Post Flow

1. Owner writes a draft blog/update post.
2. Owner optionally uploads a cover image to Cloudinary.
3. Owner previews the post.
4. Owner publishes the post.
5. Portfolio site reads published posts from Firestore.

### 6.4 Payment Flow

1. Visitor completes Paystack checkout on the portfolio site.
2. Paystack returns a payment reference.
3. Portfolio site writes the reference, email, amount, currency, and initial status to Firestore.
4. Dashboard displays the payment record.
5. Future Cloud Function verifies the Paystack reference server-side.
6. Owner links payment to a client when needed.

## 7. Security Plan

### Authentication

- Use Firebase Authentication.
- Restrict dashboard access to owner-only admin accounts.
- Store admin permission records in `admins`.
- Never rely on frontend checks alone.

### Firestore Rules

Rules should enforce:

- Only active admins can read private dashboard collections.
- Only active admins can write projects, blog posts, clients, settings, media assets, payments, and activity logs.
- Public users can read only published projects, published blog posts, and public-safe settings.
- Public users can create messages through portfolio forms.
- Public users cannot list private collections.
- Public users cannot update or delete messages after creation.

### Cloudinary Security

- Prefer signed uploads through a trusted backend action.
- Avoid broad unsigned upload presets for admin-only content.
- If unsigned presets are used during early development, restrict folder, file size, file type, and transformation rules.
- Store only URLs and Cloudinary public IDs in Firestore.

### Paystack Security

- Never expose secret keys in the frontend.
- Public Paystack key can stay in frontend environment variables.
- Secret verification must happen in Cloud Functions or another trusted backend.
- Treat frontend success callbacks as unverified until backend verification is added.

## 8. Step-By-Step Build Roadmap

### Step 1: Initialize React, Vite, And Tailwind

Goal:

- Create the actual app foundation after this documentation-only scaffold.

Tasks:

- Initialize Vite React.
- Install Tailwind CSS.
- Confirm the app runs locally.
- Add the base dark KD Studios admin theme.
- Set up a route structure.

Acceptance:

- Local dev server opens the empty dashboard app.
- Tailwind classes work.
- No Firebase work is started before environment variables are ready.

### Step 2: Add Firebase Project And Environment Variables

Goal:

- Connect the dashboard to Firebase safely.

Tasks:

- Create or choose a Firebase project.
- Enable Authentication.
- Enable Firestore.
- Enable Cloud Messaging.
- Add Firebase web app config to `.env.local`.
- Keep `.env.example` as placeholders only.

Acceptance:

- Firebase app initializes without real secrets committed.
- Dashboard can connect to Firebase services locally.

### Step 3: Add Owner Authentication

Goal:

- Protect the dashboard from public access.

Tasks:

- Build login page.
- Add auth context or provider.
- Add protected route wrapper.
- Create owner document in `admins`.
- Block non-admin accounts.

Acceptance:

- Owner can sign in and reach dashboard.
- Non-admin account cannot reach dashboard.
- Sign-out works.

### Step 4: Build Protected Dashboard Shell

Goal:

- Create the main admin layout.

Tasks:

- Add sidebar navigation.
- Add top bar.
- Add mobile navigation.
- Add route placeholders for all modules.
- Add loading and empty states.

Acceptance:

- Protected shell wraps all dashboard pages.
- Navigation works on desktop and mobile.
- Sign-out is reachable.

### Step 5: Add Firestore Data Models

Goal:

- Create the data access layer for dashboard collections.

Tasks:

- Add collection constants.
- Add basic CRUD service patterns.
- Add timestamp handling.
- Add activity log helper.

Acceptance:

- Dashboard can read and write test documents in development.
- Data shape matches this guide.

### Step 6: Build Messages Inbox

Goal:

- Make form submissions visible in the dashboard.

Tasks:

- Build message list.
- Build message detail view.
- Add status filters.
- Add actions for read, unread, replied, archived, and converted.
- Add conversion to client.

Acceptance:

- Messages show newest first.
- Status updates persist.
- Unread count updates correctly.

### Step 7: Add Push Notification Subscription

Goal:

- Let the owner receive browser notifications.

Tasks:

- Request notification permission.
- Register FCM token.
- Save token to `notificationTokens`.
- Add settings UI for notification state.
- Add Cloud Function trigger for new messages.

Acceptance:

- Owner can enable notifications.
- Token is stored.
- New messages can trigger push notifications.

### Step 8: Build Projects CMS

Goal:

- Manage portfolio project cards from the dashboard.

Tasks:

- Build project list.
- Build project form.
- Add draft, published, and archived states.
- Add featured and sort order controls.
- Add preview mode.

Acceptance:

- Owner can create and publish a project.
- Draft projects stay private.
- Published projects are queryable by the portfolio site.

### Step 9: Add Cloudinary Uploads

Goal:

- Upload and reuse images.

Tasks:

- Add Cloudinary config.
- Add signed upload flow or restricted development upload preset.
- Build upload component.
- Save media metadata to `mediaAssets`.
- Connect media picker to project and blog forms.

Acceptance:

- Uploaded image appears in Cloudinary.
- Firestore stores the secure URL and public ID.
- Project or blog form can use the uploaded image.

### Step 10: Build Payments Dashboard

Goal:

- Monitor Paystack payment records.

Tasks:

- Build payment table.
- Add filters.
- Add payment detail view.
- Add client linking.
- Prepare future verification status fields.

Acceptance:

- Payment records show reference, email, amount, status, and timestamp.
- Duplicate references are handled safely.
- Owner can connect payments to clients.

### Step 11: Add Clients, Settings, And Analytics

Goal:

- Complete the main admin operations.

Tasks:

- Build client list and detail views.
- Build settings form.
- Add dashboard analytics cards.
- Add activity log display.

Acceptance:

- Owner can manage client records.
- Settings save correctly.
- Overview dashboard shows useful metrics.

### Step 12: Integrate Portfolio Site

Goal:

- Make the public site use dashboard-managed data.

Tasks:

- Replace or supplement WhatsApp-only contact form with Firestore message creation.
- Replace or supplement project static data with Firestore published project reads.
- Replace or supplement blog static data with Firestore published post reads.
- Save successful Paystack references to Firestore.
- Keep WhatsApp as a reply/follow-up action.

Acceptance:

- New portfolio form submissions appear in dashboard inbox.
- Published dashboard projects appear on portfolio pages.
- Published dashboard posts appear on blog pages.
- Payment records appear after successful checkout.

### Step 13: Add Security Rules And Deployment Checks

Goal:

- Make the system safe enough for production use.

Tasks:

- Write Firestore rules.
- Write indexes for common queries.
- Add environment variable checklist.
- Deploy dashboard.
- Deploy portfolio updates.
- Test public and private access.

Acceptance:

- Public users can read only published public data.
- Public users can create messages only in the intended shape.
- Admin writes require active owner admin status.
- No real secret keys are committed.

## 9. Portfolio Site Integration Requirements

The current portfolio site must later change from static and WhatsApp-only behavior to Firebase-backed behavior for this dashboard to control it.

Required changes:

- Replace or supplement homepage contact submissions with Firestore writes.
- Replace or supplement project brief submissions with Firestore writes.
- Read project cards from Firestore instead of only `src/data/projects.js`.
- Read blog/update posts from Firestore instead of only `src/data/blogPosts.js`.
- Save successful Paystack payment references to Firestore.
- Keep WhatsApp as an optional follow-up link.
- Keep static data as a fallback only if desired.

Recommended migration order:

1. Add Firebase config to the portfolio site.
2. Write project brief and contact messages to Firestore.
3. Save Paystack payment records to Firestore.
4. Read published projects from Firestore.
5. Read published blog posts from Firestore.
6. Remove static data dependency only after Firestore content is stable.

## 10. Environment Variables

Use `.env.local` for real local values. Keep `.env.example` committed with placeholders only.

Required dashboard variables:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `VITE_FIREBASE_VAPID_KEY`
- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET`
- `VITE_PAYSTACK_PUBLIC_KEY`

Backend-only secrets must not use the `VITE_` prefix:

- Cloudinary API secret.
- Paystack secret key.
- Firebase service account credentials.

## 11. Testing Strategy

### Manual Testing

- Sign in as owner.
- Try signing in as a non-admin account.
- Create a test message from the portfolio site or Firestore console.
- Confirm the message appears in the inbox.
- Mark a message read and archived.
- Create a draft project.
- Upload a test image.
- Publish and unpublish a project.
- Create a draft blog post.
- Add a test payment record.
- Link a payment to a client.
- Update settings.
- Confirm public queries show only published data.

### Automated Testing Later

Recommended test coverage:

- Auth guard behavior.
- Firestore service helpers.
- Form validation.
- Project publish/unpublish behavior.
- Message status updates.
- Payment duplicate reference handling.
- Security rules with Firebase emulator tests.

## 12. Deployment Checklist

Before production:

- Real secrets are not committed.
- Firebase Authentication is enabled.
- Firestore rules are deployed.
- Required indexes are deployed.
- FCM VAPID key is configured.
- Cloudinary upload strategy is restricted.
- Paystack public key is correct.
- Paystack secret key is only available to backend verification code.
- Dashboard domain is configured.
- Portfolio domain can read public Firestore data.
- Owner account has an active `admins` record.

## 13. Build Order Recommendation

Build in this order:

1. Auth and protected dashboard shell.
2. Firestore data helpers.
3. Messages inbox.
4. Push notification opt-in.
5. Projects CMS.
6. Cloudinary uploads.
7. Blog CMS.
8. Payments dashboard.
9. Clients.
10. Settings.
11. Analytics and activity logs.
12. Portfolio site integration.
13. Security hardening and deployment.

This order gives you visible progress early and connects the dashboard to the most important business value first: receiving and managing client inquiries.

## 14. Current Deliverable Boundary

This scaffold intentionally contains no application implementation code yet. It provides:

- A detailed build guide.
- Supporting documentation.
- An empty folder structure.
- Placeholder `.gitkeep` files only where needed.
- A safe `.env.example` with placeholders.

The next phase is to initialize the actual React/Vite/Tailwind application and begin building the dashboard step by step.
