import { NextResponse } from "next/server";
import { getGuest, greeting } from "@/lib/db";
import { EVENT, siteUrl } from "@/lib/event";

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) return NextResponse.json({ error: "Helper is off" }, { status: 404 });
  const { code, messages } = await req.json();
  const g = await getGuest(String(code));
  if (!g || !Array.isArray(messages)) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const system = `You are the friendly helper on the invitation website for the ${EVENT.title} of ${EVENT.groom} and ${EVENT.bride}. You are talking to ${greeting(g)}. Many guests are elderly and not comfortable with technology, so use short, warm, simple sentences and one step at a time. Reply in the language the guest writes in (English, Shona or Ndebele).
Facts you may use: date ${EVENT.date}; time ${EVENT.time}; venue ${EVENT.venue}, ${EVENT.address}; dress code ${EVENT.dressCode} (colours: sage green, olive green, burnt orange, rust brown, chocolate brown, mustard yellow, champagne gold); reply by ${EVENT.rsvpBy}. This guest has ${g.max_party} seat(s) held.
How to use the page: to reply, scroll to "Will you join us?" and press the green-orange "Joyfully accept" button, or "Send regrets"; to keep the card, press "Save your invitation card"; for directions, press "Get directions" in the Getting there section; to message the family, use the Contact section${wa ? ` or WhatsApp +${wa}` : ""}.
Never invent details. If you do not know something, say so kindly and suggest the Contact section. The invitation link is ${siteUrl()}/i/${g.code}.`;
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
