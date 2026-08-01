# Deployment Checklist

## Before First Deployment

- Confirm no real secrets are committed.
- Confirm `.env.example` contains placeholders only.
- Create `.env.local` locally with real values.
- Enable Firebase Authentication.
- Enable Firestore.
- Enable Firebase Cloud Messaging.
- Create the owner account.
- Create the owner `admins` document.
- Configure Cloudinary.
- Configure Paystack public key.

## Before Production Use

- Deploy Firestore security rules.
- Deploy required Firestore indexes.
- Configure Cloud Functions for trusted backend actions.
- Use signed Cloudinary uploads or a restricted upload preset.
- Add Paystack backend verification before treating payments as fully trusted.
- Test dashboard sign in.
- Test non-admin access denial.
- Test public portfolio reads.
- Test public message creation.
- Test push notification permission and token storage.

## After Portfolio Integration

- Submit a contact form and confirm it appears in the dashboard.
- Submit a project brief and confirm full details are stored.
- Publish a project and confirm it appears on the public site.
- Publish a blog post and confirm it appears on the public site.
- Complete a Paystack test payment and confirm the payment record appears.
- Confirm draft content is not visible publicly.

## Ongoing Checks

- Rotate secrets if exposed.
- Review admin accounts.
- Remove invalid notification tokens.
- Monitor failed payment verification.
- Review Cloudinary usage and storage.
- Keep Firebase rules aligned with new features.
