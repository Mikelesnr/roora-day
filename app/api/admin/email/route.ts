import { NextResponse } from "next/server";
import { db, greeting, Guest } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { EVENT, PALETTE, siteUrl } from "@/lib/event";
import { sendMail } from "@/lib/gmail";
import { inviteLink } from "@/lib/message";

export async function POST(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Not allowed" }, { status: 401 });
  const { id } = await req.json();
  const { data } = await db().from("guests").select("*").eq("id", id).single();
  const g = data as Guest | null;
  if (!g?.email) return NextResponse.json({ error: "This guest has no email address" }, { status: 400 });
  const base = siteUrl();
  const link = inviteLink(base, g.code);
  const stripe = PALETTE.map(([, c]) => `<td style="height:6px;background:${c}"></td>`).join("");
  const html = `<div style="background:#F8EFE0;padding:24px;font-family:Georgia,serif;color:#4A2518">
  <table width="100%" style="max-width:560px;margin:auto;background:#fff;border-collapse:collapse"><tr>${stripe}</tr></table>
  <div style="max-width:560px;margin:auto;background:#fff;text-align:center;padding:32px 24px">
    <img src="${base}/photos/couple.jpg" alt="" width="200" style="border-radius:100px 100px 0 0;max-width:100%">
    <p style="margin:20px 0 4px">Dear ${greeting(g)},</p>
    <h1 style="font-weight:600;margin:8px 0">${EVENT.groom} and ${EVENT.bride}</h1>
    <p>invite you to their ${EVENT.title}.<br>${EVENT.date}, ${EVENT.time}<br>${EVENT.address}</p>
    <p><a href="${link}" style="background:#C2571B;color:#fff;padding:14px 28px;text-decoration:none;display:inline-block">Open your invitation</a></p>
    <p style="font-size:14px">Your invitation code: <b>${g.code}</b></p>
    <p style="font-size:13px;color:#8E3F1B">Dress code: ${EVENT.dressCode}</p>
  </div></div>`;
  try {
    await sendMail({ to: g.email, subject: `You are invited: ${EVENT.groom} and ${EVENT.bride}'s ${EVENT.title}`, html });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
  await db().from("guests").update({ emailed_at: new Date().toISOString() }).eq("id", id);
  return NextResponse.json({ ok: true });
}
