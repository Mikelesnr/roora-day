import { notFound } from "next/navigation";
import { getGuest, greeting } from "@/lib/db";
import { EVENT, PALETTE } from "@/lib/event";
import RsvpForm from "./RsvpForm";
import ContactForm from "@/components/ContactForm";
import Getting from "@/components/Getting";
import Chat from "./Chat";
export const dynamic = "force-dynamic";

const photo = (n: number, a: string, b: string) => ({
  backgroundImage: `url(/photos/couple-${n}.jpg), linear-gradient(160deg, ${a}, ${b})`,
});

export default async function Invite({ params }: { params: { code: string } }) {
  const g = await getGuest(params.code);
  if (!g) notFound();
  const who = greeting(g);
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  return (
    <main>
      <div className="stripe">{PALETTE.map(([n, c]) => <i key={n} style={{ background: c }} />)}</div>
      <section className="hero">
        <p className="small">Together with their families</p>
        <h1 className="names">{EVENT.groom}<span> and </span>{EVENT.bride}</h1>
        <p className="small">invite you to their {EVENT.title}</p>
      </section>
      <section className="arches">
        <div className="arch" style={photo(1, "#8A9A6B", "#4B5A2A")} />
        <div className="arch tall" style={photo(2, "#C2571B", "#8E3F1B")} />
        <div className="arch" style={photo(3, "#D9A021", "#C2571B")} />
      </section>
      <section className="plate">
        <p className="small">Reserved for</p>
        <h2>{who}</h2>
        <p>{g.max_party === 1 ? "One seat is held in your name" : `${g.max_party} seats are held for your family`}</p>
        <a className="btn" href={`/i/${g.code}/card`} download>Save your invitation card</a>
      </section>
      <section className="details">
        <div><h3>When</h3><p>{EVENT.date}</p><p>{EVENT.time}</p></div>
        <div><h3>Where</h3><p>{EVENT.venue}</p><p>{EVENT.address}</p></div>
        <div className="dress">
          <h3>Dress code: {EVENT.dressCode}</h3>
          <p>Wear the colours of a fall garden.</p>
          <ul>{PALETTE.map(([n, c]) => <li key={n}><b style={{ background: c }} />{n}</li>)}</ul>
        </div>
      </section>
      <Getting />
      <section className="rsvp">
        <h2>Will you join us?</h2>
        <p className="small">Please reply by {EVENT.rsvpBy}</p>
        <RsvpForm code={g.code} max={g.max_party} status={g.status} attending={g.attending} note={g.note || ""} />
      </section>
      <section className="contact">
        <h2>Contact the family</h2>
        <p>Choose how you would like to reach us.</p>
        <ContactForm who={who} whatsapp={wa} />
      </section>
      {process.env.GEMINI_API_KEY && <Chat code={g.code} />}
    </main>
  );
}
