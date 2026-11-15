// The logo is fetched from the site itself, like the couple photo, so it works on serverless hosting.
export async function loadLogo(origin: string): Promise<Uint8Array | null> {
  try {
    const r = await fetch(`${origin}/logo.png`, { cache: "no-store" });
    return r.ok ? new Uint8Array(await r.arrayBuffer()) : null;
  } catch { return null; }
}
