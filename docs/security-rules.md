# Security Rules Plan

## Goals

Firestore rules should protect private admin data while allowing the portfolio site to read published content and submit public forms.

## Admin Access

An authenticated user is an admin only when:

- They are signed in.
- Their UID has a document in `admins`.
- The admin document has `active: true`.

## Public Access

Public users may:

- Read published projects.
- Read published blog posts.
- Read public-safe site settings.
- Create new messages with allowed fields.
- Create initial payment records with allowed fields after Paystack checkout.

Public users may not:

- Read private messages.
- List payments.
- Read clients.
- Read notification tokens.
- Read activity logs.
- Update or delete submitted messages.
- Update or delete payments.
- Write projects or blog posts.

## Admin Writes

Only active admins may:

- Create, update, archive, and delete projects.
- Create, update, archive, and delete blog posts.
- Read and manage messages.
- Read and manage payments.
- Read and manage clients.
- Read and manage media metadata.
- Read and manage site settings.
- Read and create activity logs.

## Rule Testing

Use Firebase emulator tests for:

- Public can read published projects.
- Public cannot read draft projects.
- Public can create a message.
- Public cannot update a message.
- Public cannot list private collections.
- Non-admin signed-in user cannot access dashboard data.
- Active admin can manage dashboard data.

## Important Reminder

Firestore security rules are part of the product, not an afterthought. Do not deploy the portfolio integration to production until rules have been tested.
