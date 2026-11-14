"use client";
import { useState } from "react";

export default function ContactForm({ who, whatsapp }: { who: string; whatsapp: string }) {
  const [mode, setMode] = useState<"whatsapp" | "email">("whatsapp");
  const [name, setName] = useState(who);
  const [reply, setReply] = useState("");
  const [message, setMessage] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const wa = `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hello, this is ${name}. ${message}`.trim())}`;

  async function sendEmail() {
    setBusy(true); setMsg("");
    const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, reply, message }) });
    setBusy(false);
    setMsg(r.ok ? "Your message has been sent. Thank you." : (await r.json()).error || "Your message did not go through. Please try WhatsApp.");
    if (r.ok) setMessage("");
  }

  return (
    <div className="form">
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={mode === "whatsapp"} className={mode === "whatsapp" ? "on" : ""} onClick={() => setMode("whatsapp")}>WhatsApp</button>
        <button role="tab" aria-selected={mode === "email"} className={mode === "email" ? "on" : ""} onClick={() => setMode("email")}>Email</button>
      </div>
      <label>Your name<input value={name} onChange={(e) => setName(e.target.value)} /></label>
      {mode === "email" && <label>Your email or phone, so we can reply<input value={reply} onChange={(e) => setReply(e.target.value)} /></label>}
      <label>Your message<textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1500} /></label>
      {mode === "whatsapp"
        ? <a className="btn wa" href={wa} target="_blank" rel="noreferrer">Open WhatsApp to send</a>
        : <button className="yes big" disabled={busy} onClick={sendEmail}>Send email</button>}
      {msg && <p className="status" role="status">{msg}</p>}
    </div>
  );
}
