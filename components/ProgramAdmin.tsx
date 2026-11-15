"use client";
import { useCallback, useEffect, useState } from "react";
import type { Item } from "@/lib/program";

function Row({ it, first, last, act }: { it: Item; first: boolean; last: boolean; act: (b: object) => void }) {
  const [t, setT] = useState(it.time), [ti, setTi] = useState(it.title), [d, setD] = useState(it.description || "");
  const dirty = t !== it.time || ti !== it.title || d !== (it.description || "");
  return (
    <div className="prow">
      <input className="pt" value={t} onChange={(e) => setT(e.target.value)} aria-label="Time" />
      <input className="pn" value={ti} onChange={(e) => setTi(e.target.value)} aria-label="Title" />
      <input className="pd" value={d} onChange={(e) => setD(e.target.value)} aria-label="Details" placeholder="Details (optional)" />
      <div className="pb">
        <button disabled={first} onClick={() => act({ action: "move", id: it.id, dir: "up" })} aria-label="Move up">Up</button>
        <button disabled={last} onClick={() => act({ action: "move", id: it.id, dir: "down" })} aria-label="Move down">Down</button>
        <button className={dirty ? "yes" : ""} disabled={!dirty} onClick={() => act({ action: "update", id: it.id, time: t, title: ti, description: d })}>Save</button>
        <button onClick={() => confirm("Remove this entry?") && act({ action: "delete", id: it.id })}>Remove</button>
      </div>
    </div>
  );
}

export default function ProgramAdmin() {
  const [items, setItems] = useState<Item[]>([]);
  const [finalised, setFinalised] = useState(false);
  const [err, setErr] = useState("");
  const [n, setN] = useState({ time: "", title: "", description: "" });

  const load = useCallback(async () => {
    const r = await fetch("/api/admin/program");
    if (r.ok) { const j = await r.json(); setItems(j.items); setFinalised(j.finalised); }
  }, []);
  useEffect(() => { load(); }, [load]);

  async function act(body: object) {
    const r = await fetch("/api/admin/program", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setErr(r.ok ? "" : (await r.json()).error || "Something went wrong");
    await load();
    return r.ok;
  }

  return (
    <section className="padmin">
      <h2 className="names">Program</h2>
      <label className="switch">
        <input type="checkbox" checked={finalised} onChange={(e) => act({ action: "finalise", value: e.target.checked })} />
        <span>Finalised: {finalised ? "guests can see the Download PDF button" : "Download PDF is hidden (guests can still view the program)"}</span>
      </label>
      {err && <p className="status">{err}</p>}
      {items.length === 0 && <p>No entries yet. <button onClick={() => act({ action: "seed" })}>Load sample program</button></p>}
      {items.map((it, i) => <Row key={it.id + it.time + it.title + (it.description || "")} it={it} first={i === 0} last={i === items.length - 1} act={act} />)}
      <div className="prow add">
        <input className="pt" placeholder="Time" value={n.time} onChange={(e) => setN({ ...n, time: e.target.value })} />
        <input className="pn" placeholder="What happens" value={n.title} onChange={(e) => setN({ ...n, title: e.target.value })} />
        <input className="pd" placeholder="Details (optional)" value={n.description} onChange={(e) => setN({ ...n, description: e.target.value })} />
        <div className="pb"><button className="yes" onClick={async () => { if (await act({ action: "add", ...n })) setN({ time: "", title: "", description: "" }); }}>Add entry</button></div>
      </div>
    </section>
  );
}
