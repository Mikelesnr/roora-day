"use client";
import { useCallback, useEffect, useState } from "react";
import { inviteText, phoneDigits } from "@/lib/message";
import type { Guest } from "@/lib/db";

export default function Admin() {
  const [guests, setGuests] = useState<Guest[] | null>(null);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [form, setForm] = useState({ name: "", family_name: "", email: "", phone: "", max_party: 1 });

  const load = useCallback(async () => {
    const r = await fetch("/api/admin/guests");
    if (r.ok) setGuests((await r.json()).guests); else setGuests(null);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function login() {
    const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    if (r.ok) { setErr(""); load(); } else setErr("Wrong password");
  }
  async function add() {
    const r = await fetch("/api/admin/guests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (r.ok) { setForm({ name: "", family_name: "", email: "", phone: "", max_party: 1 }); load(); } else setErr((await r.json()).error);
  }
  async function remove(id: string) { if (confirm("Remove this guest?")) { await fetch(`/api/admin/guests?id=${id}`, { method: "DELETE" }); load(); } }
  async function email(id: string) {
    const r = await fetch("/api/admin/email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setErr(r.ok ? "" : (await r.json()).error); load();
  }
  async function whatsapp(g: Guest) {
    const link = `${location.origin}/i/${g.code}`;
    window.open(`https://wa.me/${phoneDigits(g.phone!)}?text=${encodeURIComponent(inviteText(g.family_name || g.name, link))}`, "_blank");
    await fetch("/api/admin/guests", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: g.id }) });
    load();
  }

  if (!guests) return (
    <main className="plain"><h1 className="names">Guest list</h1>
      <div className="form"><label>Admin password<input type="password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()} /></label>
        <button className="yes" onClick={login}>Sign in</button>{err && <p className="status">{err}</p>}</div></main>
  );

  const seats = guests.reduce((a, g) => a + g.max_party, 0);
  const yes = guests.filter((g) => g.status === "accepted");
  const coming = yes.reduce((a, g) => a + g.attending, 0);
  const stats: [string, number][] = [["Invitations", guests.length], ["Seats offered", seats], ["Coming", coming], ["Accepted", yes.length], ["Declined", guests.filter((g) => g.status === "declined").length], ["Waiting", guests.filter((g) => g.status === "pending").length]];

  return (
    <main className="admin">
      <h1 className="names">Guest list</h1>
      <div className="stats">{stats.map(([l, n]) => <div key={l}><b>{n}</b>{l}</div>)}</div>
      <div className="addrow">
        <input placeholder="Guest name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Family label, e.g. The Moyo Family" value={form.family_name} onChange={(e) => setForm({ ...form, family_name: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="WhatsApp, e.g. 0772 123 456" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input type="number" min={1} max={20} title="Seats" value={form.max_party} onChange={(e) => setForm({ ...form, max_party: Number(e.target.value) })} />
        <button className="yes" onClick={add}>Add guest</button>
      </div>
      {err && <p className="status">{err}</p>}
      <div className="scroll"><table>
        <thead><tr><th>Guest</th><th>Seats</th><th>Reply</th><th>Coming</th><th>Message</th><th>Send</th><th /></tr></thead>
        <tbody>{guests.map((g) => (
          <tr key={g.id}>
            <td>{g.family_name || g.name}<small>{g.family_name ? g.name : ""}</small></td>
            <td>{g.max_party}</td>
            <td><span className={`tag ${g.status}`}>{g.status}</span></td>
            <td>{g.attending || ""}</td>
            <td>{g.note}</td>
            <td className="acts">
              {g.phone && <button onClick={() => whatsapp(g)}>{g.whatsapp_at ? "WhatsApp again" : "WhatsApp"}</button>}
              {g.email && <button onClick={() => email(g.id)}>{g.emailed_at ? "Email again" : "Email"}</button>}
              <button onClick={() => navigator.clipboard.writeText(`${location.origin}/i/${g.code}`)}>Copy link</button>
            </td>
            <td><button onClick={() => remove(g.id)}>Remove</button></td>
          </tr>))}</tbody>
      </table></div>
    </main>
  );
}
