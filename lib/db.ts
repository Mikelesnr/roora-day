import { createClient } from "@supabase/supabase-js";
export const db = () =>
  createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
export type Guest = {
  id: string; code: string; name: string; family_name: string | null; email: string | null; phone: string | null;
  max_party: number; status: "pending" | "accepted" | "declined"; attending: number; note: string | null;
  responded_at: string | null; emailed_at: string | null; whatsapp_at: string | null; created_at: string;
};
export const greeting = (g: Pick<Guest, "name" | "family_name">) => g.family_name || g.name;
export const hasDb = () => !!process.env.SUPABASE_URL;

const DEMO: Guest = {
  id: "demo", code: "demo", name: "Tendai Moyo", family_name: "The Moyo Family", email: null, phone: null,
  max_party: 4, status: "pending", attending: 0, note: null, responded_at: null, emailed_at: null, whatsapp_at: null, created_at: "",
};
// With no database configured, /i/demo shows a sample guest so you can preview the design.
export async function getGuest(code: string): Promise<Guest | null> {
  if (!hasDb()) return code === "demo" ? DEMO : null;
  const { data } = await db().from("guests").select("*").eq("code", code).single();
  return (data as Guest) || null;
}
