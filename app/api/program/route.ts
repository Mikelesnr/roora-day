import { NextResponse } from "next/server";
import { getProgram } from "@/lib/program";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    return NextResponse.json(await getProgram(), { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
