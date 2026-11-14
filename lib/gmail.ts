import { EVENT } from "./event";

async function accessToken() {
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN || "",
      grant_type: "refresh_token",
    }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error_description || j.error || "Google sign-in failed");
  return j.access_token as string;
}

export async function sendMail(o: { to: string; subject: string; html: string; replyTo?: string }) {
  const sender = process.env.GMAIL_SENDER || "";
  const head = [
    `From: "${EVENT.groom} and ${EVENT.bride}" <${sender}>`,
    `To: ${o.to}`,
    ...(o.replyTo ? [`Reply-To: ${o.replyTo}`] : []),
    `Subject: =?UTF-8?B?${Buffer.from(o.subject).toString("base64")}?=`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
  ];
  const body = Buffer.from(o.html).toString("base64").replace(/(.{76})/g, "$1\r\n");
  const raw = Buffer.from(head.join("\r\n") + "\r\n\r\n" + body).toString("base64url");
  const r = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: { Authorization: `Bearer ${await accessToken()}`, "Content-Type": "application/json" },
    body: JSON.stringify({ raw }),
  });
  if (!r.ok) throw new Error("Gmail said: " + (await r.text()));
}
