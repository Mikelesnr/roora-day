# Roora Day invitations (Next.js App Router)

Preview the design with no setup: `npm install`, `npm run dev`, open `/i/demo`.

## Go live
1. Create a free Supabase project and run `supabase.sql` in its SQL editor.
2. Copy `.env.example` to `.env.local`, fill it in, and add the same variables in Netlify under Site settings, Environment variables.
3. Put portrait photos at `public/photos/prince.jpg`, `couple.jpg` and `tatenda.jpg` (about 900x1200), plus `hero.jpg` for the home banner. `couple.jpg` is also used on the downloadable card and the WhatsApp link preview.
4. Edit `lib/event.ts` with the date, time, venue and address.
5. Open `/admin`, add guests, send by WhatsApp or email.

## Gmail API
Create an OAuth client in Google Cloud, enable the Gmail API, and get a refresh token with the scope `https://www.googleapis.com/auth/gmail.send` (the OAuth Playground works, tick "Use your own OAuth credentials"). Put the client id, secret and refresh token in the env vars. Publish the consent screen to production, otherwise the refresh token expires after 7 days.

## Guest helper chat
Set `GEMINI_API_KEY` to turn it on. Leave it empty and the chat button is hidden.

## Program
Run the program section of `supabase.sql` (or press "Load sample program" in the admin panel). In `/admin` you can add, edit, reorder and delete entries, and switch "Finalised" on to show the Download PDF button to guests. Guests can always view the program in the popup.

## How invitations go out
In `/admin` add each guest. Every guest gets a short code (for example K7MQ4P). The WhatsApp button opens a chat with the invitation message already written: a link to the home page code box (code filled in) plus the code itself. For guests without WhatsApp, press "Copy message" and paste it into SMS, or press "SMS" on a phone to open the messages app with the text ready. Guests open the link, press "Open my invitation", reply, and the "Save your invitation card" button appears only after they accept.
