"use client";
import { useEffect, useState } from "react";
import { EVENT, PALETTE } from "@/lib/event";

type Item = { id: string; time: string; title: string; description: string | null };

export default function ProgramModal({ label = "View the program", className = "btn", listen = false }: { label?: string; className?: string; listen?: boolean }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<{ items: Item[]; finalised: boolean } | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!listen) return;
    const f = () => setOpen(true);
    window.addEventListener("open-program", f);
    return () => window.removeEventListener("open-program", f);
  }, [listen]);

  useEffect(() => {
    if (!open) return;
    setFailed(false);
    fetch("/api/program", { cache: "no-store" }).then((r) => r.json()).then(setData).catch(() => setFailed(true));
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <button className={className} onClick={() => setOpen(true)}>{label}</button>
      {open && (
        <div className="modal-back" onClick={() => setOpen(false)}>
          <div className="modal" role="dialog" aria-modal="true" aria-label="Program of the day" onClick={(e) => e.stopPropagation()}>
            <div className="stripe">{PALETTE.map(([n, c]) => <i key={n} style={{ background: c }} />)}</div>
            <div className="modal-in">
              <p className="small">{EVENT.groom} and {EVENT.bride}</p>
              <h2>Program of the day</h2>
              <p className="small">{EVENT.date}</p>
              {failed && <p className="status">The program could not load. Please try again.</p>}
              {!data && !failed && <p>Loading...</p>}
              {data && data.items.length === 0 && <p>The program will be shared soon.</p>}
              {data && data.items.length > 0 && (
                <table className="prog">
                  <tbody>
                    {data.items.map((it, i) => (
                      <tr key={it.id} style={{ borderLeftColor: PALETTE[i % PALETTE.length][1] }}>
                        <th scope="row">{it.time}</th>
                        <td><b>{it.title}</b>{it.description && <span>{it.description}</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div className="modal-btns">
                {data?.finalised && data.items.length > 0 && <a className="btn" href="/api/program/pdf" download>Download PDF</a>}
                <button className="close" onClick={() => setOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
