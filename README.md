# Roora Day invitations (Next.js App Router)

Preview the design with no setup: `npm install`, `npm run dev`, open `/i/demo`.

## Go live
1. Create a free Supabase project and run `supabase.sql` in its SQL editor.
2. Copy `.env.example` to `.env.local`, fill it in, and add the same variables in Netlify under Site settings, Environment variables.
3. Put portrait photos at `public/photos/couple-1.jpg`, `couple-2.jpg`, `couple-3.jpg`. `couple-2.jpg` is also used on the downloadable card and the WhatsApp link preview.
4. Edit `lib/event.ts` with the date, time, venue and address.
5. Open `/admin`, add guests, send by WhatsApp or email.

## Gmail API
Create an OAuth client in Google Cloud, enable the Gmail API, and get a refresh token with the scope `https://www.googleapis.com/auth/gmail.send` (the OAuth Playground works, tick "Use your own OAuth credentials"). Put the client id, secret and refresh token in the env vars. Publish the consent screen to production, otherwise the refresh token expires after 7 days.

## Guest helper chat
Set `GEMINI_API_KEY` to turn it on. Leave it empty and the chat button is hidden.
