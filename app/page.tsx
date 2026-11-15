import { EVENT, PALETTE, directionsUrl } from "@/lib/event";
import ContactForm from "@/components/ContactForm";
import Getting from "@/components/Getting";
import FindInvite from "@/components/FindInvite";
import Vines from "@/components/Vines";
import Perks from "@/components/Perks";
import Arches from "@/components/Arches";
import ProgramModal from "@/components/ProgramModal";
import SiteNav from "@/components/SiteNav";
import Chat from "@/components/Chat";

const img = (f: string, a: string, b: string) => ({ backgroundImage: `url(/photos/${f}), linear-gradient(160deg, ${a}, ${b})` });

export default function Home({ searchParams }: { searchParams: { code?: string } }) {
  const code = String(searchParams.code || "").replace(/[^a-z0-9]/gi, "").slice(0, 12);
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  return (
    <div className="site">
      <Vines />
      <SiteNav />

      <section id="top" className="home-hero" style={img("hero.jpg", "#4B5A2A", "#C2571B")}>
        <div className="veil">
          <p className="small">Together with their families</p>
          <h1 className="names">{EVENT.groom}<span> and </span>{EVENT.bride}</h1>
          <p className="lead">invite you to their {EVENT.title}</p>
          <p className="when">{EVENT.date}, {EVENT.time}<br />{EVENT.venue}, {EVENT.address}</p>
          <Perks />
          <div className="cta">
            <a className="btn" href="#find">Find my invitation</a>
            <a className="btn ghost" href={directionsUrl()} target="_blank" rel="noreferrer">Get directions</a>
          </div>
        </div>
      </section>
      <div className="stripe">{PALETTE.map(([n, c]) => <i key={n} style={{ background: c }} />)}</div>

      <Arches className="wrap home-gallery" />

      <section id="day" className="wrap cards">
        <div className="card mustard"><h3>When</h3><p>{EVENT.date}</p><p>{EVENT.time}</p></div>
        <div className="card sage"><h3>Where</h3><p>{EVENT.venue}</p><p>{EVENT.address}</p></div>
        <div className="card burnt"><h3>Reply by</h3><p>{EVENT.rsvpBy}</p><p>Use the personal link we sent you.</p></div>
      </section>

      <section className="progbar"><ProgramModal label="View the program of the day" listen /></section>

      <section id="dress" className="dressband">
        <div className="wrap">
          <h2>Dress code: {EVENT.dressCode}</h2>
          <p>Elegant, relaxed and timeless. Wear the colours of a fall garden.</p>
          <ul className="swatches">{PALETTE.map(([n, c]) => <li key={n}><b style={{ background: c }} />{n}</li>)}</ul>
        </div>
      </section>

      <Getting />

      <section id="find" className="findband">
        <h2>Find your invitation</h2>
        <p>Type the invitation code from your message, then reply and save your card.</p>
        <FindInvite initialCode={code} />
      </section>

      <section id="contact" className="contact">
        <h2>Contact the family</h2>
        <p>Choose how you would like to reach us.</p>
        <ContactForm who="" whatsapp={wa} />
      </section>

      {process.env.GEMINI_API_KEY && <Chat />}

      <footer className="foot">
        <p>{EVENT.groom} and {EVENT.bride} &middot; {EVENT.title}</p>
        <a href="/admin">Admin sign in</a>
      </footer>
    </div>
  );
}
