# Cloudinary Setup

## Goal

Cloudinary will store dashboard-managed images for projects, blog posts, thumbnails, and general media.

## Recommended Usage

Use Cloudinary for:

- Project screenshots.
- Blog cover images.
- Portfolio thumbnails.
- Media library assets.

Avoid storing these images directly in the React project folder once the dashboard is connected.

## Upload Security

Best production approach:

- Use signed uploads.
- Generate upload signatures from Firebase Cloud Functions.
- Keep Cloudinary API secret out of frontend code.

Acceptable temporary development approach:

- Use a restricted unsigned upload preset.
- Restrict folder.
- Restrict allowed file types.
- Restrict max file size.
- Avoid broad public upload permissions.

## Firestore Metadata

After upload, save metadata to `mediaAssets`.

Recommended fields:

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

## Project And Blog Connection

Project and blog documents should store:

- Cloudinary secure URL for display.
- Cloudinary public ID for future replacement or cleanup.
- Alt text for accessibility.

Do not store large image files in Firestore.
