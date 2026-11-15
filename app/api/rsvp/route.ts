import { NextResponse } from "next/server";
import { db, hasDb } from "@/lib/db";
export async function POST(req: Request) {
  const b = await req.json();
  if (!hasDb()) return NextResponse.json({ ok: true, demo: true });
  const { data: g } = await db().from("guests").select("id,max_party").eq("code", String(b.code).toUpperCase()).single();
  if (!g) return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  const accepted = b.status === "accepted";
  const { error } = await db().from("guests").update({
    status: accepted ? "accepted" : "declined",
    attending: accepted ? Math.max(1, Math.min(g.max_party, Number(b.attending) || 1)) : 0,
    note: String(b.note || "").slice(0, 500) || null,
    responded_at: new Date().toISOString(),
  }).eq("id", g.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
