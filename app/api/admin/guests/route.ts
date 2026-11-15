import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
export const dynamic = "force-dynamic";
const deny = () => NextResponse.json({ error: "Not allowed" }, { status: 401 });
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // no 0/O/1/I so codes are easy to read out and type
const newCode = () => Array.from(randomBytes(6), (b) => ALPHABET[b % 32]).join("");

export async function GET() {
  if (!isAdmin()) return deny();
  const { data, error } = await db().from("guests").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const setup = {
    "Helper chat": !!process.env.GEMINI_API_KEY,
    "Gmail": !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN && process.env.GMAIL_SENDER),
    "WhatsApp number": !!process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    "Site URL": !!process.env.NEXT_PUBLIC_SITE_URL,
  };
  return NextResponse.json({ guests: data, setup });
}
export async function POST(req: Request) {
  if (!isAdmin()) return deny();
  const b = await req.json();
  if (!b.name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  const { data, error } = await db().from("guests").insert({
    code: newCode(), name: b.name.trim(), family_name: b.family_name?.trim() || null,
    email: b.email?.trim() || null, phone: b.phone?.trim() || null,
    max_party: Math.max(1, Math.min(20, Number(b.max_party) || 1)),
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ guest: data });
}
export async function PATCH(req: Request) {
  if (!isAdmin()) return deny();
  const { id } = await req.json();
  await db().from("guests").update({ whatsapp_at: new Date().toISOString() }).eq("id", id);
  return NextResponse.json({ ok: true });
}
export async function DELETE(req: Request) {
  if (!isAdmin()) return deny();
  const id = new URL(req.url).searchParams.get("id");
  await db().from("guests").delete().eq("id", id!);
  return NextResponse.json({ ok: true });
}
