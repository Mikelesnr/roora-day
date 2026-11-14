import { getGuest, greeting } from "@/lib/db";
import { renderCard } from "@/lib/card";
import { siteUrl } from "@/lib/event";
export const alt = "Your Roora Day invitation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { code: string } }) {
  const g = await getGuest(params.code);
  return renderCard(g ? greeting(g) : "Our guest", g?.max_party ?? 1, 1200, 630, siteUrl());
}
