import {
  PDFDocument, PDFFont, StandardFonts, rgb, pushGraphicsState, popGraphicsState, moveTo, lineTo,
  appendBezierCurve, closePath, clip, endPath, fill, setFillingRgbColor,
} from "pdf-lib";
import { EVENT, PALETTE } from "./event";

const hex = (h: string) => { const n = parseInt(h.slice(1), 16); return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255); };
const clean = (s: string) =>
  s.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/[\u2013\u2014]/g, "-").replace(/[^\x20-\x7E\u00A0-\u00FF]/g, "");

// Rectangle with a semicircle on top, the same arch as on the site
const arch = (x: number, y: number, w: number, h: number) => {
  const r = w / 2, k = 0.5523 * r;
  return [
    moveTo(x, y), lineTo(x, y + h - r),
    appendBezierCurve(x, y + h - r + k, x + r - k, y + h, x + r, y + h),
    appendBezierCurve(x + r + k, y + h, x + w, y + h - r + k, x + w, y + h - r),
    lineTo(x + w, y), closePath(),
  ];
};

export async function buildCardPdf(o: { who: string; seats: number; photo: Uint8Array | null }): Promise<Uint8Array> {
  const W = 419.53, H = 595.28;
  const pdf = await PDFDocument.create();
  const serif = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const serifI = await pdf.embedFont(StandardFonts.TimesRomanItalic);
  const sans = await pdf.embedFont(StandardFonts.Helvetica);
  const sansB = await pdf.embedFont(StandardFonts.HelveticaBold);
  const page = pdf.addPage([W, H]);
  let y = 0;
  const center = (t: string, f: PDFFont, size: number, color: ReturnType<typeof hex>, max = W - 60) => {
    const x = clean(t); let s = size;
    while (s > 12 && f.widthOfTextAtSize(x, s) > max) s -= 1;
    page.drawText(x, { x: (W - f.widthOfTextAtSize(x, s)) / 2, y, size: s, font: f, color });
  };
  const fillArch = (x: number, yy: number, w: number, h: number, c: ReturnType<typeof hex>) =>
    page.pushOperators(pushGraphicsState(), setFillingRgbColor(c.red, c.green, c.blue), ...arch(x, yy, w, h), fill(), popGraphicsState());

  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: hex("#FDF8EE") });
  const sw = W / PALETTE.length;
  PALETTE.forEach(([, c], i) => page.drawRectangle({ x: i * sw, y: H - 10, width: sw, height: 10, color: hex(c) }));
  PALETTE.forEach(([, c], i) => page.drawRectangle({ x: i * sw, y: 0, width: sw, height: 6, color: hex(c) }));

  y = H - 42; center("Together with their families", sans, 9.5, hex("#4B5A2A"));
  y = H - 76; center(`${EVENT.groom} and ${EVENT.bride}`, serif, 27, hex("#8E3F1B"));
  y = H - 96; center(`invite you to their ${EVENT.title}`, serifI, 12.5, hex("#4A2518"));

  // framed arch photo
  const aw = 170, ah = 215, ax = (W - aw) / 2, ay = H - 112 - ah, inset = 9;
  fillArch(ax, ay, aw, ah, hex("#D9A021"));
  const bx = ax + inset, by = ay + inset, bw = aw - 2 * inset, bh = ah - 2 * inset;
  page.pushOperators(pushGraphicsState(), ...arch(bx, by, bw, bh), clip(), endPath());
  let drawn = false;
  if (o.photo) {
    try {
      let img;
      try { img = await pdf.embedJpg(o.photo); } catch { img = await pdf.embedPng(o.photo); }
      const sc = Math.max(bw / img.width, bh / img.height), dw = img.width * sc, dh = img.height * sc;
      page.drawImage(img, { x: bx + (bw - dw) / 2, y: by + bh - dh, width: dw, height: dh });
      drawn = true;
    } catch { /* fall back to a colour fill */ }
  }
  if (!drawn) fillArch(bx, by, bw, bh, hex("#C2571B"));
  page.pushOperators(popGraphicsState());

  y = ay - 20; center("Reserved for", sans, 9.5, hex("#4B5A2A"));
  y -= 26; center(o.who, serif, 26, hex("#8E3F1B"), W - 70);
  y -= 20; center(o.seats === 1 ? "One seat is held in your name" : `${o.seats} seats are held for your family`, sans, 11, hex("#4A2518"));
  y -= 18; page.drawRectangle({ x: W / 2 - 30, y, width: 60, height: 2, color: hex("#D9A021") });
  y -= 22; center(EVENT.date, sansB, 11.5, hex("#4A2518"));
  y -= 16; center(EVENT.time, sans, 11, hex("#4A2518"));
  y -= 18; center(EVENT.venue, sans, 11, hex("#4A2518"));
  y -= 14; center(EVENT.address, sans, 10.5, hex("#4A2518"));
  y -= 28; center(`Dress code: ${EVENT.dressCode}`, sans, 10, hex("#4B5A2A"));
  const gap = 26, total = (PALETTE.length - 1) * gap, sx = (W - total) / 2;
  PALETTE.forEach(([, c], i) => page.drawCircle({ x: sx + i * gap, y: y - 22, size: 8, color: hex(c) }));
  return pdf.save();
}
