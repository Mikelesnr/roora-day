import { NextResponse } from "next/server";
import { getGuest, greeting } from "@/lib/db";
import { EVENT, siteUrl } from "@/lib/event";

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) return NextResponse.json({ error: "Helper is off" }, { status: 404 });
  const { code, messages } = await req.json();
  const g = code ? await getGuest(String(code)) : null;
  if ((code && !g) || !Array.isArray(messages)) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const who = g
    ? `You are talking to ${greeting(g)}.`
    : `You are talking to a guest who has not opened a personal invitation yet. If they want to reply or save their card, tell them to type their invitation code in the "Find your invitation" section of the home page.`;
  const seats = g ? `This guest has ${g.max_party} seat(s) held.` : "";
  const link = g ? `The invitation link is ${siteUrl()}/i/${g.code}.` : "";
  const system = `You are the friendly helper on the invitation website for the ${EVENT.title} of ${EVENT.groom} and ${EVENT.bride}. ${who} Many guests are elderly and not comfortable with technology, so use short, warm, simple sentences and one step at a time. Reply in the language the guest writes in (English, Shona or Ndebele).
Facts you may use: date ${EVENT.date}; time ${EVENT.time}; venue ${EVENT.venue}, ${EVENT.address}; dress code ${EVENT.dressCode} (colours: sage green, olive green, burnt orange, rust brown, chocolate brown, mustard yellow, champagne gold); reply by ${EVENT.rsvpBy}. ${seats}
How to use the page: to reply, scroll to "Will you join us?" and press the green-orange "Joyfully accept" button, or "Send regrets"; after pressing "Joyfully accept", a "Save your invitation card" button appears under the reply buttons (the card can only be saved after accepting); to see the order of the day, press "View the program of the day"; for directions, press "Get directions" in the Getting there section; to message the family, use the Contact section${wa ? ` or WhatsApp +${wa}` : ""}.
Never invent details. If you do not know something, say so kindly and suggest the Contact section. ${link}`;
  const contents = messages.slice(-10).map((m: { role: string; text: string }) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: String(m.text).slice(0, 500) }],
  }));
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
    body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents, generationConfig: { maxOutputTokens: 500, temperature: 0.4 } }),
  });
  if (!r.ok) return NextResponse.json({ reply: "Sorry, I could not answer just now. Please use the Contact section to reach the family." });
  const j = await r.json();
  const reply = j.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || "").join("") || "Sorry, I did not understand. Please try again.";
  return NextResponse.json({ reply });
}
