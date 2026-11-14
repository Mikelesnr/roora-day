import { NextResponse } from "next/server";
import { sendMail } from "@/lib/gmail";
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));

export async function POST(req: Request) {
  const b = await req.json();
  const name = String(b.name || "").slice(0, 100).trim();
  const message = String(b.message || "").slice(0, 1500).trim();
  const reply = String(b.reply || "").slice(0, 120).trim();
  if (!name || !message) return NextResponse.json({ error: "Please add your name and message" }, { status: 400 });
  try {
    await sendMail({
      to: process.env.CONTACT_EMAIL_TO || process.env.GMAIL_SENDER || "",
      subject: `Roora Day message from ${name}`,
      html: `<p><b>${esc(name)}</b> wrote:</p><p>${esc(message).replace(/\n/g, "<br>")}</p><p>Reply to: ${esc(reply) || "not given"}</p>`,
      replyTo: /^\S+@\S+$/.test(reply) ? reply : undefined,
    });
  } catch {
    return NextResponse.json({ error: "Could not send" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
