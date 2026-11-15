import { getGuest, greeting, hasDb } from "@/lib/db";
import { buildCardPdf } from "@/lib/cardPdf";
export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { code: string } }) {
  const g = await getGuest(params.code);
  if (!g) return new Response("Not found", { status: 404 });
  if (hasDb() && g.status !== "accepted") return new Response("Please accept the invitation first.", { status: 403 });
  let photo: Uint8Array | null = null;
  try {
    const r = await fetch(`${new URL(req.url).origin}/photos/couple.jpg`);
    if (r.ok) photo = new Uint8Array(await r.arrayBuffer());
  } catch { /* the card still works without the photo */ }
  const bytes = await buildCardPdf({ who: greeting(g), seats: g.max_party, photo });
  return new Response(new Uint8Array(bytes), {
    headers: { "Content-Type": "application/pdf", "Content-Disposition": 'attachment; filename="roora-day-invitation.pdf"', "Cache-Control": "no-store" },
  });
}
