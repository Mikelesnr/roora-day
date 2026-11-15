import { PDFDocument, PDFFont, StandardFonts, rgb } from "pdf-lib";
import { EVENT, PALETTE } from "./event";

type Row = { time: string; title: string; description: string | null };
const hex = (h: string) => { const n = parseInt(h.slice(1), 16); return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255); };
const clean = (s: string) =>
  s.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/[\u2013\u2014]/g, "-").replace(/[^\x20-\x7E\u00A0-\u00FF]/g, "");
function wrap(t: string, f: PDFFont, size: number, max: number) {
  const out: string[] = []; let line = "";
  for (const word of clean(t).split(/\s+/).filter(Boolean)) {
    const next = line ? line + " " + word : word;
    if (f.widthOfTextAtSize(next, size) > max && line) { out.push(line); line = word; } else line = next;
  }
  if (line) out.push(line);
  return out;
}

export async function buildProgramPdf(items: Row[], logo?: Uint8Array | null): Promise<Uint8Array> {
  const W = 595.28, H = 841.89, M = 56;
  const pdf = await PDFDocument.create();
  const serif = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const sans = await pdf.embedFont(StandardFonts.Helvetica);
  const sansB = await pdf.embedFont(StandardFonts.HelveticaBold);
  let page = pdf.addPage([W, H]); let y = 0;
  const stripe = () => { const sw = W / PALETTE.length; PALETTE.forEach(([, c], i) => page.drawRectangle({ x: i * sw, y: H - 12, width: sw, height: 12, color: hex(c) })); };
  const center = (t: string, f: PDFFont, s: number, c: ReturnType<typeof hex>) => { const x = clean(t); page.drawText(x, { x: (W - f.widthOfTextAtSize(x, s)) / 2, y, size: s, font: f, color: c }); };

  stripe(); y = H - 72;
  let logoDrawn = false;
  if (logo) {
    try {
      const lg = await pdf.embedPng(logo), lh = 72, lw = (lg.width * lh) / lg.height;
      page.drawImage(lg, { x: (W - lw) / 2, y: H - 22 - lh, width: lw, height: lh });
      logoDrawn = true;
    } catch { /* fall back to a text line */ }
  }
  if (!logoDrawn) center("Together with their families", sans, 11, hex("#4B5A2A"));
  y = H - 138;
  center(`${EVENT.groom} and ${EVENT.bride}`, serif, 32, hex("#8E3F1B")); y -= 26;
  center(`${EVENT.title} Program`, serif, 20, hex("#4A2518")); y -= 24;
  center(EVENT.date, sans, 11.5, hex("#4A2518")); y -= 16;
  center(`${EVENT.venue}, ${EVENT.address}`, sans, 10.5, hex("#4A2518")); y -= 20;
  page.drawRectangle({ x: W / 2 - 40, y, width: 80, height: 2.5, color: hex("#D9A021") }); y -= 30;

  const tx = M + 74, tw = W - M - tx;
  items.forEach((it, i) => {
    const tl = wrap(it.title, sansB, 12, tw), dl = wrap(it.description || "", sans, 10.5, tw);
    const h = 16 + tl.length * 15 + dl.length * 13.5 + (dl.length ? 4 : 0) + 10;
    if (y - h < 70) { page = pdf.addPage([W, H]); stripe(); y = H - 50; }
    page.drawRectangle({ x: M - 10, y: y - h, width: W - 2 * M + 20, height: h, color: hex(i % 2 ? "#FDF8EE" : "#F3E6CC") });
    page.drawRectangle({ x: M - 10, y: y - h, width: 4, height: h, color: hex(PALETTE[i % PALETTE.length][1]) });
    let ty = y - 20;
    page.drawText(clean(it.time), { x: M, y: ty, size: 13, font: serif, color: hex("#8E3F1B") });
    tl.forEach((l) => { page.drawText(l, { x: tx, y: ty, size: 12, font: sansB, color: hex("#4A2518") }); ty -= 15; });
    dl.forEach((l) => { page.drawText(l, { x: tx, y: ty, size: 10.5, font: sans, color: hex("#4A2518") }); ty -= 13.5; });
    y -= h;
  });
  y -= 28;
  if (y < 60) { page = pdf.addPage([W, H]); stripe(); y = H - 60; }
  center(`Dress code: ${EVENT.dressCode}`, sans, 10.5, hex("#4B5A2A"));
  return pdf.save();
}
