import { getGuest, greeting } from "@/lib/db";
import { renderCard } from "@/lib/card";
import { siteUrl } from "@/lib/event";
export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { code: string } }) {
  const g = await getGuest(params.code);
  if (!g) return new Response("Not found", { status: 404 });
  const origin = new URL(req.url).origin || siteUrl();
  return renderCard(greeting(g), g.max_party, 1080, 1350, origin, {
    "Content-Disposition": 'attachment; filename="roora-day-invitation.png"',
  });
}
