"use client";
import { useEffect, useRef, useState } from "react";

type M = { role: "user" | "bot"; text: string };
const ASKS = ["Where is it?", "What should I wear?", "How do I reply?", "How do I save my card?"];

export default function Chat({ code = "" }: { code?: string }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<M[]>([{ role: "bot", text: "Hello. I can help you with the invitation. What would you like to know?" }]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [msgs, open]);

  async function ask(q: string) {
    if (!q.trim() || busy) return;
    const next: M[] = [...msgs, { role: "user", text: q }];
    setMsgs(next); setText(""); setBusy(true);
    try {
      const r = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code, messages: next.slice(1) }) });
      const j = await r.json();
      setMsgs([...next, { role: "bot", text: j.reply || "Sorry, I could not answer just now." }]);
    } catch { setMsgs([...next, { role: "bot", text: "Sorry, something went wrong. Please try again." }]); }
    setBusy(false);
  }

  return (
    <>
      {!open && <button className="chat-fab" onClick={() => setOpen(true)}>Need help?</button>}
      {open && (
        <div className="chat" role="dialog" aria-label="Help">
          <div className="chat-head"><b>Invitation helper</b><button onClick={() => setOpen(false)}>Close</button></div>
          <div className="chat-body">
            {msgs.map((m, i) => <p key={i} className={`bubble ${m.role}`}>{m.text}</p>)}
            {busy && <p className="bubble bot">One moment...</p>}
            <div ref={end} />
          </div>
          <div className="chips">{ASKS.map((a) => <button key={a} onClick={() => ask(a)}>{a}</button>)}</div>
          <div className="chat-in">
            <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask(text)} placeholder="Type your question" maxLength={300} />
            <button className="yes" onClick={() => ask(text)} disabled={busy}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}
