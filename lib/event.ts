export const EVENT = {
  groom: "Prince",
  bride: "Tatenda",
  title: "Roora Day",
  date: "Sunday, 13 December 2026",
  time: "11:30 AM",
  venue: "Family Home",
  address: "3 Alexander Road, Highlands, Harare",
  dressCode: "Fall Garden Luncheon",
  rsvpBy: "1 December 2026",
};
export const PALETTE = [
  ["Sage Green", "#8A9A6B"], ["Olive Green", "#4B5A2A"], ["Burnt Orange", "#C2571B"],
  ["Rust Brown", "#8E3F1B"], ["Chocolate Brown", "#4A2518"], ["Mustard Yellow", "#D9A021"],
  ["Champagne Gold", "#EBD3A8"],
] as const;
// For an exact pin, replace with latitude,longitude such as "-17.80,31.08"
export const MAP_QUERY = `${EVENT.address}, Zimbabwe`;
export const mapEmbedUrl = () => `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`;
export const directionsUrl = () => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAP_QUERY)}`;
export const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || "http://localhost:3000";
