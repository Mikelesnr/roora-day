import { getGuest, greeting, hasDb } from "@/lib/db";
import { renderCard } from "@/lib/card";
import { siteUrl } from "@/lib/event";
export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { code: string } }) {
  const g = await getGuest(params.code);
  if (!g) return new Response("Not found", { status: 404 });
  const origin = new URL(req.url).origin || siteUrl();
  if (hasDb() && g.status !== "accepted") return new Response("Please accept the invitation first.", { status: 403 });
  return renderCard(greeting(g), g.max_party, 1080, 1350, origin, {
    "Content-Disposition": 'attachment; filename="roora-day-invitation.png"',
  });
}
