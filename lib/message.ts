import { EVENT } from "./event";
export const phoneDigits = (p: string) => {
  const d = p.replace(/\D/g, "");
  return d.startsWith("0") ? "263" + d.slice(1) : d;
};
export const inviteText = (who: string, link: string) =>
  `Dear ${who}, you are warmly invited to the ${EVENT.title} of ${EVENT.groom} and ${EVENT.bride}. ` +
  `Dress code: ${EVENT.dressCode}. Open your personal invitation and let us know if you can make it: ${link}`;
