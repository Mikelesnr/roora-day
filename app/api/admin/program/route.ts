import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { SAMPLE, getProgram } from "@/lib/program";
export const dynamic = "force-dynamic";
const bad = (m: string, s = 400) => NextResponse.json({ error: m }, { status: s });

export async function GET() {
  if (!isAdmin()) return bad("Not allowed", 401);
  try {
    return NextResponse.json(await getProgram());
  } catch (e) {
    return bad((e as Error).message + " (have you run the program part of supabase.sql?)", 500);
  }
}
export async function POST(req: Request) {
  if (!isAdmin()) return bad("Not allowed", 401);
  const b = await req.json();
  const d = db();
  switch (b.action) {
    case "add": {
      if (!String(b.title || "").trim()) return bad("Please add a title");
      const { data } = await d.from("program_items").select("sort_order").order("sort_order", { ascending: false }).limit(1);
      await d.from("program_items").insert({ time: b.time || "", title: b.title.trim(), description: b.description?.trim() || null, sort_order: (data?.[0]?.sort_order ?? 0) + 1 });
      break;
    }
    case "update":
      await d.from("program_items").update({ time: b.time || "", title: b.title, description: b.description?.trim() || null }).eq("id", b.id);
      break;
    case "delete":
      await d.from("program_items").delete().eq("id", b.id);
      break;
    case "move": {
      const { data } = await d.from("program_items").select("id,sort_order").order("sort_order");
      const list = data || [];
      const i = list.findIndex((x) => x.id === b.id), j = b.dir === "up" ? i - 1 : i + 1;
      if (i >= 0 && j >= 0 && j < list.length) {
        await d.from("program_items").update({ sort_order: list[j].sort_order }).eq("id", list[i].id);
        await d.from("program_items").update({ sort_order: list[i].sort_order }).eq("id", list[j].id);
      }
      break;
    }
    case "seed": {
      const { count } = await d.from("program_items").select("id", { count: "exact", head: true });
      if (count) return bad("The program already has entries");
      await d.from("program_items").insert(SAMPLE.map((s, i) => ({ ...s, sort_order: i + 1 })));
      break;
    }
    case "finalise":
      await d.from("settings").upsert({ key: "program_finalised", value: b.value ? "true" : "false" });
      break;
    default:
      return bad("Unknown action");
  }
  return NextResponse.json({ ok: true });
}
