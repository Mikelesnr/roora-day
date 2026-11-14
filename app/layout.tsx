import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600"], style: ["normal", "italic"], variable: "--display" });
const body = DM_Sans({ subsets: ["latin"], variable: "--body" });
export const metadata: Metadata = { title: "Prince and Tatenda | Roora Day", description: "You are invited to the Roora Day of Prince and Tatenda." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body className={`${display.variable} ${body.variable}`}>{children}</body></html>);
}
