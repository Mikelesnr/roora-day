import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";
import { EVENT, PALETTE } from "./event";

async function loadFont() {
  try { return await readFile(path.join(process.cwd(), "lib/fonts/cormorant-600.woff")); } catch { return null; }
}
async function loadPhoto(origin: string) {
  try {
    const r = await fetch(`${origin}/photos/couple-2.jpg`);
    if (!r.ok) return null;
    return `data:${r.headers.get("content-type") || "image/jpeg"};base64,${Buffer.from(await r.arrayBuffer()).toString("base64")}`;
  } catch { return null; }
}

export async function renderCard(who: string, seats: number, w: number, h: number, origin: string, headers?: Record<string, string>) {
  const [font, photo] = await Promise.all([loadFont(), loadPhoto(origin)]);
  const wide = w > h;
  const fam = font ? "Cormorant" : "sans-serif";
  const aw = wide ? 300 : 440, ah = wide ? 440 : 600;
  const arch = (
    <div style={{ display: "flex", width: aw, height: ah, borderRadius: "999px 999px 0 0", overflow: "hidden", background: "linear-gradient(160deg,#C2571B,#8E3F1B)" }}>
      {photo ? <img src={photo} width={aw} height={ah} style={{ objectFit: "cover" }} /> : null}
    </div>
  );
  const names = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#EBD3A8" }}>
      <div style={{ display: "flex", fontSize: wide ? 26 : 34, fontFamily: "sans-serif" }}>Together with their families</div>
      <div style={{ display: "flex", fontSize: wide ? 78 : 118, lineHeight: 1.05, marginTop: 10 }}>{`${EVENT.groom} and ${EVENT.bride}`}</div>
      <div style={{ display: "flex", fontSize: wide ? 26 : 34, fontFamily: "sans-serif", marginTop: 10 }}>{`invite you to their ${EVENT.title}`}</div>
    </div>
  );
  const info = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: wide ? "0 40px" : "56px 60px 0", flex: 1, justifyContent: wide ? "center" : "flex-start" }}>
      <div style={{ display: "flex", fontSize: wide ? 24 : 30, color: "#4B5A2A", fontFamily: "sans-serif" }}>Reserved for</div>
      <div style={{ display: "flex", fontSize: wide ? 64 : 92, color: "#8E3F1B", lineHeight: 1.1, margin: "6px 0 14px" }}>{who}</div>
      <div style={{ display: "flex", fontSize: wide ? 24 : 32, fontFamily: "sans-serif" }}>{seats === 1 ? "One seat is held in your name" : `${seats} seats are held for your family`}</div>
      <div style={{ display: "flex", fontSize: wide ? 24 : 32, fontFamily: "sans-serif", marginTop: 22 }}>{`${EVENT.date}, ${EVENT.time}`}</div>
      <div style={{ display: "flex", fontSize: wide ? 24 : 32, fontFamily: "sans-serif", marginTop: 6 }}>{`${EVENT.venue}, ${EVENT.address}`}</div>
      <div style={{ display: "flex", fontSize: wide ? 22 : 30, fontFamily: "sans-serif", marginTop: 22, color: "#C2571B" }}>{`Dress code: ${EVENT.dressCode}`}</div>
    </div>
  );
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: "#FDF8EE", color: "#4A2518", fontFamily: fam }}>
        <div style={{ display: "flex", height: 16 }}>{PALETTE.map(([n, c]) => <div key={n} style={{ flex: 1, background: c }} />)}</div>
        {wide ? (
          <div style={{ display: "flex", flex: 1 }}>
            <div style={{ display: "flex", width: 400, background: "#4A2518", alignItems: "flex-end", justifyContent: "center" }}>{arch}</div>
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <div style={{ display: "flex", background: "#4A2518", justifyContent: "center", padding: "32px 20px" }}>{names}</div>
              {info}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "#4A2518", paddingTop: 56 }}>
              {names}
              <div style={{ display: "flex", marginTop: 40 }}>{arch}</div>
            </div>
            {info}
          </div>
        )}
      </div>
    ),
    { width: w, height: h, headers, fonts: font ? [{ name: "Cormorant", data: font, weight: 600, style: "normal" }] : undefined }
  );
}
