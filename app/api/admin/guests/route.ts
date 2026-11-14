import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
export const dynamic = "force-dynamic";
const deny = () => NextResponse.json({ error: "Not allowed" }, { status: 401 });
const newCode = () => randomBytes(5).toString("hex");

export async function GET() {
  if (!isAdmin()) return deny();
  const { data, error } = await db().from("guests").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ guests: data });
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
