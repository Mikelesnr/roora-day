"use client";
import { useEffect, useState } from "react";
import ProgramModal from "./ProgramModal";
import Perks from "./Perks";
import { EVENT, PALETTE } from "@/lib/event";

// An empty href means "open the program popup"
const LINKS: [string, string][] = [
  ["The day", "#day"], ["Program", ""], ["Dress code", "#dress"],
  ["Directions", "#map"], ["Contact", "#contact"], ["My invitation", "#find"],
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => { window.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);
  const showProgram = () => { setOpen(false); setTimeout(() => window.dispatchEvent(new Event("open-program")), 500); };

  return (
    <header className={`nav${open ? " is-open" : ""}`}>
      <a className="logo" href="#top" onClick={close}>P &amp; T</a>
      <nav className="nav-links" aria-label="Main">
        <a href="#day">The day</a>
        <ProgramModal label="Program" className="linkbtn" />
        <a href="#dress">Dress code</a><a href="#map">Directions</a><a href="#contact">Contact</a>
      </nav>
      <div className="navr">
        <a className="tl" href="#find">My invitation</a>
        <a className="btn small adm" href="/admin">Admin sign in</a>
        <button className="burger" aria-expanded={open} aria-controls="menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
      </div>

      <div id="menu" className={`menu${open ? " open" : ""}`} aria-hidden={!open}>
        <div className="menu-stripe">{PALETTE.map(([n, c]) => <i key={n} style={{ background: c }} />)}</div>
        <div className="menu-vine" />
        <div className="menu-in">
          <nav aria-label="Menu">
            <ul>
              {LINKS.map(([label, href], i) => (
                <li key={label} style={{ "--i": i } as React.CSSProperties}>
                  {href
                    ? <a href={href} onClick={close} tabIndex={open ? 0 : -1}><i className="dot" style={{ background: PALETTE[i][1] }} />{label}</a>
                    : <button className="mbtn" onClick={showProgram} tabIndex={open ? 0 : -1}><i className="dot" style={{ background: PALETTE[i][1] }} />{label}</button>}
                </li>
              ))}
            </ul>
          </nav>
          <div className="menu-foot">
            <p>{EVENT.groom} and {EVENT.bride}<br />{EVENT.date}</p>
            <Perks />
            <a className="menu-admin" href="/admin" tabIndex={open ? 0 : -1}>Admin sign in</a>
          </div>
        </div>
      </div>
    </header>
  );
}
