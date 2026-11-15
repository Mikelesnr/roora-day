import { EVENT } from "./event";
// When true the link also carries the code, so the code box on the home page is already filled in.
export const PREFILL_CODE = true;
export const phoneDigits = (p: string) => {
  const d = p.replace(/\D/g, "");
  return d.startsWith("0") ? "263" + d.slice(1) : d;
};
export const inviteLink = (base: string, code: string) => `${base}/${PREFILL_CODE ? `?code=${code}` : ""}#find`;
export const inviteText = (who: string, code: string, link: string) =>
  `Dear ${who}, you are warmly invited to the ${EVENT.title} of ${EVENT.groom} and ${EVENT.bride} on ${EVENT.date}. ` +
  `Open your invitation here: ${link}\nYour invitation code: ${code}\nDress code: ${EVENT.dressCode}`;
