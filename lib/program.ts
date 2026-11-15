import { db, hasDb } from "./db";
export type Item = { id: string; sort_order: number; time: string; title: string; description: string | null };

// Sample entries. Replace them from the admin panel.
export const SAMPLE: Omit<Item, "id" | "sort_order">[] = [
  { time: "09:00", title: "Guests arrive and are seated", description: "Ushers will show you to your seats in the garden." },
  { time: "10:00", title: "Opening prayer and welcome", description: "The families are welcomed and the day is opened in prayer." },
  { time: "10:30", title: "Arrival of the groom's family", description: null },
  { time: "11:00", title: "Introductions of the two families", description: null },
  { time: "11:30", title: "Roora presentation", description: "The roora is presented and received." },
  { time: "13:00", title: "Blessing and acceptance", description: null },
  { time: "13:30", title: "Garden luncheon", description: "Join us for lunch under the trees." },
  { time: "15:00", title: "Music and celebration", description: null },
  { time: "17:00", title: "Closing and farewell", description: "Thank you for celebrating with us." },
];

export async function getProgram(): Promise<{ items: Item[]; finalised: boolean }> {
  // With no database configured the sample shows as finalised so the whole flow can be previewed.
  if (!hasDb()) return { items: SAMPLE.map((s, i) => ({ ...s, id: String(i), sort_order: i + 1 })), finalised: true };
  const d = db();
  const [a, b] = await Promise.all([
    d.from("program_items").select("*").order("sort_order"),
    d.from("settings").select("value").eq("key", "program_finalised").maybeSingle(),
  ]);
  return { items: (a.data || []) as Item[], finalised: b.data?.value === "true" };
}
