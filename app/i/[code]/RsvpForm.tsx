"use client";
import { useState } from "react";

export default function RsvpForm(p: { code: string; max: number; status: string; attending: number; note: string }) {
  const [status, setStatus] = useState(p.status);
  const [count, setCount] = useState(p.attending || p.max);
  const [note, setNote] = useState(p.note);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function send(s: "accepted" | "declined") {
    setBusy(true); setMsg("");
    const r = await fetch("/api/rsvp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: p.code, status: s, attending: count, note }) });
    setBusy(false);
    if (r.ok) { setStatus(s); setMsg(s === "accepted" ? "Thank you. We have you down and cannot wait to celebrate with you." : "Thank you for letting us know. You will be missed."); }
    else setMsg("Your reply did not go through. Please try again.");
  }

  return (
    <div className="form">
      {status !== "pending" && !msg && <p className="status">Your reply: {status === "accepted" ? `attending, ${p.attending} of ${p.max}` : "unable to attend"}. You can change it below.</p>}
      {p.max > 1 && (
        <label>How many of you are coming?
          <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
            {Array.from({ length: p.max }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      )}
      <label>A message for the couple (optional)
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} maxLength={500} />
      </label>
      <div className="btns">
        <button disabled={busy} className="yes" onClick={() => send("accepted")}>Joyfully accept</button>
        <button disabled={busy} className="no" onClick={() => send("declined")}>Send regrets</button>
      </div>
      {msg && <p className="status" role="status">{msg}</p>}
      {status === "accepted" && <a className="btn" href={`/i/${p.code}/card`} download>Save your invitation card</a>}
    </div>
  );
}
