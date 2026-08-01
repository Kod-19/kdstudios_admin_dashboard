# Data Model

## Collections

Use these Firestore collections for v1:

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

## Shared Field Rules

For admin-managed documents:

- Include `createdAt`.
- Include `updatedAt`.
- Include `createdBy` where useful.
- Use server timestamps when writing from trusted backend code.
- Use simple string statuses so lists are easy to filter.

## Public Content Documents

Projects and blog posts should include a publish status.

Recommended statuses:

- `draft`
- `published`
- `archived`

Public portfolio queries should request only `published` documents.

## Private Operational Documents

Messages, payments, clients, notification tokens, and activity logs are private dashboard data. Public users should not be able to list them.

## Message Statuses

Recommended statuses:

- `unread`
- `read`
- `replied`
- `converted`
- `archived`

## Client Statuses

Recommended statuses:

- `new-lead`
- `contacted`
- `quoted`
- `active`
- `completed`
- `archived`

## Payment Statuses

Recommended statuses:

- `pending`
- `successful`
- `failed`
- `abandoned`
- `unverified`
- `verified`

Treat frontend-created payment records as unverified until backend verification is added.
