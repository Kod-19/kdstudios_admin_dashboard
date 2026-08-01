# Portfolio Site Integration

## Current Portfolio Behavior

The KD Studios portfolio site currently:

- Uses React, Vite, and Tailwind CSS.
- Stores projects in `src/data/projects.js`.
- Stores blog posts in `src/data/blogPosts.js`.
- Sends contact and project brief forms to WhatsApp.
- Uses Paystack checkout on the payment page.

This is simple and useful, but it means the admin dashboard cannot manage the live site until the portfolio is connected to Firebase.

## Required Integration Changes

The portfolio site should later:

- Write homepage contact submissions to Firestore.
- Write project brief submissions to Firestore.
- Read published project cards from Firestore.
- Read published blog posts from Firestore.
- Save successful Paystack payment references to Firestore.
- Keep WhatsApp as an optional follow-up link.

## Recommended Migration Order

1. Add Firebase environment variables to the portfolio site.
2. Create a Firebase app config for portfolio reads and public writes.
3. Update contact form submission to create `messages` documents.
4. Update project brief submission to create richer `messages` documents.
5. Update payment success callback to create `payments` documents.
6. Update project sections to read published `projects`.
7. Update blog sections to read published `blogPosts`.
8. Keep static data as fallback until Firestore content is complete.
9. Remove static-only workflow when confident.

## Public Read Rules

The portfolio site should only read:

- Published projects.
- Published blog posts.
- Public-safe site settings.

The portfolio site should only create:

- New messages.
- New initial payment records after Paystack checkout.

The portfolio site should not update or delete admin data.

## WhatsApp Role After Integration

WhatsApp should remain useful as:

- A quick reply link from the dashboard.
- A fallback contact method.
- A visible social/contact option.

It should no longer be the only place where client inquiries exist.
