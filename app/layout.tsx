import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/event";
const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600"], style: ["normal", "italic"], variable: "--display" });
const contrast = Playfair_Display({ subsets: ["latin"], weight: ["700"], style: ["normal", "italic"], variable: "--contrast" });
const body = DM_Sans({ subsets: ["latin"], variable: "--body" });
export const metadata: Metadata = { metadataBase: new URL(siteUrl()), title: "Prince and Tatenda | Roora Day", description: "You are invited to the Roora Day of Prince and Tatenda." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body className={`${display.variable} ${body.variable} ${contrast.variable}`}>{children}</body></html>);
}
