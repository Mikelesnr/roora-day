import { getGuest, greeting, hasDb } from "@/lib/db";
import { buildCardPdf } from "@/lib/cardPdf";
import { loadLogo } from "@/lib/logo";
export const dynamic = "force-dynamic";

// This route only ever answers with the PDF or sends the guest back to a page.
// It never returns plain text, because a browser would save that as a "card.txt" download.
const back = (req: Request, path: string) => Response.redirect(new URL(path, req.url), 303);

export async function GET(req: Request, { params }: { params: { code: string } }) {
  try {
    const g = await getGuest(params.code);
    if (!g) return back(req, "/#find");
    if (hasDb() && g.status !== "accepted") return back(req, `/i/${g.code}`);
    let photo: Uint8Array | null = null;
    try {
      const r = await fetch(`${new URL(req.url).origin}/photos/couple.jpg`, { cache: "no-store" });
      if (r.ok) photo = new Uint8Array(await r.arrayBuffer());
    } catch { /* the card still works without the photo */ }
    const logo = await loadLogo(new URL(req.url).origin);
    const bytes = new Uint8Array(await buildCardPdf({ who: greeting(g), seats: g.max_party, photo, logo }));
    return new Response(bytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(bytes.length),
        "Content-Disposition": 'attachment; filename="roora-day-invitation.pdf"',
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return back(req, `/i/${params.code}`);
  }
}
