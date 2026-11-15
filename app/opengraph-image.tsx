import { renderCard } from "@/lib/card";
import { siteUrl } from "@/lib/event";
export const dynamic = "force-dynamic";
export const alt = "Prince and Tatenda, Roora Day";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return renderCard(null, 0, 1200, 630, siteUrl());
}
